"""Funções compartilhadas pelos scripts de dados do portfólio.

Todos os scripts salvam os resultados em public/data/, que é a pasta
lida pelo frontend. Assim o site continua 100% estático (GitHub Pages).
"""

import json
from datetime import datetime, timezone
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
PASTA_PUBLICA = RAIZ / "public" / "data"
PASTA_BRUTA = RAIZ / "data" / "raw"
PROJETOS_JSON = RAIZ / "src" / "data" / "projects.json"

# Paleta do site, para os gráficos gerados em Python ficarem iguais aos do navegador
PALETA = {
    "grafite": "#131217",
    "violeta": "#24212B",
    "branco": "#F3EFF2",
    "rosa": "#E8A1BC",
    "rosa_intenso": "#CC5C91",
    "lavanda": "#AC96DB",
}


def agora_iso() -> str:
    """Data e hora atual em UTC, no formato ISO 8601."""
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def salvar_json(dados, caminho: Path) -> None:
    """Salva um objeto Python como JSON compacto (UTF-8, sem escapar acentos)."""
    caminho.parent.mkdir(parents=True, exist_ok=True)
    with open(caminho, "w", encoding="utf-8") as arquivo:
        json.dump(dados, arquivo, ensure_ascii=False, separators=(",", ":"))
    print(f"  salvo: {caminho.relative_to(RAIZ)} ({caminho.stat().st_size // 1024} KB)")


def ler_json(caminho: Path):
    with open(caminho, encoding="utf-8") as arquivo:
        return json.load(arquivo)
