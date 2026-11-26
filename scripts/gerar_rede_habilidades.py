"""Monta a rede que liga as tecnologias aos projetos e salva em public/data/rede.json."""

import numpy as np

from utils import PASTA_PUBLICA, PROJETOS_JSON, RAIZ, ler_json, salvar_json

SEMENTE = 3
ITERACOES = 400


# grupo das tecnologias que não estão no perfil
GRUPOS_EXTRAS = {
    "Dados": ["Unity Catalog", "AI/BI Dashboard", "scikit-learn", "Chart.js", "PostgreSQL", "Leaflet", "OpenStreetMap", "OSRM"],
    "Desenvolvimento": ["Ionic", "EJS", "Tailwind CSS", "Google Gemini API", "Pytest"],
    "Ferramentas": ["Vercel", "Render", "GitHub Pages", "AWS", "VLibras"],
}


def grupo_da_tecnologia(tecnologia: str, habilidades: dict) -> str:
    for grupo, itens in list(habilidades.items()) + list(GRUPOS_EXTRAS.items()):
        if tecnologia in itens:
            return grupo
    return "Outras"


def fruchterman_reingold(n: int, arestas: np.ndarray, rng: np.random.Generator) -> np.ndarray:
    pos = rng.uniform(-1, 1, size=(n, 2))
    k = np.sqrt(4 / n)  # distância entre os pontos
    temperatura = 0.2
    for _ in range(ITERACOES):
        delta = pos[:, None, :] - pos[None, :, :]
        dist = np.linalg.norm(delta, axis=2) + 1e-6
        repulsao = (k**2 / dist**2)[:, :, None] * delta
        desloc = repulsao.sum(axis=1)

        origem, destino = arestas[:, 0], arestas[:, 1]
        d = pos[origem] - pos[destino]
        dist_a = np.linalg.norm(d, axis=1)[:, None] + 1e-6
        atracao = d * dist_a / k
        np.add.at(desloc, origem, -atracao)
        np.add.at(desloc, destino, atracao)

        # puxa os pontos para o centro
        desloc -= pos * 0.6
        tamanho = np.linalg.norm(desloc, axis=1)[:, None] + 1e-6
        pos += desloc / tamanho * np.minimum(tamanho, temperatura)
        temperatura *= 0.99
    # deixa as posições entre 0.05 e 0.95
    pos -= pos.min(axis=0)
    pos /= pos.max(axis=0) + 1e-9
    return 0.05 + pos * 0.9


def main() -> None:
    projetos = ler_json(PROJETOS_JSON)
    habilidades = ler_json(RAIZ / "src" / "data" / "profile.json")["habilidades"]

    tecnologias = sorted({t for p in projetos for t in p["tecnologias"]})
    nos = [{"id": p["slug"], "rotulo": p["nome"].split(" — ")[0], "tipo": "projeto"} for p in projetos]
    nos += [
        {
            "id": f"tec:{t}",
            "rotulo": t,
            "tipo": "tecnologia",
            "grupo": grupo_da_tecnologia(t, habilidades),
            "projetos": sum(t in p["tecnologias"] for p in projetos),
        }
        for t in tecnologias
    ]
    indice = {no["id"]: i for i, no in enumerate(nos)}
    arestas = [(indice[f"tec:{t}"], indice[p["slug"]]) for p in projetos for t in p["tecnologias"]]

    pos = fruchterman_reingold(len(nos), np.array(arestas), np.random.default_rng(SEMENTE))
    for no, (x, y) in zip(nos, pos):
        no["x"], no["y"] = round(float(x), 4), round(float(y), 4)

    salvar_json({"nos": nos, "arestas": arestas}, PASTA_PUBLICA / "rede.json")


if __name__ == "__main__":
    main()
