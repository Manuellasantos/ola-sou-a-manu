"""Gera os dados dos adesivos de gráficos e salva em public/data/arte.json."""

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
