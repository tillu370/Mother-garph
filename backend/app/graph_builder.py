import pandas as pd
import networkx as nx
from geopy.distance import geodesic

NGO_FILE = "data/ngos_scored.csv"
FAC_FILE = "data/facilities_scored.csv"
FUND_FILE = "data/funders.csv"

DISTRICT_FILE = "data/districts_59.csv"
MAX_KM = 60  # edge distance cutoff

def load_scored_data():
    ngos = pd.read_csv(NGO_FILE)
    facs = pd.read_csv(FAC_FILE)
    funds = pd.read_csv(FUND_FILE)
    dists = pd.read_csv(DISTRICT_FILE)
    return ngos, facs, funds, dists

def build_graph():
    ngos, facs, funds, _ = load_scored_data()
    G = nx.Graph()

    # NGO nodes
    for _, r in ngos.iterrows():
        G.add_node(
            f"ngo_{r['name']}",
            kind="NGO",
            name=r["name"],
            district=r["district"],
            lat=float(r["lat"]),
            lon=float(r["lon"]),
            score=float(r["capability_score"]),
            focus=str(r["focus_areas"]),
        )

    # Facility nodes
    for _, r in facs.iterrows():
        G.add_node(
            f"fac_{r['name']}",
            kind="FACILITY",
            name=r["name"],
            district=r["district"],
            lat=float(r["lat"]),
            lon=float(r["lon"]),
            score=float(r["capability_score"]),
            type=str(r["type"]),
        )

    # Funder nodes
    for _, r in funds.iterrows():
        G.add_node(
            f"fund_{r['name']}",
            kind="FUNDER",
            name=r["name"],
            focus=str(r["focus_areas"]),
            regions=str(r["regions"]),
        )

    # NGO–Facility edges (same district + within MAX_KM)
    ngo_nodes = [n for n, d in G.nodes(data=True) if d["kind"] == "NGO"]
    fac_nodes = [n for n, d in G.nodes(data=True) if d["kind"] == "FACILITY"]

    for n in ngo_nodes:
        nd = G.nodes[n]
        for f in fac_nodes:
            fd = G.nodes[f]
            if nd["district"] != fd["district"]:
                continue
            dist_km = geodesic((nd["lat"], nd["lon"]), (fd["lat"], fd["lon"])).km
            if dist_km <= MAX_KM:
                G.add_edge(n, f, kind="CARE_CHAIN", distance_km=round(dist_km, 1))

    # Funder edges (focus overlap, India/Global)
    for fund in [n for n, d in G.nodes(data=True) if d["kind"] == "FUNDER"]:
        fd = G.nodes[fund]
        for other in ngo_nodes + fac_nodes:
            od = G.nodes[other]
            if any(
                kw.lower() in od.get("focus", od.get("type", "")).lower()
                for kw in fd["focus"].split(",")
            ):
                G.add_edge(fund, other, kind="FUNDING")

    return G

def subgraph_for_district(G, district: str, max_ngos=5, max_facs=3):
    """
    Filters the graph to only the top-scoring entities for the district
    so the frontend ReactFlow looks clean and not like a barcode.
    """
    # 1. Get all nodes in district
    district_ngos = [n for n, d in G.nodes(data=True) if d.get("district") == district and d.get("kind") == "NGO"]
    district_facs = [n for n, d in G.nodes(data=True) if d.get("district") == district and d.get("kind") == "FACILITY"]
    all_funders = [n for n, d in G.nodes(data=True) if d.get("kind") == "FUNDER"]

    # 2. Sort by score and take top N
    top_ngos = sorted(district_ngos, key=lambda n: G.nodes[n].get("score", 0), reverse=True)[:max_ngos]
    top_facs = sorted(district_facs, key=lambda n: G.nodes[n].get("score", 0), reverse=True)[:max_facs]
    
    # We only want funders that actually have an edge to our top NGOs/Facilities
    valid_funders = []
    for f in all_funders:
        has_edge = any(G.has_edge(f, target) for target in top_ngos + top_facs)
        if has_edge:
            valid_funders.append(f)

    # 3. Build sub-graph
    keep_nodes = top_ngos + top_facs + valid_funders
    return G.subgraph(keep_nodes).copy()


def graph_to_reactflow(G_sub):
    nodes = []
    edges = []
    x_step = 220
    y_step = 120

    kind_bands = {"FUNDER": 0, "NGO": 1, "FACILITY": 2}

    for i, (nid, d) in enumerate(G_sub.nodes(data=True)):
        band = kind_bands.get(d["kind"], 1)
        nodes.append(
            {
                "id": nid,
                "position": {"x": band * x_step, "y": i * y_step},
                "data": {
                    "label": d["name"],
                    "role": d["kind"],
                    "score": d.get("score", None),
                },
                "type": "default",
            }
        )

    for eid, (u, v, ed) in enumerate(G_sub.edges(data=True)):
        edges.append(
            {
                "id": f"e{eid}",
                "source": u,
                "target": v,
                "label": ed.get("kind", ""),
                "animated": ed.get("kind") == "CARE_CHAIN",
            }
        )

    return {"nodes": nodes, "edges": edges}
