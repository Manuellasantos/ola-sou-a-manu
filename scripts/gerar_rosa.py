"""Gera as partículas da rosa do início do site a partir de uma superfície matemática.

A forma vem de uma parametrização conhecida de "rosa 3D". Para cada par (x, t):
    φ(t) = (π/2) · e^(−t / 8π)                        → abertura (pétalas de fora mais abertas)
    u(t) = 1 − (1 − (3,6t mod 2π)/π)⁴ / 2              → contorno de cada pétala
    y    = 2 · (x² − x)² · sen φ                       → curvatura da pétala
    r    = u · (x · sen φ + y · cos φ)
    ponto = (r · cos t, r · sin t, u · (x · cos φ − y · sen φ))

Em vez de preencher a superfície, usamos poucos valores de x e muitos de t:
cada x vira uma "linha de contorno" das pétalas, o que deixa a flor legível
mesmo com poucos pontos. O frontend só gira e projeta; a matemática fica aqui.

Saída: public/data/rosa.json
"""

import numpy as np

from utils import PASTA_PUBLICA, salvar_json

CONTORNOS = 5      # quantos valores de x (anéis de pétalas)
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

    # tom: miolo (perto do eixo) = rosa intenso; pétalas de fora = lavanda
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
