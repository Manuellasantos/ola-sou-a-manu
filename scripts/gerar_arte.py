"""Gera os pequenos "adesivos de dados" que decoram as colagens do site.

Nada aqui é inventado: cada adesivo é calculado a partir de dados que o
próprio projeto já tem.
- mini tabela: as três linguagens que mais aparecem nos meus repositórios;
- barras e linha: contribuições por dia da semana e repositórios acumulados.

Entrada:  public/data/github.json
Saída:    public/data/arte.json

Uso:
    python scripts/gerar_arte.py
"""

from utils import PASTA_PUBLICA, ler_json, salvar_json


def resumo_github() -> dict:
    gh = ler_json(PASTA_PUBLICA / "github.json")
    contrib = gh.get("contribuicoes") or {}
    return {
        "linguagens": [[l["linguagem"], l["repos"]] for l in sorted(gh["linguagens"], key=lambda l: -l["repos"])[:3]],
        "semana": [[d["dia"], d["total"]] for d in contrib.get("por_dia_semana", [])],
        "acumulado": [m["acumulado"] for m in gh["repos_por_mes"]],
    }


def main() -> None:
    salvar_json(
        {
            "github": resumo_github(),
        },
        PASTA_PUBLICA / "arte.json",
    )


if __name__ == "__main__":
    main()
