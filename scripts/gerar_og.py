"""Gera a imagem de compartilhamento do site (public/og.png)."""

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

from utils import PALETA, PASTA_PUBLICA, RAIZ, ler_json


def main() -> None:
    pontos = np.array(ler_json(PASTA_PUBLICA / "rosa.json")["pontos"])
    x, y, z, tom = pontos.T
    inclinacao = 0.5
    altura = z * np.cos(inclinacao) - y * np.sin(inclinacao)

    fig = plt.figure(figsize=(12, 6.3), dpi=100, facecolor=PALETA["grafite"])
    ax = fig.add_axes([0.62, 0.04, 0.36, 0.92])
    ax.set_facecolor(PALETA["grafite"])
    cores = np.where(tom[:, None] > 0.55, matplotlib.colors.to_rgb(PALETA["rosa_intenso"]),
                     np.where(tom[:, None] > 0.25, matplotlib.colors.to_rgb(PALETA["rosa"]), matplotlib.colors.to_rgb(PALETA["lavanda"])))
    ax.scatter(x, altura, s=3, c=cores, alpha=0.85, linewidths=0)
    ax.set_aspect("equal")
    ax.axis("off")

    fig.text(0.06, 0.62, "Olá, sou a Manu", fontsize=52, color=PALETA["branco"], family="serif")
    fig.text(0.06, 0.52, "Manuella Santos Cruz", fontsize=22, color=PALETA["rosa"], family="monospace")
    fig.text(0.06, 0.40, "Ciência de Dados · Engenharia de Dados · IA", fontsize=18, color=PALETA["branco"])
    fig.text(0.06, 0.12, "portfólio · python · react · dados", fontsize=14, color=PALETA["lavanda"], family="monospace")
    fig.savefig(RAIZ / "public" / "og.png", facecolor=PALETA["grafite"])
    plt.close(fig)
    print("  salvo: public/og.png")


if __name__ == "__main__":
    main()
