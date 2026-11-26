"""Transforma os dados brutos do GitHub em indicadores para o portfólio.

Entrada:  data/raw/github_bruto.json  (gerado por coletar_github.py)
          src/data/projects.json      (catálogo de projetos do site)
Saída:    public/data/github.json

Cuidados importantes:
- Bytes de código e quantidade de commits NÃO medem domínio de uma linguagem.
  Por isso o site mostra "em quantos repositórios a linguagem aparece" junto
  com a participação em bytes, e deixa essa limitação escrita.
- Projetos em equipe hospedados em outras contas entram na análise de
  linguagens e tecnologias, mas não na contagem de repositórios próprios.

Uso:
    python scripts/processar_github.py
"""

import re
import sys

import pandas as pd

from utils import PASTA_BRUTA, PASTA_PUBLICA, PROJETOS_JSON, agora_iso, ler_json, salvar_json

# O repositório Analise-AWS versiona um ambiente virtual (.venv), então o GitHub
# conta o código de todas as bibliotecas instaladas (mais de 99% dos bytes).
# Nele, considero só a linguagem que eu escrevi e ignoro os bytes.
REPOS_COM_VENDOR = {"Analise-AWS": {"Python"}}

# Repositórios que não são projetos (perfil, o próprio portfólio)
REPOS_NAO_PROJETO = {"Manuellasantos", "ola-sou-a-manu"}

DIAS_SEMANA = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]


def chave_repo(nome: str) -> str:
    """'Nossas-Cores' e 'nossasCores' viram a mesma chave, para não contar duas vezes."""
    return re.sub(r"[^a-z0-9]", "", nome.lower())


def tabela_repositorios(bruto: dict) -> pd.DataFrame:
    df = pd.DataFrame(bruto["repositorios"])
    df = df[~df["fork"] & ~df["nome"].isin(REPOS_NAO_PROJETO)].copy()
    df["chave"] = df["nome"].map(chave_repo)
    # Se o mesmo projeto existe na minha conta e na de outra pessoa, fico com o mais antigo
    df = df.sort_values("criado_em").drop_duplicates("chave", keep="first")
    df["criado_em"] = pd.to_datetime(df["criado_em"])
    df["atualizado_em"] = pd.to_datetime(df["atualizado_em"])
    return df


def tabela_linguagens(repos: pd.DataFrame) -> pd.DataFrame:
    """Uma linha por (repositório, linguagem) com a quantidade de bytes."""
    linhas = []
    for _, repo in repos.iterrows():
        reais = REPOS_COM_VENDOR.get(repo["nome"])
        for linguagem, qtd in repo["linguagens_bytes"].items():
            if reais is None:
                linhas.append({"repo": repo["nome"], "linguagem": linguagem, "bytes": qtd})
            elif linguagem in reais:
                # conta a presença da linguagem, mas não os bytes das bibliotecas
                linhas.append({"repo": repo["nome"], "linguagem": linguagem, "bytes": 0})
    return pd.DataFrame(linhas)


def resumo_linguagens(ling: pd.DataFrame, top: int = 7) -> list[dict]:
    por_ling = ling.groupby("linguagem").agg(bytes=("bytes", "sum"), repos=("repo", "nunique"))
    por_ling["percentual"] = por_ling["bytes"] / por_ling["bytes"].sum() * 100
    por_ling = por_ling.sort_values("bytes", ascending=False)

    principais = por_ling.head(top)
    resto = por_ling.iloc[top:]
    if not resto.empty:
        principais.loc["Outras"] = [resto["bytes"].sum(), resto["repos"].max(), resto["percentual"].sum()]

    return [
        {"linguagem": nome, "percentual": round(float(l.percentual), 1), "repos": int(l.repos)}
        for nome, l in principais.iterrows()
    ]


def linha_do_tempo_repos(repos: pd.DataFrame) -> list[dict]:
    """Repositórios criados por mês, com o acumulado."""
    por_mes = repos.set_index("criado_em").resample("MS").size()
    acumulado = por_mes.cumsum()
    return [
        {"mes": mes.strftime("%Y-%m"), "novos": int(qtd), "acumulado": int(acumulado[mes])}
        for mes, qtd in por_mes.items()
    ]


