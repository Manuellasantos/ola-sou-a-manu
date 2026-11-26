"""Roda todos os scripts de dados na ordem certa.

    python scripts/gerar_tudo.py            # tudo, inclusive a coleta no GitHub
    python scripts/gerar_tudo.py --offline  # pula a coleta e usa data/raw/ existente
"""

import sys

import coletar_github
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
    etapas += [("Processamento do GitHub", processar_github.main), ("Gráficos e relatório", gerar_graficos.main)]

    for nome, funcao in etapas:
        print(f"→ {nome}")
        if funcao():  # as funções retornam 0/None em caso de sucesso
            print(f"Falhou em: {nome}")
            return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
