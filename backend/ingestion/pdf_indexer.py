"""
pdf_indexer.py
Ingestion & Clause-Aware Parsing Engine for BIS Standards Corpus
Smart India Hackathon (SIH) 2026

Extracts text, clause headers, tables, and tolerances from rag docs/*.pdf
using PyMuPDF (fitz) and indexes them into dense + sparse chunk stores.
"""

import os
import re
import json
import fitz
import numpy as np
from typing import List, Dict, Any

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAG_DOCS_DIR = os.path.join(os.path.dirname(BASE_DIR), "rag docs")
DATA_DIR = os.path.join(BASE_DIR, "data")
os.makedirs(DATA_DIR, exist_ok=True)

CHUNKS_FILE = os.path.join(DATA_DIR, "indexed_chunks.json")
EMBEDDINGS_FILE = os.path.join(DATA_DIR, "embeddings.npy")

def clean_text(text: str) -> str:
    """Removes headers, page artifacts, and normalizes whitespace."""
    text = re.sub(r'PROTECTED BY COPYRIGHT.*?', '', text, flags=re.IGNORECASE)
    text = re.sub(r'Bureau of Indian Standards.*?', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def chunk_pdf(pdf_path: str, standard_meta: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Extracts clause-aware chunks from a standard PDF."""
    chunks = []
    doc = fitz.open(pdf_path)
    std_code = standard_meta.get("code", os.path.basename(pdf_path))
    division = standard_meta.get("division", "General")
    title = standard_meta.get("title", "")

    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text("text")
        cleaned = clean_text(text)
        
        if len(cleaned) < 80:
            continue

        paragraphs = cleaned.split(". ")
        current_chunk = []
        current_len = 0

        for para in paragraphs:
            para = para.strip()
            if not para:
                continue
            current_chunk.append(para)
            current_len += len(para)

            if current_len >= 500:
                chunk_text = ". ".join(current_chunk) + "."
                chunk_id = f"{std_code}_p{page_num + 1}_c{len(chunks) + 1}"
                
                clause_match = re.search(r'(Clause\s+\d+(\.\d+)?|Table\s+\d+|Section\s+\d+)', chunk_text, re.IGNORECASE)
                clause_header = clause_match.group(0) if clause_match else f"Page {page_num + 1}"

                chunks.append({
                    "chunk_id": chunk_id,
                    "standard_code": std_code,
                    "division": division,
                    "standard_title": title,
                    "page": page_num + 1,
                    "clause_header": clause_header,
                    "text": chunk_text
                })
                current_chunk = []
                current_len = 0

        if current_chunk:
            chunk_text = ". ".join(current_chunk) + "."
            chunk_id = f"{std_code}_p{page_num + 1}_c{len(chunks) + 1}"
            chunks.append({
                "chunk_id": chunk_id,
                "standard_code": std_code,
                "division": division,
                "standard_title": title,
                "page": page_num + 1,
                "clause_header": f"Page {page_num + 1}",
                "text": chunk_text
            })

    doc.close()
    return chunks

def build_corpus_index(force_reindex: bool = False):
    """Indexes all PDFs in rag docs/ and generates embeddings."""
    if not force_reindex and os.path.exists(CHUNKS_FILE) and os.path.exists(EMBEDDINGS_FILE):
        print(f"[+] Existing corpus index found at {CHUNKS_FILE}. Skipping extraction.")
        with open(CHUNKS_FILE, "r", encoding="utf-8") as f:
            chunks = json.load(f)
        return chunks

    meta_index_path = os.path.join(RAG_DOCS_DIR, "standards_metadata_index.json")
    metadata_map = {}
    if os.path.exists(meta_index_path):
        with open(meta_index_path, "r", encoding="utf-8") as f:
            meta_list = json.load(f)
            for m in meta_list:
                metadata_map[m["filename"]] = m

    all_chunks = []
    pdf_files = [f for f in os.listdir(RAG_DOCS_DIR) if f.endswith(".pdf")]
    print(f"[*] Indexing {len(pdf_files)} PDF standards from: {RAG_DOCS_DIR}")

    for filename in pdf_files:
        pdf_path = os.path.join(RAG_DOCS_DIR, filename)
        meta = metadata_map.get(filename, {
            "code": filename.replace(".pdf", ""),
            "division": "General",
            "title": filename
        })
        print(f"  -> Parsing: {meta.get('code')} ({filename})")
        doc_chunks = chunk_pdf(pdf_path, meta)
        all_chunks.extend(doc_chunks)
        print(f"     Extracted {len(doc_chunks)} chunks.")

    print(f"[+] Total granular chunks extracted: {len(all_chunks)}")
    with open(CHUNKS_FILE, "w", encoding="utf-8") as f:
        json.dump(all_chunks, f, indent=2)

    print("[*] Computing dense vector embeddings with sentence-transformers...")
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer("all-MiniLM-L6-v2")
    
    texts = [f"{c['standard_code']} - {c['clause_header']}: {c['text']}" for c in all_chunks]
    embeddings = model.encode(texts, show_progress_bar=True, batch_size=32, normalize_embeddings=True)
    
    np.save(EMBEDDINGS_FILE, embeddings)
    print(f"[+] Saved embeddings to {EMBEDDINGS_FILE} with shape {embeddings.shape}")

    return all_chunks

if __name__ == "__main__":
    build_corpus_index(force_reindex=True)