def analisar_contribuicoes(contrib: dict | None) -> dict | None:
    if not contrib:
        return None
    dias = [d for semana in contrib["contributionCalendar"]["weeks"] for d in semana["contributionDays"]]
    df = pd.DataFrame(dias)
    df["date"] = pd.to_datetime(df["date"])
    df = df.rename(columns={"date": "data", "contributionCount": "qtd"})

    # Níveis do heatmap (0 a 4) pelos quartis dos dias com atividade,
    # do mesmo jeito que o GitHub faz: o nível é relativo à própria pessoa
    ativos = df.loc[df["qtd"] > 0, "qtd"]
    limites = ativos.quantile([0.25, 0.5, 0.75]).tolist() if not ativos.empty else [1, 2, 3]

    def nivel(qtd: int) -> int:
        if qtd == 0:
            return 0
        return 1 + sum(qtd > limite for limite in limites)

    df["nivel"] = df["qtd"].map(nivel)
    df["dia_semana"] = df["data"].dt.day_of_week

    por_dia_semana = df.groupby("dia_semana")["qtd"].agg(["sum", "mean"])
    por_mes = df.set_index("data")["qtd"].resample("MS").sum()

    # Maior sequência de dias seguidos com contribuição
    ativo = (df["qtd"] > 0).astype(int)
    grupos = (ativo != ativo.shift()).cumsum()
    maior_sequencia = int(ativo.groupby(grupos).sum().max())

    return {
        "inicio": df["data"].min().strftime("%Y-%m-%d"),
        "fim": df["data"].max().strftime("%Y-%m-%d"),
        "total": int(df["qtd"].sum()),
        "dias_ativos": int((df["qtd"] > 0).sum()),
        "maior_sequencia": maior_sequencia,
        "dias": [[d.strftime("%Y-%m-%d"), int(q), int(n)] for d, q, n in df[["data", "qtd", "nivel"]].itertuples(index=False)],
        "por_dia_semana": [
            {"dia": DIAS_SEMANA[i], "total": int(por_dia_semana.loc[i, "sum"]), "media": round(float(por_dia_semana.loc[i, "mean"]), 2)}
            for i in range(7)
        ],
        "por_mes": [{"mes": m.strftime("%Y-%m"), "total": int(q)} for m, q in por_mes.items()],
    }


def contagem_catalogo(projetos: list[dict], campo: str) -> list[dict]:
    """Conta categorias ou tecnologias do catálogo de projetos do site."""
    serie = pd.Series([item for p in projetos for item in p[campo]])
    return [{"nome": nome, "projetos": int(qtd)} for nome, qtd in serie.value_counts().items()]


def main() -> int:
    caminho = PASTA_BRUTA / "github_bruto.json"
    if not caminho.exists():
        print("Rode antes: python scripts/coletar_github.py")
        return 1

    bruto = ler_json(caminho)
    projetos = ler_json(PROJETOS_JSON)
    repos = tabela_repositorios(bruto)
    ling = tabela_linguagens(repos)

    saida = {
        "gerado_em": agora_iso(),
        "fonte": "API pública do GitHub (REST e GraphQL)",
        "coletado_em": bruto["coletado_em"],
        "usuario": bruto["usuario"],
        "resumo": {
            "repos_publicos": bruto["perfil"]["repos_publicos"],
            "repos_analisados": int(len(repos)),
            "repos_proprios": int((~repos["externo"]).sum()),
            "repos_equipe_externos": int(repos["externo"].sum()),
            "conta_criada_em": bruto["perfil"]["conta_criada_em"][:10],
            "linguagens_distintas": int(ling["linguagem"].nunique()),
        },
        "linguagens": resumo_linguagens(ling),
        "repos_por_mes": linha_do_tempo_repos(repos),
        "contribuicoes": analisar_contribuicoes(bruto["contribuicoes"]),
        "categorias": contagem_catalogo(projetos, "categorias"),
        "tecnologias": contagem_catalogo(projetos, "tecnologias"),
        "limitacoes": [
            "Bytes de código e número de contribuições não medem domínio técnico.",
            "Só repositórios públicos entram na análise.",
            "Projetos feitos fora do GitHub (como o dashboard no Excel) aparecem pouco nas linguagens.",
            "No repositório Analise-AWS, os bytes foram desconsiderados porque o .venv foi versionado junto com o código.",
            "O calendário de contribuições cobre só o último ano e conta commits, PRs, issues e revisões em repositórios públicos.",
        ],
    }
    salvar_json(saida, PASTA_PUBLICA / "github.json")
    return 0


if __name__ == "__main__":
    sys.exit(main())
