"""Gera os pontos da rosa da página inicial e salva em public/data/rosa.json."""

import numpy as np

from utils import PASTA_PUBLICA, salvar_json

CONTORNOS = 5  # quantidade de camadas de pétalas
PONTOS_POR_CONTORNO = 600
VOLTAS = 15 * np.pi


def superficie_rosa(x: np.ndarray, t: np.ndarray) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    phi = (np.pi / 2) * np.exp(-t / (8 * np.pi))
    contorno = 1 - (1 - np.mod(3.6 * t, 2 * np.pi) / np.pi) ** 4 / 2
    curva = 2 * (x**2 - x) ** 2 * np.sin(phi)
    r = contorno * (x * np.sin(phi) + curva * np.cos(phi))
    altura = contorno * (x * np.cos(phi) - curva * np.sin(phi))
    return r * np.cos(t), r * np.sin(t), altura


def main() -> None:
    x, t = np.meshgrid(np.linspace(0.2, 1, CONTORNOS), np.linspace(0, VOLTAS, PONTOS_POR_CONTORNO))
    px, py, pz = superficie_rosa(x.ravel(), t.ravel())

    pontos = np.column_stack([px, py, pz])
    pontos -= pontos.mean(axis=0)
    pontos /= np.abs(pontos).max()

    # cor de cada ponto: mais forte no meio da flor
    raio = np.linalg.norm(pontos[:, :2], axis=1)
    tom = 1 - raio / raio.max()

    salvar_json(
        {
            "descricao": "Superfície paramétrica de rosa amostrada com NumPy",
            "pontos": np.round(np.column_stack([pontos, tom]), 3).tolist(),
        },
        PASTA_PUBLICA / "rosa.json",
    )


if __name__ == "__main__":
    main()
