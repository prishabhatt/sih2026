"""
hybrid_search.py
Hybrid Sparse (BM25) + Dense (Embedding) + Reciprocal Rank Fusion Engine
Smart India Hackathon (SIH) 2026

Combines BM25 lexical token matching with dense vector search to resolve
exact engineering tolerances, IS codes, and semantic specification queries.
"""

import os
import re
import json
import numpy as np
from typing import List, Dict, Any, Optional
from rank_bm25 import BM25Okapi
from sentence_transformers import SentenceTransformer

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
CHUNKS_FILE = os.path.join(DATA_DIR, "indexed_chunks.json")
EMBEDDINGS_FILE = os.path.join(DATA_DIR, "embeddings.npy")

def tokenize(text: str) -> List[str]:
    """Tokenize text into lowercase alphanumeric words + IS code tokens."""
    return re.findall(r'[A-Za-z0-9]+', text.lower())

class HybridRetriever:
    def __init__(self):
        self.chunks: List[Dict[str, Any]] = []
        self.embeddings: Optional[np.ndarray] = None
        self.bm25: Optional[BM25Okapi] = None
        self.encoder: Optional[SentenceTransformer] = None
        self._load_indices()

    def _load_indices(self):
        if not os.path.exists(CHUNKS_FILE) or not os.path.exists(EMBEDDINGS_FILE):
            raise FileNotFoundError(f"Index files missing in {DATA_DIR}. Run pdf_indexer.py first.")

        print("[*] Loading chunks and embeddings for Hybrid Retriever...")
        with open(CHUNKS_FILE, "r", encoding="utf-8") as f:
            self.chunks = json.load(f)

        self.embeddings = np.load(EMBEDDINGS_FILE)
        print(f"[+] Loaded {len(self.chunks)} chunks with embedding shape {self.embeddings.shape}")

        print("[*] Building BM25 index on regulatory text...")
        corpus_tokens = [tokenize(f"{c['standard_code']} {c['clause_header']} {c['text']}") for c in self.chunks]
        self.bm25 = BM25Okapi(corpus_tokens)

        print("[*] Loading SentenceTransformer encoder...")
        self.encoder = SentenceTransformer("all-MiniLM-L6-v2")
        print("[+] Hybrid Retriever initialized successfully.")

    def search_dense(self, query: str, top_k: int = 25) -> List[tuple]:
        """Dense cosine similarity search."""
        query_emb = self.encoder.encode([query], normalize_embeddings=True)[0]
        scores = np.dot(self.embeddings, query_emb)
        top_indices = np.argsort(scores)[::-1][:top_k]
        return [(idx, float(scores[idx])) for idx in top_indices]

    def search_sparse(self, query: str, top_k: int = 25) -> List[tuple]:
        """Sparse BM25 search for exact IS codes and engineering keywords."""
        query_tokens = tokenize(query)
        if not query_tokens:
            return []
        scores = self.bm25.get_scores(query_tokens)
        top_indices = np.argsort(scores)[::-1][:top_k]
        return [(idx, float(scores[idx])) for idx in top_indices if scores[idx] > 0]

    def search(
        self,
        query: str,
        top_k: int = 5,
        division_filter: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Executes Reciprocal Rank Fusion (RRF) between Dense and BM25 results.
        Formula: RRF_score = sum(1 / (k + rank)) where k=60
        """
        k = 60
        dense_results = self.search_dense(query, top_k=35)
        sparse_results = self.search_sparse(query, top_k=35)

        rrf_scores: Dict[int, float] = {}

        for rank, (idx, _) in enumerate(dense_results):
            rrf_scores[idx] = rrf_scores.get(idx, 0.0) + (1.0 / (k + rank + 1))

        for rank, (idx, _) in enumerate(sparse_results):
            rrf_scores[idx] = rrf_scores.get(idx, 0.0) + (1.2 / (k + rank + 1))

        sorted_indices = sorted(rrf_scores.keys(), key=lambda x: rrf_scores[x], reverse=True)

        results = []
        for idx in sorted_indices:
            chunk = dict(self.chunks[idx])
            
            if division_filter and chunk.get("division") != division_filter:
                continue

            chunk["rrf_score"] = round(rrf_scores[idx], 5)
            results.append(chunk)

            if len(results) >= top_k:
                break

        return results

if __name__ == "__main__":
    retriever = HybridRetriever()
    test_q = "Fe 500D elongation tensile strength requirements"
    print(f"\n[*] Testing search: '{test_q}'")
    hits = retriever.search(test_q, top_k=3)
    for h in hits:
        print(f"  [{h['standard_code']}] {h['clause_header']} (RRF: {h['rrf_score']})")
        print(f"  Snippet: {h['text'][:140]}...\n")
