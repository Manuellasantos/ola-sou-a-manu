"""Gera os pequenos "adesivos de dados" que decoram as colagens do site.

Nada aqui é inventado: cada adesivo é calculado a partir de dados que o
próprio projeto já tem.
- matriz de correlação: entre as coordenadas (x, y, z) e o tom das partículas da rosa;
- dispersão: uma amostra dos pontos do k-means (dados simulados, e o adesivo avisa);
- mini tabela: as três linguagens que mais aparecem nos meus repositórios;
- barras e linha: contribuições por dia da semana e repositórios acumulados.

Entrada:  public/data/rosa.json, clusters.json e github.json
Saída:    public/data/arte.json

Uso:
    python scripts/gerar_arte.py
"""

import numpy as np
import pandas as pd

from utils import PASTA_PUBLICA, ler_json, salvar_json

SEMENTE = 11


def correlacao_rosa() -> dict:
    pontos = pd.DataFrame(ler_json(PASTA_PUBLICA / "rosa.json")["pontos"], columns=["x", "y", "z", "tom"])
    matriz = pontos.corr().round(2)
    return {"variaveis": list(matriz.columns), "valores": matriz.values.tolist()}


def dispersao_clusters(n: int = 42) -> dict:
    dados = ler_json(PASTA_PUBLICA / "clusters.json")
    rng = np.random.default_rng(SEMENTE)
    final = dados["passos"][-1]["rotulos"]
    indices = rng.choice(len(dados["pontos"]), size=n, replace=False)
    return {
        "simulado": True,
        "pontos": [[*dados["pontos"][i], final[i]] for i in sorted(indices)],
    }


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
            "correlacao": correlacao_rosa(),
            "dispersao": dispersao_clusters(),
            "github": resumo_github(),
            # coordenadas de São Paulo, usadas como "carimbo" na abertura
            "coordenadas": {"lat": -23.5505, "lon": -46.6333},
        },
        PASTA_PUBLICA / "arte.json",
    )


if __name__ == "__main__":
    main()
