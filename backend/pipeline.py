"""
pipeline.py
Graph-Augmented Hybrid RAG Pipeline Orchestrator
Smart India Hackathon (SIH) 2026

Fuses:
  1. Indic Normalization & Language Script Detection
  2. Knowledge Graph Traversal (Deterministic Boolean QCO & Normative DAG)
  3. Hybrid Sparse (BM25) + Dense (Vector) Retrieval from 11 BIS Standard PDFs
  4. Groq / OpenAI Compatible Generation with Strict Regulatory Guardrails
"""

import os
import json
import urllib.request
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

import os
import sys
import json
import urllib.request
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv

# Ensure UTF-8 output on Windows consoles
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Load environment from sih2026/.env if present
SIH_ENV = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "sih2026", ".env")
if os.path.exists(SIH_ENV):
    load_dotenv(SIH_ENV)

from backend.graph.standards_graph import standards_kg
from backend.retrieval.hybrid_search import HybridRetriever
from backend.nlp.indic_normalizer import normalize_query

class GraphAugmentedRAGPipeline:
    def __init__(self):
        print("[*] Initializing Graph-Augmented RAG Pipeline...")
        self.kg = standards_kg
        self.retriever = HybridRetriever()

        # LLM Configurations
        self.api_key = os.getenv("VITE_OPENAI_API_KEY", "")
        self.base_url = os.getenv("VITE_OPENAI_BASE_URL", "https://api.groq.com/openai/v1")
        self.model = os.getenv("VITE_OPENAI_MODEL", "openai/gpt-oss-120b")

    def run(self, user_query: str, top_k: int = 4) -> Dict[str, Any]:
        """
        Executes the end-to-end Graph-RAG process.
        """
        # Step 1: Multilingual Script Detection & Normalization
        canonical_query, detected_lang = normalize_query(user_query)

        # Step 2: Knowledge Graph Fact Extraction (Deterministic Truth)
        graph_facts = self.kg.get_standard_facts(canonical_query)

        # Step 3: Hybrid Dense + Sparse Retrieval from Ingested BIS PDFs
        retrieved_chunks = self.retriever.search(canonical_query, top_k=top_k)

        # Step 4: Construct Grounded Context Packet
        context_packet = {
            "query": user_query,
            "canonical_query": canonical_query,
            "detected_language": detected_lang,
            "graph_facts": graph_facts,
            "retrieved_sources": [
                {
                    "standard_code": c["standard_code"],
                    "clause": c["clause_header"],
                    "page": c["page"],
                    "snippet": c["text"][:280] + "...",
                    "full_text": c["text"],
                    "rrf_score": c.get("rrf_score", 0.0)
                }
                for c in retrieved_chunks
            ]
        }

        # Step 5: Generate Synthesized Legal & Engineering Response
        response_text = self._synthesize_response(context_packet)
        context_packet["answer"] = response_text

        return context_packet

    def _synthesize_response(self, packet: Dict[str, Any]) -> str:
        """Calls the configured LLM with strict grounding, or produces deterministic synthesis."""
        gf = packet["graph_facts"]
        sources = packet["retrieved_sources"]
        lang = packet["detected_language"]
        q = packet["query"]

        # Build Graph Context Block
        graph_block = "NO DIRECT GRAPH MATCH"
        if gf:
            graph_block = (
                f"STANDARD IDENTIFIED: {gf['full_code']} ({gf['title']})\n"
                f"STATUTORY SCHEME: {gf['scheme']}\n"
                f"MANDATORY QCO ORDER: {gf['qco_name']} (Enforced by {gf['ministry']})\n"
                f"ENGINEERING TOLERANCES / THRESHOLDS: {gf['tolerances']}\n"
                f"DISQUALIFICATION RULE: {gf['disqualification_rule']}\n"
                f"NORMATIVE DEPENDENCIES: {', '.join([f'{r['target']} ({r['relation']})' for r in gf['normative_dependencies']])}"
            )

        # Build PDF Source Snippets Block
        source_blocks = []
        for i, s in enumerate(sources, 1):
            source_blocks.append(f"[{i}] {s['standard_code']} - {s['clause']} (Page {s['page']}):\n\"{s['full_text']}\"")
        sources_text = "\n\n".join(source_blocks)

        prompt = f"""You are the Bureau of Indian Standards (BIS) Senior Regulatory Architect & E-Procurement Specialist for Smart India Hackathon 2026.
Answer the user's question using the VERIFIED KNOWLEDGE GRAPH FACTS and RETIEVED OFFICIAL BIS STANDARD CLAUSES below.

CRITICAL INSTRUCTIONS:
1. Respond primarily in {lang}. If user wrote in an Indian language (e.g. Hindi, Tamil, Telugu), answer in that language while keeping standard numbers (e.g. IS 1786, IS 694), units, and legal codes in English Latin script.
2. CITE exact standard numbers, clause headings, and engineering tolerances from the retrieved text.
3. Explicitly state whether the item falls under a MANDATORY QUALITY CONTROL ORDER (QCO) and specify the Statutory Scheme (Scheme-I ISI Mark vs Scheme-II CRS).
4. Clearly state the exact Disqualification Condition under GFR 2017 / BIS Act Section 16.
5. Use clean GitHub Markdown with bold headers and bullet points. Never hallucinate standard numbers.

VERIFIED KNOWLEDGE GRAPH FACTS:
{graph_block}

RETRIEVED OFFICIAL BIS STANDARD CLAUSES:
{sources_text}

USER QUESTION:
{q}
"""

        # Check if LLM API is available
        if self.api_key and self.api_key.startswith("gsk_"):
            try:
                req_data = json.dumps({
                    "model": self.model,
                    "messages": [
                        {"role": "system", "content": "You are an authoritative Indian Public Procurement and BIS Regulatory Standards specialist."},
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": 0.2,
                    "max_tokens": 1200
                }).encode("utf-8")

                req = urllib.request.Request(
                    f"{self.base_url}/chat/completions",
                    data=req_data,
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {self.api_key}",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                    }
                )

                with urllib.request.urlopen(req, timeout=15) as resp:
                    res_json = json.loads(resp.read().decode("utf-8"))
                    return res_json["choices"][0]["message"]["content"]
            except Exception as e:
                print(f"[!] LLM synthesis error: {e}. Falling back to deterministic structured output.")

        # High-Fidelity Deterministic Fallback Synthesis
        ans = []
        if gf:
            ans.append(f"### Standard Conformance: **{gf['full_code']}**")
            ans.append(f"**Title:** {gf['title']}")
            ans.append(f"\n#### 1. Statutory Certification & QCO Status")
            ans.append(f"- **Certification Scheme:** {gf['scheme']}")
            ans.append(f"- **Active QCO:** {gf['qco_name']}")
            ans.append(f"- **Governing Ministry:** {gf['ministry']}")
            ans.append(f"- **Statutory Mandate:** {'MANDATORY COMPLIANCE under Section 16 of BIS Act, 2016' if gf['mandatory_qco'] else 'Voluntary Reference Code'}")

            ans.append(f"\n#### 2. Engineering Tolerances & Acceptance Thresholds")
            ans.append(f"- {gf['tolerances']}")

            if gf["normative_dependencies"]:
                ans.append(f"\n#### 3. Requisite Normative Sub-Standards")
                for dep in gf["normative_dependencies"]:
                    ans.append(f"- **{dep['target']}** ({dep['relation']}): {dep['note']}")

            ans.append(f"\n#### 4. Tender Disqualification Condition")
            ans.append(f"> ⚠️ **Disqualification Directive:** {gf['disqualification_rule']}")

        if sources:
            ans.append(f"\n#### 5. Official Standard References Retrieved ({len(sources)} Clauses)")
            for s in sources:
                ans.append(f"- **{s['standard_code']} ({s['clause']}, p. {s['page']})**: {s['snippet']}")

        return "\n".join(ans)

# Singleton pipeline
rag_pipeline = GraphAugmentedRAGPipeline()

if __name__ == "__main__":
    test_query = "What is the mandatory certification and minimum elongation for Fe 500D TMT bars under IS 1786?"
    print(f"\n[*] Executing RAG Pipeline for query: '{test_query}'\n")
    res = rag_pipeline.run(test_query)
    print("=== RAG SYNTHESIZED RESPONSE ===")
    print(res["answer"])
