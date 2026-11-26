"""Roda todos os scripts de dados.

    python scripts/gerar_tudo.py
    python scripts/gerar_tudo.py --offline  (sem coletar do GitHub)
"""

import sys

import coletar_github
import gerar_arte
import gerar_clusters
import gerar_graficos
import gerar_og
import gerar_rede_habilidades
import gerar_rosa
import processar_github


def main() -> int:
    etapas = [
        ("Rosa generativa", gerar_rosa.main),
        ("Imagem de compartilhamento", gerar_og.main),
        ("Clustering (dados simulados)", gerar_clusters.main),
        ("Rede de habilidades", gerar_rede_habilidades.main),
    ]
    if "--offline" not in sys.argv:
        etapas.append(("Coleta do GitHub", coletar_github.main))
    etapas += [("Processamento do GitHub", processar_github.main), ("Gráficos e relatório", gerar_graficos.main), ("Adesivos de dados", gerar_arte.main)]

    for nome, funcao in etapas:
        print(f"→ {nome}")
        if funcao():  # retorna 1 quando dá erro
            print(f"Falhou em: {nome}")
            return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
