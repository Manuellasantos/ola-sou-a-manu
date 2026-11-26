"""Testes dos scripts de dados. Rodar com: pytest tests/python"""

import sys
from pathlib import Path

import numpy as np
import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))

import gerar_clusters  # noqa: E402
import gerar_rosa  # noqa: E402
import processar_github  # noqa: E402


def test_chave_repo_junta_nomes_parecidos():
    assert processar_github.chave_repo("Nossas-Cores") == processar_github.chave_repo("nossasCores")


def test_linguagens_ignora_bytes_do_venv():
    repos = pd.DataFrame([
        {"nome": "Analise-AWS", "linguagens_bytes": {"Python": 9_000_000, "C": 5_000_000}},
        {"nome": "outro", "linguagens_bytes": {"Python": 100, "CSS": 300}},
    ])
    ling = processar_github.tabela_linguagens(repos)
    assert "C" not in set(ling["linguagem"])
    assert ling.loc[ling["repo"] == "Analise-AWS", "bytes"].sum() == 0
    resumo = processar_github.resumo_linguagens(ling)
    assert {r["linguagem"]: r["repos"] for r in resumo}["Python"] == 2
    assert round(sum(r["percentual"] for r in resumo)) == 100


def test_contribuicoes_niveis_e_sequencia():
    dias = [{"date": f"2026-01-{d:02d}", "contributionCount": c} for d, c in zip(range(1, 8), [0, 1, 2, 3, 0, 5, 8])]
    resultado = processar_github.analisar_contribuicoes({"contributionCalendar": {"weeks": [{"contributionDays": dias}]}})
    assert resultado["total"] == 19
    assert resultado["dias_ativos"] == 5
    assert resultado["maior_sequencia"] == 3
    niveis = [d[2] for d in resultado["dias"]]
    assert niveis[0] == 0 and max(niveis) == 4


def test_kmeans_inercia_nao_aumenta():
    rng = np.random.default_rng(0)
    dados = gerar_clusters.gerar_dados(rng)
    passos = gerar_clusters.kmeans(dados, 3, rng)
    inercias = [p["inercia"] for p in passos]
    assert all(b <= a + 1e-9 for a, b in zip(inercias, inercias[1:]))


def test_rosa_tem_pontos_finitos():
    x, t = np.meshgrid(np.linspace(0.2, 1, 3), np.linspace(0, 10, 50))
    px, py, pz = gerar_rosa.superficie_rosa(x.ravel(), t.ravel())
    assert np.isfinite(np.column_stack([px, py, pz])).all()


def test_arte_correlacao_e_simetrica():
    import gerar_arte

    matriz = np.array(gerar_arte.correlacao_rosa()["valores"])
    assert matriz.shape == (4, 4)
    assert np.allclose(matriz, matriz.T)
    assert np.allclose(np.diag(matriz), 1)
