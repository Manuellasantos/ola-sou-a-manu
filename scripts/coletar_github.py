"""Coleta dados públicos do meu GitHub e salva o resultado bruto em data/raw/.

Fontes:
- API REST do GitHub: perfil, repositórios e linguagens de cada repositório.
- API GraphQL do GitHub: calendário de contribuições (precisa de token).

O token é lido da variável de ambiente GITHUB_TOKEN e nunca vai para o frontend.
Sem token, a coleta continua só com a API REST (limite de 60 requisições/hora)
e o calendário de contribuições fica de fora.

Uso:
    python scripts/coletar_github.py
"""

import os
import sys

import requests

from utils import PASTA_BRUTA, agora_iso, salvar_json

USUARIO = os.environ.get("GITHUB_USER", "Manuellasantos")
API = "https://api.github.com"

# Repositórios de projetos em equipe que estão em contas de outras pessoas
REPOS_EXTERNOS = [
    "Cosmic-Bubble/projetolavanderia",
    "nanda-marques/nossasCores",
    "alesslatorre/somos-vagalume",
    "nanda-marques/fic2026-fatec-sebrae-hackeridos",
]

CONSULTA_CONTRIBUICOES = """
query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      startedAt
      endedAt
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
  }
}
"""


def criar_sessao() -> requests.Session:
    sessao = requests.Session()
    sessao.headers["Accept"] = "application/vnd.github+json"
    sessao.headers["User-Agent"] = "portfolio-data-script"
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        sessao.headers["Authorization"] = f"Bearer {token}"
    return sessao


def buscar(sessao: requests.Session, caminho: str, **params):
    resposta = sessao.get(f"{API}{caminho}", params=params, timeout=30)
    resposta.raise_for_status()
    return resposta.json()


def buscar_repositorios(sessao):
    """Lista todos os repositórios públicos do usuário (com paginação)."""
    repos, pagina = [], 1
    while True:
        lote = buscar(sessao, f"/users/{USUARIO}/repos", per_page=100, page=pagina, type="owner")
        repos.extend(lote)
        if len(lote) < 100:
            return repos
        pagina += 1


def resumir_repo(sessao, repo: dict, externo: bool) -> dict:
    """Guarda só os campos que a análise usa, mais as linguagens em bytes."""
    linguagens = buscar(sessao, f"/repos/{repo['full_name']}/languages")
    return {
        "nome": repo["name"],
        "nome_completo": repo["full_name"],
        "descricao": repo.get("description"),
        "criado_em": repo["created_at"],
        "atualizado_em": repo["pushed_at"],
        "linguagem_principal": repo.get("language"),
        "linguagens_bytes": linguagens,
        "topicos": repo.get("topics", []),
        "fork": repo["fork"],
        "estrelas": repo["stargazers_count"],
        "externo": externo,
    }


def buscar_contribuicoes(sessao):
    if "Authorization" not in sessao.headers:
        print("  sem GITHUB_TOKEN: calendário de contribuições não será coletado")
        return None
    resposta = sessao.post(
        f"{API}/graphql",
        json={"query": CONSULTA_CONTRIBUICOES, "variables": {"login": USUARIO}},
        timeout=30,
    )
    resposta.raise_for_status()
    corpo = resposta.json()
    if "errors" in corpo:
        print("  erro no GraphQL:", corpo["errors"][0].get("message"))
        return None
    return corpo["data"]["user"]["contributionsCollection"]


def main() -> int:
    sessao = criar_sessao()
    print(f"Coletando dados públicos de {USUARIO}...")

    perfil = buscar(sessao, f"/users/{USUARIO}")
    repos = [resumir_repo(sessao, r, externo=False) for r in buscar_repositorios(sessao)]
    for nome in REPOS_EXTERNOS:
        try:
            repos.append(resumir_repo(sessao, buscar(sessao, f"/repos/{nome}"), externo=True))
        except requests.HTTPError as erro:
            print(f"  não foi possível ler {nome}: {erro}")

    dados = {
        "coletado_em": agora_iso(),
        "usuario": USUARIO,
        "perfil": {
            "nome": perfil.get("name"),
            "repos_publicos": perfil["public_repos"],
            "conta_criada_em": perfil["created_at"],
        },
        "repositorios": repos,
        "contribuicoes": buscar_contribuicoes(sessao),
    }
    salvar_json(dados, PASTA_BRUTA / "github_bruto.json")
    return 0


if __name__ == "__main__":
    sys.exit(main())
