"""
main.py
FastAPI Server for Graph-Augmented Hybrid RAG Pipeline
Smart India Hackathon (SIH) 2026

Exposes endpoints for interactive queries, tender BOQ auditing, and graph visualization.
Run with: uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
"""

import os
import sys
from pathlib import Path

# Add project root to sys.path so 'import backend...' works regardless of where the command is run
project_root = str(Path(__file__).resolve().parent.parent)
if project_root not in sys.path:
    sys.path.insert(0, project_root)

import pymupdf as fitz  # PyMuPDF
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.pipeline import rag_pipeline
from backend.graph.standards_graph import standards_kg
from backend.audit.tender_auditor import tender_auditor

app = FastAPI(
    title="BIS Regulatory Graph-Augmented RAG Engine",
    description="Production-grade compliance API for public e-procurement (GeM / CPPP)",
    version="1.0.0"
)

# ─── In-memory store for published compliance reports (keyed by certificate_id) ───
published_reports: Dict[str, Dict[str, Any]] = {}

# Enable CORS for the React frontend (running on Vite http://localhost:5173 or similar)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str
    top_k: Optional[int] = 4
    division: Optional[str] = None

class QueryResponse(BaseModel):
    query: str
    canonical_query: str
    detected_language: str
    graph_facts: Optional[Dict[str, Any]]
    retrieved_sources: List[Dict[str, Any]]
    answer: str

@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "BIS Regulatory Graph-RAG Engine",
        "version": "1.0.0",
        "indexed_chunks": len(rag_pipeline.retriever.chunks),
        "standards_in_graph": len(standards_kg.graph.nodes)
    }

@app.post("/api/rag/query", response_model=QueryResponse)
def query_standards(req: QueryRequest):
    """Processes user query through Graph-Augmented RAG Pipeline."""
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    result = rag_pipeline.run(user_query=req.query, top_k=req.top_k)
    return result

@app.post("/api/rag/audit-tender")
async def audit_tender(
    file: Optional[UploadFile] = File(None),
    text_content: Optional[str] = Form(None)
):
    """
    Audits an uploaded tender document (PDF/TXT) or raw text for BIS/QCO compliance.
    """
    extracted_text = ""
    if file:
        file_bytes = await file.read()
        filename = file.filename.lower()
        if filename.endswith(".pdf"):
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            for page in doc:
                extracted_text += page.get_text() + "\n"
            doc.close()
        else:
            extracted_text = file_bytes.decode("utf-8", errors="ignore")
    elif text_content:
        extracted_text = text_content
    else:
        raise HTTPException(status_code=400, detail="Please upload a tender file or provide text_content")

    if not extracted_text.strip():
        raise HTTPException(status_code=400, detail="No readable text found in the provided document")

    # Run 4-Tier Verification Protocol
    audit_data = tender_auditor.audit_tender_document(extracted_text)

    # Run RAG synthesis query
    first_std = audit_data["mapped_standards"][0]["governing_standard"] if audit_data["mapped_standards"] else "IS Standards"
    audit_query = f"Audit the following tender technical specification for mandatory BIS standards and QCO compliance for {first_std}: {extracted_text[:1500]}"
    audit_result = rag_pipeline.run(audit_query, top_k=4)

    return {
        "status": "Audit Complete",
        "document_name": file.filename if file else "Pasted Specification",
        "extracted_character_count": len(extracted_text),
        "mapped_standards": audit_data["mapped_standards"],
        "hallucinated_standards_purged": audit_data["hallucinated_standards_purged"],
        "statutory_qco_score": audit_data["statutory_qco_score"],
        "statutory_qco_audit_notes": audit_data["statutory_qco_audit_notes"],
        "identified_violations": audit_data["identified_violations"],
        "raw_material_coverage": audit_data["raw_material_coverage"],
        "raw_material_audit_breakdown": audit_data["raw_material_audit_breakdown"],
        "audit_report": audit_result["answer"],
        "cited_clauses": audit_result["retrieved_sources"]
    }

@app.get("/api/rag/standards")
def list_standards():
    """Lists all standards currently active in the knowledge graph."""
    nodes = []
    for n, d in standards_kg.graph.nodes(data=True):
        if d.get("type") == "Standard":
            nodes.append({
                "code": d.get("full_code", n),
                "title": d.get("title"),
                "division": d.get("division"),
                "scheme": d.get("scheme"),
                "mandatory_qco": d.get("mandatory_qco", False),
                "qco_name": d.get("qco_name")
            })
    return {"total": len(nodes), "standards": nodes}

@app.get("/api/rag/graph")
def get_graph_data():
    """Returns node-link data for frontend network graph visualizers."""
    return standards_kg.export_graph_for_ui()


# ─── COMPLIANCE REPORT ENDPOINTS (for QR Verification) ──────────────────────

class ReportPublishRequest(BaseModel):
    certificate_id: str
    payload: Dict[str, Any]

@app.post("/api/reports/publish")
def publish_report(req: ReportPublishRequest):
    """
    Publishes a compliance audit report for QR-based verification.
    Stores the payload in memory keyed by certificate_id.
    Returns the certificate_id and a relative verify path.
    """
    published_reports[req.certificate_id] = req.payload
    return {
        "status": "published",
        "certificate_id": req.certificate_id,
        "verify_path": f"/verify/{req.certificate_id}"
    }

@app.get("/api/reports/{certificate_id}")
def get_report(certificate_id: str):
    """
    Retrieves a previously published compliance report by certificate_id.
    Used by the frontend VerifyView when a QR code is scanned.
    """
    report = published_reports.get(certificate_id)
    if not report:
        raise HTTPException(status_code=404, detail=f"Report '{certificate_id}' not found. It may not have been published yet.")
    return {
        "status": "found",
        "certificate_id": certificate_id,
        "payload": report
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
