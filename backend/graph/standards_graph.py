"""
standards_graph.py
Knowledge Graph Engine for BIS Regulatory Standards
Smart India Hackathon (SIH) 2026

Models standards, engineering sub-materials, test methods, QCO orders,
and statutory schemes as a Directed Acyclic Graph (DAG) using NetworkX.
"""

import networkx as nx
from typing import Dict, List, Any, Optional

class StandardsKnowledgeGraph:
    def __init__(self):
        self.graph = nx.DiGraph()
        self._build_graph()

    def _build_graph(self):
        # ─── 1. Core Standards & Properties ──────────────────────────────────
        standards = [
            {
                "id": "IS 694",
                "full_code": "IS 694:2010",
                "title": "PVC Insulated Cables for Working Voltages up to and including 1100V",
                "division": "ETD",
                "scheme": "Scheme-I (Mandatory ISI Mark)",
                "mandatory_qco": True,
                "qco_name": "Electrical Wires and Cables (Quality Control) Order, 2023",
                "ministry": "Ministry of Commerce & Industry (DPIIT)",
                "tolerances": "Conductor resistance max 12.1 ohm/km at 20°C for 1.5 sq mm copper; Spark test 6kV AC.",
                "disqualification_rule": "Bidders without valid CM/L ISI Mark license are disqualified under GFR Rule 144(i)."
            },
            {
                "id": "IS 7098 (Part 2)",
                "full_code": "IS 7098 (Part 2):2011",
                "title": "Cross-linked Polyethylene (XLPE) Insulated Thermoplastic Sheathed Cables (3.3kV to 33kV)",
                "division": "ETD",
                "scheme": "Scheme-I (Mandatory ISI Mark)",
                "mandatory_qco": True,
                "qco_name": "Electrical Cables (Quality Control) Order, 2023",
                "ministry": "Ministry of Power / DPIIT",
                "tolerances": "Operating conductor temperature 90°C; Short circuit temperature 250°C; Partial discharge max 5pC at 1.73 Uo.",
                "disqualification_rule": "Mandatory type test report from CPRI / ERDA along with CM/L ISI certification."
            },
            {
                "id": "IS 1786",
                "full_code": "IS 1786:2008",
                "title": "High Strength Deformed Steel Bars and Wires for Concrete Reinforcement (TMT)",
                "division": "CED",
                "scheme": "Scheme-I (Mandatory ISI Mark)",
                "mandatory_qco": True,
                "qco_name": "Steel and Steel Products (Quality Control) Order, 2024",
                "ministry": "Ministry of Steel",
                "tolerances": "Fe 500D: Min 0.2% Proof Stress 500 MPa, Min Tensile Strength 565 MPa, Min Elongation 16.0%, TS/YS ratio >= 1.10.",
                "disqualification_rule": "Non-primary steel re-rollers without primary billet traceability and BIS CM/L are disqualified."
            },
            {
                "id": "IS 456",
                "full_code": "IS 456:2000",
                "title": "Plain and Reinforced Concrete - Code of Practice",
                "division": "CED",
                "scheme": "Voluntary Code of Practice (Referenced in State PWD / CPWD Manuals)",
                "mandatory_qco": False,
                "qco_name": "CPWD Specifications 2021 mandatory adherence",
                "ministry": "Ministry of Housing and Urban Affairs (MoHUA)",
                "tolerances": "Minimum cementitious content 300 kg/m3 for severe exposure; Max water-cement ratio 0.45.",
                "disqualification_rule": "Deviations from structural cover and characteristic 28-day compressive cube strength disqualify the mix design."
            },
            {
                "id": "IS 4984",
                "full_code": "IS 4984:1995",
                "title": "High Density Polyethylene (HDPE) Pipes for Water Supply",
                "division": "CED",
                "scheme": "Scheme-I (Mandatory ISI Mark)",
                "mandatory_qco": True,
                "qco_name": "Pipes and Fittings (Quality Control) Order, 2023",
                "ministry": "DPIIT / Ministry of Chemicals & Petrochemicals",
                "tolerances": "Raw material PE-80 / PE-100; Melt Flow Rate (MFR) 0.2 to 1.1 g/10 min; Carbon black 2.5 +/- 0.5%.",
                "disqualification_rule": "Recycled HDPE plastic scrap strictly prohibited. Bidders must provide virgin polymer test certificate."
            },
            {
                "id": "IS 2062",
                "full_code": "IS 2062:2011",
                "title": "Hot Rolled Medium and High Tensile Structural Steel",
                "division": "MTD",
                "scheme": "Scheme-I (Mandatory ISI Mark)",
                "mandatory_qco": True,
                "qco_name": "Steel and Steel Products (Quality Control) Order, 2024",
                "ministry": "Ministry of Steel",
                "tolerances": "Grade E250: Yield 250 MPa, Tensile 410 MPa; Max Carbon 0.23%; Charpy Impact test at -20°C for Sub-quality C.",
                "disqualification_rule": "Fabricators using unbranded or secondary non-ISI plates face summary bid cancellation."
            },
            {
                "id": "IS 10500",
                "full_code": "IS 10500:2012",
                "title": "Drinking Water - Specification",
                "division": "CHD/FAD",
                "scheme": "Mandatory for Municipal Water Utilities & Public Infrastructure",
                "mandatory_qco": True,
                "qco_name": "Uniform Drinking Water Quality Standards (Jal Jeevan Mission Mandate)",
                "ministry": "Ministry of Jal Shakti",
                "tolerances": "TDS Acceptable: 500 mg/L (Max 2000 mg/L); Turbidity Max 1 NTU; E. Coli: Zero in 100ml sample.",
                "disqualification_rule": "Test reports failing heavy metals (Lead > 0.01 mg/L, Arsenic > 0.01 mg/L) automatically disqualify supplier."
            },
            {
                "id": "IS 14543",
                "full_code": "IS 14543:2004",
                "title": "Packaged Drinking Water (Other Than Natural Mineral Water)",
                "division": "FAD",
                "scheme": "Scheme-I (Mandatory ISI Mark)",
                "mandatory_qco": True,
                "qco_name": "Food Safety and Standards (Packaging) Regulations & Section 16 BIS Order",
                "ministry": "FSSAI / Ministry of Health & Family Welfare",
                "tolerances": "TDS 75 to 500 mg/L; Coliforms and Faecal streptococci absent in 250ml; Yeast & mould absent.",
                "disqualification_rule": "Supplying packaged water without active BIS license and FSSAI clearance is a criminal offense under BIS Act Sec 29."
            },
            {
                "id": "IS 10322 (Part 5)",
                "full_code": "IS 10322 (Part 5/Sec 3):2012",
                "title": "Luminaires for Road and Street Lighting",
                "division": "LITD",
                "scheme": "Scheme-II (Mandatory CRS Registration)",
                "mandatory_qco": True,
                "qco_name": "Electronics & Information Technology Goods (Requirement for Compulsory Registration) Order",
                "ministry": "MeitY",
                "tolerances": "Ingress protection minimum IP66; Impact resistance IK08; Built-in surge protection 10kV; Efficacy >= 120 lm/W.",
                "disqualification_rule": "Bidders must possess BIS CRS Registration Number (R-XXXXXXXX) for the specific luminaire model."
            },
            {
                "id": "IS 13252 (Part 1)",
                "full_code": "IS 13252 (Part 1):2010",
                "title": "Information Technology Equipment - Safety - General Requirements",
                "division": "LITD",
                "scheme": "Scheme-II (Mandatory CRS Registration)",
                "mandatory_qco": True,
                "qco_name": "MeitY Compulsory Registration Scheme (CRO) Phase-I",
                "ministry": "MeitY",
                "tolerances": "Dielectric withstand voltage 1.5kV AC; Earth continuity test < 0.1 ohm; Temperature rise test on internal transformers.",
                "disqualification_rule": "Servers/Laptops imported or sold without embossed BIS CRS registration mark are seized by Customs."
            },
            {
                "id": "IS 302 (Part 1)",
                "full_code": "IS 302 (Part 1):2008",
                "title": "Safety of Household and Similar Electrical Appliances - General Requirements",
                "division": "ETD",
                "scheme": "Scheme-I (Mandatory ISI Mark)",
                "mandatory_qco": True,
                "qco_name": "Electrical Appliances (Quality Control) Order",
                "ministry": "DPIIT",
                "tolerances": "Leakage current max 0.75 mA; Electric strength withstand test at 1000V-2500V; Protection against moisture ingress.",
                "disqualification_rule": "Supply of domestic heaters, irons, geysers without ISI mark violates central consumer safety law."
            }
        ]

        for s in standards:
            self.graph.add_node(s["id"], type="Standard", **s)

        # ─── 2. Division Nodes ───────────────────────────────────────────────
        divisions = ["ETD", "CED", "MTD", "FAD", "CHD/FAD", "LITD"]
        for div in divisions:
            self.graph.add_node(div, type="Division", name=div)

        for s in standards:
            self.graph.add_edge(s["id"], s["division"], relation="BELONGS_TO_DIVISION")

        # ─── 3. Normative Dependencies & Material Composition Edges ──────────
        normative_edges = [
            ("IS 694", "IS 8130 Conductor", "REQUIRES_MATERIAL", "High conductivity annealed copper / EC grade aluminum as per IS 8130"),
            ("IS 694", "IS 5831 Insulation", "REQUIRES_MATERIAL", "Type A / C PVC insulation compound as per IS 5831"),
            ("IS 694", "IS 10810 Test Protocol", "TESTED_BY", "Methods of test for cables - spark, tensile, insulation resistance"),
            
            ("IS 7098 (Part 2)", "IS 8130 Conductor", "REQUIRES_MATERIAL", "Stranded compact circular aluminum/copper conductor"),
            ("IS 7098 (Part 2)", "IS 3975 Galvanized Armour", "REQUIRES_MATERIAL", "Galvanized steel flat strip / round wire armour"),
            ("IS 7098 (Part 2)", "IS 10810 Test Protocol", "TESTED_BY", "Partial discharge, impulse voltage, and thermal aging tests"),

            ("IS 1786", "IS 2830 Steel Billets", "REQUIRES_MATERIAL", "Continuously cast carbon steel billets with verified chemistry"),
            ("IS 1786", "IS 1608 Tensile Test", "TESTED_BY", "Metallic materials tensile testing at ambient temperature"),
            ("IS 1786", "IS 1599 Bend Test", "TESTED_BY", "Mandatory 180 degree bend and rebend test without transverse cracks"),

            ("IS 456", "IS 1786", "REQUIRES_MATERIAL", "High strength deformed TMT steel reinforcement"),
            ("IS 456", "IS 269 Cement", "REQUIRES_MATERIAL", "Ordinary Portland cement 43/53 grade"),
            ("IS 456", "IS 383 Aggregates", "REQUIRES_MATERIAL", "Coarse and fine aggregates from natural sources"),

            ("IS 4984", "IS 7328 PE Polymer", "REQUIRES_MATERIAL", "Virgin polyethylene grade PE-63, PE-80, or PE-100"),
            ("IS 4984", "IS 12235 Hydrostatic Test", "TESTED_BY", "Internal hydrostatic pressure resistance test at 80°C for 165 hours"),

            ("IS 2062", "IS 1608 Tensile Test", "TESTED_BY", "Yield strength, ultimate tensile strength, and percentage elongation"),
            ("IS 2062", "IS 1757 Charpy Test", "TESTED_BY", "Charpy V-notch impact toughness test down to -40°C"),

            ("IS 10500", "IS 3025 Water Testing", "TESTED_BY", "Standard methods for physical, chemical, and organoleptic test procedures"),
            ("IS 14543", "IS 10500", "DERIVED_FROM", "Source water must comply with baseline potable limits"),
            ("IS 14543", "IS 15410 Packaging", "REQUIRES_MATERIAL", "Food grade PET / Polycarbonate containers without phthalate leaching"),

            ("IS 10322 (Part 5)", "IS 16103 LED Modules", "REQUIRES_MATERIAL", "LED light sources safety and photobiological compliance"),
            ("IS 10322 (Part 5)", "IS 15885 Driver Safety", "REQUIRES_MATERIAL", "Electronic LED driver safety and isolation"),

            ("IS 13252 (Part 1)", "IS 16046 Batteries", "REQUIRES_MATERIAL", "Rechargeable lithium-ion battery safety requirements"),
            ("IS 13252 (Part 1)", "IS 61000 EMC Limits", "TESTED_BY", "Electromagnetic compatibility immunity and radiated emission tests")
        ]

        for u, v, rel, note in normative_edges:
            if not self.graph.has_node(v):
                self.graph.add_node(v, type="NormativeRef", title=v)
            self.graph.add_edge(u, v, relation=rel, note=note)

    def get_standard_facts(self, code_or_keyword: str) -> Optional[Dict[str, Any]]:
        """Finds matching standard in graph with strict code and title matching (no hallucinations)."""
        import re
        cleaned = code_or_keyword.upper().strip()
        
        # 1. Exact or normalized IS code match (e.g. "IS 1786", "IS 694", "IS 10322")
        # Extract explicit IS code patterns like "IS 1786", "IS 10322", "IS 694", "IS 14543"
        is_code_matches = re.findall(r'\bIS\s*(\d+)(?:\s*(?:PART|\(PART\))\s*(\d+))?', cleaned)
        for num, part in is_code_matches:
            target_id = f"IS {num}"
            if part:
                target_id = f"IS {num} (Part {part})"
            for node, data in self.graph.nodes(data=True):
                if data.get("type") == "Standard":
                    node_up = node.upper()
                    if node_up == target_id or node_up.startswith(target_id) or data.get("full_code", "").upper().startswith(target_id):
                        return self._extract_node_context(node)

        # 2. Strict standard node string search
        for node, data in self.graph.nodes(data=True):
            if data.get("type") == "Standard":
                node_up = node.upper()
                # Check for explicit code match (e.g. "IS 1786" in text)
                if re.search(r'\b' + re.escape(node_up) + r'\b', cleaned):
                    return self._extract_node_context(node)

        # 3. High-threshold specific topic phrases (only if explicit code is absent)
        specific_phrases = {
            "TMT": "IS 1786",
            "REBAR": "IS 1786",
            "FE 500": "IS 1786",
            "HDPE PIPE": "IS 4984",
            "POLYETHYLENE PIPE": "IS 4984",
            "PACKAGED DRINKING WATER": "IS 14543",
            "PACKAGED WATER": "IS 14543",
            "STREET LIGHTING": "IS 10322 (Part 5)",
            "ROADWAY LUMINAIRE": "IS 10322 (Part 5)",
            "LED ROADWAY": "IS 10322 (Part 5)",
            "LUMINAIRES FOR ROAD": "IS 10322 (Part 5)",
            "1.1 KV CABLE": "IS 694",
            "PVC INSULATED CABLE": "IS 694",
            "11KV CABLE": "IS 7098 (Part 2)",
            "33KV CABLE": "IS 7098 (Part 2)",
            "XLPE": "IS 7098 (Part 2)",
            "STRUCTURAL STEEL": "IS 2062",
            "CONCRETE CODE": "IS 456"
        }
        for phrase, target_node in specific_phrases.items():
            if phrase in cleaned:
                if self.graph.has_node(target_node):
                    return self._extract_node_context(target_node)

        return None

    def _extract_node_context(self, node: str) -> Dict[str, Any]:
        node_data = self.graph.nodes[node]
        successors = list(self.graph.successors(node))
        
        normative_refs = []
        for succ in successors:
            edge_data = self.graph.get_edge_data(node, succ)
            normative_refs.append({
                "target": succ,
                "relation": edge_data.get("relation"),
                "note": edge_data.get("note", "")
            })

        return {
            "standard_id": node,
            "full_code": node_data.get("full_code"),
            "title": node_data.get("title"),
            "division": node_data.get("division"),
            "scheme": node_data.get("scheme"),
            "mandatory_qco": node_data.get("mandatory_qco"),
            "qco_name": node_data.get("qco_name"),
            "ministry": node_data.get("ministry"),
            "tolerances": node_data.get("tolerances"),
            "disqualification_rule": node_data.get("disqualification_rule"),
            "normative_dependencies": normative_refs
        }

    def export_graph_for_ui(self) -> Dict[str, Any]:
        """Exports graph in D3/Cytoscape compatible node-link format for the frontend."""
        nodes = []
        for n, d in self.graph.nodes(data=True):
            nodes.append({
                "id": n,
                "label": d.get("full_code", n),
                "type": d.get("type", "Generic"),
                "division": d.get("division", "General"),
                "mandatory_qco": d.get("mandatory_qco", False)
            })

        links = []
        for u, v, d in self.graph.edges(data=True):
            links.append({
                "source": u,
                "target": v,
                "relation": d.get("relation", "CONNECTS"),
                "note": d.get("note", "")
            })

        return {"nodes": nodes, "links": links}

# Singleton instance
standards_kg = StandardsKnowledgeGraph()

if __name__ == "__main__":
    facts = standards_kg.get_standard_facts("IS 1786")
    print("Test lookup IS 1786:", facts)
    d3_data = standards_kg.export_graph_for_ui()
    print(f"Graph nodes: {len(d3_data['nodes'])}, links: {len(d3_data['links'])}")
