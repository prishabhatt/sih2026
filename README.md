<div align="center">

# 🛡️ ISync — Right Standard, Every Time
### **AI-Powered Recommendation & Statutory Compliance Engine for Public Procurement Specifications**

[![SIH 2026](https://img.shields.io/badge/SIH-2026-FF6F00?style=for-the-badge)](https://sih.gov.in)
[![Problem Statement](https://img.shields.io/badge/Problem%20Statement-SIH26108-0052CC?style=for-the-badge)](https://sih.gov.in)
[![Theme](https://img.shields.io/badge/Theme-Smart%20Automation-00875A?style=for-the-badge)](https://sih.gov.in)
[![Team](https://img.shields.io/badge/Team-SYNKRON%20(165691)-4C51BF?style=for-the-badge)](#-meet-the-team)
[![React 18](https://img.shields.io/badge/React-18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![Python 3.11](https://img.shields.io/badge/Python-3.11-14354C?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![AI / RAG](https://img.shields.io/badge/AI-Groq%20%7C%20RAG-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black)](https://groq.com)

<p align="center">
  <b>Translating plain-language procurement intent into authoritative Indian Standards (IS), mandatory QCO decrees, and audit-ready tender clauses in seconds.</b>
  <br />
  <br />
  <a href="#-quick-start-local-setup"><strong>🚀 Run Locally »</strong></a>
  ·
  <a href="https://youtu.be/your-demo-video-link"><strong>🎬 Watch YouTube Pitch & Demo »</strong></a>
</p>

</div>

---

## 💡 The Problem & The Solution

**The Problem:**  
Under **GFR 2017 Rule 144** and statutory **Quality Control Orders (QCOs)**, public procurement officers across Railways, CPWD, and PSUs are legally mandated to specify exact Indian Standards (IS). However, navigating over **20,000+ standards** across 15+ engineering divisions causes cognitive overload—resulting in colloquial specifications, missing mandatory auxiliary testing codes, and copy-pasting outdated standards from 10-year-old tenders that lead to costly litigations and audit rejections.

**The Solution:**  
**ISync** is a domain-scoped AI compliance copilot that ingests plain-language requirements or tender PDFs, executes **Hybrid Retrieval (BM25 + Dense vector search via Reciprocal Rank Fusion)**, traverses a **NetworkX Standards Knowledge Graph DAG**, verifies live Gazette QCO validity, and auto-generates audit-ready **Model NIT Technical Clauses** with cryptographic **SHA-256 Digital Compliance Passports**.

---

## ✨ Key Features

*   **🔍 Smart Spec Matcher (Hybrid Search):** Fuses sparse BM25 lexical search with dense `all-MiniLM-L6-v2` embeddings via Reciprocal Rank Fusion ($k=60$) to capture exact alphanumeric codes (`Fe 500D`, `IS 694`) while understanding everyday functional terms.
*   **🕸️ Standard Web (Knowledge Graph DAG):** Traverses a NetworkX Directed Acyclic Graph to automatically surface linked normative references, raw material grades (`IS 8130`, `IS 5831`), and mandatory laboratory testing protocols (`IS 10810`).
*   **⏱️ Version Watch & QCO Enforcement:** Real-time cross-referencing against official Gazette records to flag withdrawn/superseded standards and enforce mandatory ISI/CRS certification under Section 16 of the BIS Act 2016.
*   **📄 Model NIT Technical Clause Generator:** Instantly drafts an authentic, formatted Government of India tender document (Sections 1.0 to 4.0 covering bidder pre-qualification, approved TPIA bodies like RITES/CEIL, and PBG legal recourse) exportable as an official PDF.
*   **🤖 CORA Copilot & Bhasha Query:** Multilingual conversational AI copilot supporting regional Indian languages (Hindi, Gujarati, Tamil, Marathi, etc.) with real-time Server-Sent Events (SSE) streaming.
*   **🛡️ Digital Compliance Passport:** Issues an encrypted SHA-256 digital hash and scannable QR Code for every generated tender dossier, ensuring tamper-proof non-repudiation during vigilance and CAG audits.

---

## 🧰 Built With

*   **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, Lucide Icons, jsPDF
*   **Backend & APIs:** Python 3.11, FastAPI, Uvicorn (Asynchronous REST & SSE Streaming)
*   **AI / ML & Search:** SentenceTransformers (`all-MiniLM-L6-v2`), `rank-bm25` (BM25Okapi), Reciprocal Rank Fusion (RRF)
*   **LLM & Graph Engine:** Groq API (`openai/gpt-oss-120b` at Temp 0.2), NetworkX (Standards DAG)
*   **Document Parsing & Auth:** PyMuPDF (`fitz`), Firebase Auth (Role-Based Access Control)
*   **Security & Integrity:** Cryptographic SHA-256, `qrcode.react` Digital Passports

---

## ⚡ Quick Start (Local Setup)

Follow these simple steps to run **ISync** locally on your machine:

### Prerequisites
* **Node.js** (v18.0+)
* **Python** (v3.10+)
* **Git**

### 1. Clone the repository
```bash
git clone https://github.com/prishabhatt/sih2026.git
cd sih2026
```

### 2. Frontend Setup
```bash
# Install node dependencies
npm install

# Start Vite dev server
npm run dev
```
> The web application will launch locally at `http://localhost:3000`.

### 3. Backend Setup
```bash
cd backend

# Create and activate Python virtual environment
python -m venv .venv

# On Windows:
.venv\Scripts\activate
# On Linux / macOS:
source .venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt

# Start the FastAPI ASGI server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
> Interactive API Swagger documentation will be accessible at `http://localhost:8000/docs`.

---

## 👥 Meet the Team

* **Hackathon:** Smart India Hackathon 2026 (SIH 2026)
* **Problem Statement ID:** `SIH26108`
* **Problem Statement Title:** *AI-Powered Recommendation Engine for Identifying Applicable Indian Standards for Procurement Specifications*
* **Theme:** Smart Automation
* **Category:** Software / GovTech
* **Team ID:** `165691`
* **Team Name:** **SYNKRON**

---

## 📜 License
Distributed under the **MIT License**. See `LICENSE` for more information.
