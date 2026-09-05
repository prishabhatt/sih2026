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
    title="ISync Regulatory Graph-Augmented RAG Engine",
    description="Production-grade compliance API for public e-procurement (GeM / CPPP)",
    version="1.0.0"
)

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
        "service": "ISync Regulatory Graph-RAG Engine",
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

import io
try:
    import docx
except ImportError:
    docx = None

try:
    import openpyxl
except ImportError:
    openpyxl = None


def extract_document_text(filename: str, file_bytes: bytes) -> tuple[str, Optional[str]]:
    """
    Extracts text from uploaded documents across multiple formats:
    - PDF (PyMuPDF)
    - DOCX (python-docx)
    - XLSX / CSV (openpyxl / standard parsing)
    - TXT / Text
    - Images (detects raster images and provides clear diagnostic)
    """
    fn = filename.lower()
    extracted = ""
    error_msg = None

    if fn.endswith(".pdf"):
        try:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            for page in doc:
                extracted += page.get_text() + "\n"
            doc.close()
            if not extracted.strip():
                error_msg = "PDF contains no extractable text layers. It may be a flat scanned image requiring OCR."
        except Exception as e:
            error_msg = f"Failed to parse PDF document: {str(e)}"

    elif fn.endswith((".docx", ".doc")):
        if docx:
            try:
                doc = docx.Document(io.BytesIO(file_bytes))
                paras = [p.text for p in doc.paragraphs if p.text.strip()]
                tables_text = []
                for table in doc.tables:
                    for row in table.rows:
                        row_vals = [cell.text.strip() for cell in row.cells if cell.text.strip()]
                        if row_vals:
                            tables_text.append(" | ".join(row_vals))
                extracted = "\n".join(paras + tables_text)
            except Exception as e:
                error_msg = f"Failed to parse DOCX file: {str(e)}"
        else:
            error_msg = "DOCX parser is not installed on the server."

    elif fn.endswith((".xlsx", ".xls")):
        if openpyxl:
            try:
                wb = openpyxl.load_workbook(io.BytesIO(file_bytes), data_only=True)
                sheet_lines = []
                for sheet in wb.sheetnames:
                    ws = wb[sheet]
                    for row in ws.iter_rows(values_only=True):
                        vals = [str(v).strip() for v in row if v is not None and str(v).strip()]
                        if vals:
                            sheet_lines.append(" | ".join(vals))
                extracted = "\n".join(sheet_lines)
            except Exception as e:
                error_msg = f"Failed to parse Excel workbook: {str(e)}"
        else:
            error_msg = "Excel parser (openpyxl) is not installed on the server."

    elif fn.endswith((".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tiff")):
        error_msg = (
            f"Image file ('{filename}') detected. Raw image files without an OCR text layer "
            "cannot be parsed directly as tender specifications. Please upload a PDF, DOCX, XLSX, or paste the text."
        )

    else:
        # Fallback to UTF-8 text with fallback to latin-1
        try:
            extracted = file_bytes.decode("utf-8")
        except UnicodeDecodeError:
            extracted = file_bytes.decode("latin-1", errors="ignore")

    return extracted, error_msg


@app.post("/api/rag/audit-tender")
async def audit_tender(
    file: Optional[UploadFile] = File(None),
    text_content: Optional[str] = Form(None)
):
    """
    Audits an uploaded tender document (PDF/DOCX/XLSX/TXT) or raw text for BIS/QCO compliance.
    Rejects non-procurement files (e.g. letters of recommendation, resumes) with 0% compliance.
    """
    extracted_text = ""
    parse_warning = None

    if file:
        file_bytes = await file.read()
        extracted_text, parse_warning = extract_document_text(file.filename, file_bytes)
    elif text_content:
        extracted_text = text_content
    else:
        raise HTTPException(status_code=400, detail="Please upload a tender file or provide text_content")

    if parse_warning and not extracted_text.strip():
        # Clean rejection for unparseable image or bad document
        return {
            "status": "Audit Rejected: Unreadable Document",
            "is_valid_tender": False,
            "document_type": "Image / Scanned File without Text Layer",
            "rejection_reason": parse_warning,
            "document_name": file.filename if file else "Unknown",
            "extracted_character_count": 0,
            "mapped_standards": [],
            "hallucinated_standards_purged": [],
            "statutory_qco_score": 0.0,
            "statutory_qco_audit_notes": f"AUDIT REJECTED: {parse_warning}",
            "identified_violations": [],
            "raw_material_coverage": 0.0,
            "raw_material_audit_breakdown": {},
            "audit_report": f"REJECTION NOTICE: {parse_warning}",
            "cited_clauses": []
        }

    if not extracted_text.strip():
        raise HTTPException(status_code=400, detail="No readable text found in the provided document")

    # Run 4-Tier Verification Protocol & Domain Classification
    audit_data = tender_auditor.audit_tender_document(extracted_text)

    # If the document is classified as a non-tender (e.g. Letter of Recommendation, resume),
    # reject immediately with 0% score without running wasteful RAG queries.
    if not audit_data.get("is_valid_tender", True):
        return {
            "status": "Audit Rejected: Non-Tender Document",
            "is_valid_tender": False,
            "document_type": audit_data.get("document_type", "Non-Procurement Document"),
            "rejection_reason": audit_data.get("rejection_reason", "Not a valid tender document"),
            "document_name": file.filename if file else "Pasted Specification",
            "extracted_character_count": len(extracted_text),
            "mapped_standards": [],
            "hallucinated_standards_purged": [],
            "statutory_qco_score": 0.0,
            "statutory_qco_audit_notes": audit_data.get("statutory_qco_audit_notes", "Audit rejected."),
            "identified_violations": [],
            "raw_material_coverage": 0.0,
            "raw_material_audit_breakdown": {},
            "audit_report": (
                f"DOCUMENT REJECTED BY REGULATORY ENGINE: The uploaded document has been classified as "
                f"'{audit_data.get('document_type')}'. It contains zero public procurement line items, "
                "schedule of requirements, or Bureau of Indian Standards clauses. Statutory compliance score: 0%."
            ),
            "cited_clauses": []
        }

    # Run RAG synthesis query for valid tender documents
    first_std = audit_data["mapped_standards"][0]["governing_standard"] if audit_data["mapped_standards"] else "IS Standards"
    audit_query = f"Audit the following tender technical specification for mandatory BIS standards and QCO compliance for {first_std}: {extracted_text[:1500]}"
    audit_result = rag_pipeline.run(audit_query, top_k=4)

    return {
        "status": "Audit Complete",
        "is_valid_tender": True,
        "document_type": audit_data.get("document_type", "Tender Document"),
        "rejection_reason": None,
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
