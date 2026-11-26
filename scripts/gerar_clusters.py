"""K-means do zero com NumPy, salvando cada iteração para animar no site.

ATENÇÃO: os pontos são DADOS SIMULADOS (três nuvens gaussianas). O objetivo é
mostrar como o algoritmo funciona, não analisar um conjunto de dados real.

Passos do k-means:
    1. escolhe k centróides iniciais (aqui: pontos aleatórios, de propósito,
       para a animação mostrar mais passos; o k-means++ convergiria rápido demais)
    2. associa cada ponto ao centróide mais próximo
    3. move cada centróide para a média dos seus pontos
    4. repete 2 e 3 até os centróides pararem de se mexer

Antes do k-means, os mesmos pontos aparecem desenhando uma borboleta
(curva de Temple Fay): r = e^sen(θ) − 2·cos(4θ) + sen⁵((2θ − π)/24).
No site, as asas se desfazem e viram os dados.

Saída: public/data/clusters.json
"""

import numpy as np

from utils import PASTA_PUBLICA, salvar_json

SEMENTE = 4
K = 3
MAX_ITERACOES = 12


def gerar_dados(rng: np.random.Generator) -> np.ndarray:
    centros = np.array([[0.25, 0.3], [0.72, 0.35], [0.5, 0.75]])
    nuvens = [rng.normal(c, 0.08, size=(70, 2)) for c in centros]
    return np.clip(np.vstack(nuvens), 0.02, 0.98)


def iniciar_aleatorio(dados: np.ndarray, k: int, rng: np.random.Generator) -> np.ndarray:
    """Sorteia k pontos distintos como centróides iniciais."""
    return dados[rng.choice(len(dados), size=k, replace=False)].copy()


def kmeans(dados: np.ndarray, k: int, rng: np.random.Generator) -> list[dict]:
    centroides = iniciar_aleatorio(dados, k, rng)
    passos = []
    for i in range(MAX_ITERACOES):
        distancias = np.linalg.norm(dados[:, None, :] - centroides[None, :, :], axis=2)
        rotulos = distancias.argmin(axis=1)
        inercia = float(np.sum(distancias[np.arange(len(dados)), rotulos] ** 2))
        passos.append({
            "iteracao": i,
            "centroides": np.round(centroides, 4).tolist(),
            "rotulos": rotulos.tolist(),
            "inercia": round(inercia, 4),
        })
        novos = np.array([dados[rotulos == j].mean(axis=0) for j in range(k)])
        if np.allclose(novos, centroides, atol=1e-4):
            break
        centroides = novos
    return passos


def pontos_borboleta(n: int) -> np.ndarray:
    """n pontos sobre a curva da borboleta, normalizados para [0.1, 0.9]."""
    theta = np.linspace(0, 12 * np.pi, n)
    r = np.exp(np.sin(theta)) - 2 * np.cos(4 * theta) + np.sin((2 * theta - np.pi) / 24) ** 5
    x, y = r * np.sin(theta), -r * np.cos(theta)
    xy = np.column_stack([x, y])
    xy -= xy.min(axis=0)
    xy /= xy.max()
    return 0.1 + xy * 0.8


def main() -> None:
    rng = np.random.default_rng(SEMENTE)
    dados = gerar_dados(rng)
    passos = kmeans(dados, K, rng)
    salvar_json(
        {
            "simulado": True,
            "descricao": "Três nuvens gaussianas simuladas; k-means implementado em NumPy",
            "k": K,
            "pontos": np.round(dados, 4).tolist(),
            "borboleta": np.round(pontos_borboleta(len(dados)), 4).tolist(),
            "passos": passos,
        },
        PASTA_PUBLICA / "clusters.json",
    )
    print(f"  k-means convergiu em {len(passos)} iterações")


if __name__ == "__main__":
    main()
