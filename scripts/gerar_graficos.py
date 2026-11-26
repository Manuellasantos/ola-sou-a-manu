"""Gera gráficos estáticos (Matplotlib) e um relatório interativo (Plotly)
a partir de public/data/github.json.

- docs/img/github-linguagens.png e docs/img/github-semana.png entram no README.
- docs/relatorio-github.html é um relatório Plotly que abre direto no navegador.

Uso:
    python scripts/gerar_graficos.py
"""

import matplotlib

matplotlib.use("Agg")  # sem janela: funciona no terminal e no GitHub Actions
import matplotlib.pyplot as plt
import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots

from utils import PALETA, PASTA_PUBLICA, RAIZ, ler_json

PASTA_DOCS = RAIZ / "docs"


def estilo_base(ax) -> None:
    ax.set_facecolor(PALETA["grafite"])
    for lado in ("top", "right"):
        ax.spines[lado].set_visible(False)
    for lado in ("left", "bottom"):
        ax.spines[lado].set_color(PALETA["violeta"])
    ax.tick_params(colors=PALETA["branco"])


def grafico_linguagens(dados: dict) -> None:
    df = pd.DataFrame(dados["linguagens"]).iloc[::-1]
    fig, ax = plt.subplots(figsize=(8, 4), facecolor=PALETA["grafite"])
    estilo_base(ax)
    barras = ax.barh(df["linguagem"], df["percentual"], color=PALETA["rosa"], hatch="//", edgecolor=PALETA["rosa_intenso"])
    for barra, (_, linha) in zip(barras, df.iterrows()):
        ax.text(barra.get_width() + 0.8, barra.get_y() + barra.get_height() / 2,
                f"{linha.percentual:.1f}% · {linha.repos} repos", va="center", color=PALETA["branco"], fontsize=9)
    ax.set_xlabel("% dos bytes de código", color=PALETA["branco"])
    ax.set_title("Linguagens nos repositórios públicos", color=PALETA["branco"], loc="left")
    fig.text(0.01, 0.01, f"Fonte: API do GitHub · coletado em {dados['coletado_em'][:10]} · bytes ≠ domínio técnico",
             color=PALETA["lavanda"], fontsize=8)
    fig.tight_layout(rect=(0, 0.04, 1, 1))
    fig.savefig(PASTA_DOCS / "img" / "github-linguagens.png", dpi=150)
    plt.close(fig)


def grafico_semana(dados: dict) -> None:
    contrib = dados["contribuicoes"]
    if not contrib:
        return
    df = pd.DataFrame(contrib["por_dia_semana"])
    fig, ax = plt.subplots(figsize=(8, 3.5), facecolor=PALETA["grafite"])
    estilo_base(ax)
    ax.bar(df["dia"], df["total"], color=PALETA["lavanda"], edgecolor=PALETA["branco"], linewidth=0.5)
    ax.set_title(f"Contribuições por dia da semana ({contrib['inicio']} a {contrib['fim']})", color=PALETA["branco"], loc="left")
    fig.tight_layout()
    fig.savefig(PASTA_DOCS / "img" / "github-semana.png", dpi=150)
    plt.close(fig)


def relatorio_plotly(dados: dict) -> None:
    contrib = dados["contribuicoes"]
    ling = pd.DataFrame(dados["linguagens"])
    repos = pd.DataFrame(dados["repos_por_mes"])

    fig = make_subplots(rows=2, cols=2, subplot_titles=(
        "Linguagens (% dos bytes)", "Repositórios acumulados",
        "Contribuições por mês", "Contribuições por dia da semana"))
    fig.add_bar(x=ling["linguagem"], y=ling["percentual"], marker_color=PALETA["rosa"], row=1, col=1,
                customdata=ling["repos"], hovertemplate="%{x}: %{y}%<br>%{customdata} repositórios<extra></extra>")
    fig.add_scatter(x=repos["mes"], y=repos["acumulado"], mode="lines+markers", line_color=PALETA["lavanda"], row=1, col=2)
    if contrib:
        mes = pd.DataFrame(contrib["por_mes"])
        sem = pd.DataFrame(contrib["por_dia_semana"])
        fig.add_bar(x=mes["mes"], y=mes["total"], marker_color=PALETA["rosa_intenso"], row=2, col=1)
        fig.add_bar(x=sem["dia"], y=sem["total"], marker_color=PALETA["rosa"], row=2, col=2)
    fig.update_layout(template="plotly_dark", paper_bgcolor=PALETA["grafite"], plot_bgcolor=PALETA["violeta"],
                      showlegend=False, height=720,
                      title=f"Atividade pública no GitHub · {dados['usuario']} · fonte: API do GitHub ({dados['coletado_em'][:10]})")
    fig.write_html(PASTA_DOCS / "relatorio-github.html", include_plotlyjs="cdn")
    print("  salvo: docs/relatorio-github.html")


def main() -> None:
    (PASTA_DOCS / "img").mkdir(parents=True, exist_ok=True)
    dados = ler_json(PASTA_PUBLICA / "github.json")
    grafico_linguagens(dados)
    grafico_semana(dados)
    relatorio_plotly(dados)
    print("  salvo: docs/img/github-*.png")


if __name__ == "__main__":
    main()
