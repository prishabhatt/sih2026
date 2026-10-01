<div align="center">
  <!-- 1. BANNER/LOGO -->
  <img src="https://raw.githubusercontent.com/your-username/isync-bis-engine/main/docs/banner.png" alt="ISync Banner" width="100%" onerror="this.src='https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop'">

  <br />
  <br />

  <!-- 2. BADGES -->
  <p align="center">
    <img src="https://img.shields.io/badge/SIH-2026-FF6F00?style=for-the-badge&logo=target&logoColor=white" alt="SIH 2026" />
    <img src="https://img.shields.io/badge/PS_ID-SIH26108-0052CC?style=for-the-badge&logo=gov.uk&logoColor=white" alt="SIH26108" />
    <img src="https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 18" />
    <img src="https://img.shields.io/badge/Python_3.11-14354C?style=for-the-badge&logo=python&logoColor=white" alt="Python 3.11" />
    <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/AI-Groq_&_RAG-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black" alt="AI & RAG" />
  </p>

  <!-- 3. SHORT DESCRIPTION -->
  <h1 align="center">ISync — Right Standard, Every Time</h1>
  <p align="center">
    <b>AI-Powered Recommendation & Statutory Compliance Engine for Public Procurement Specifications</b>
    <br />
    <i>Translating plain-language procurement intent into authoritative Indian Standards (IS), mandatory QCO decrees, and audit-ready tender clauses in seconds.</i>
    <br />
    <br />
    <a href="#-quick-start-local-setup"><strong>Run Locally »</strong></a>
    ·
    <a href="https://youtu.be/your-demo-video-link"><strong>Watch YouTube Pitch & Demo »</strong></a>
  </p>
</div>

<br />

<!-- 4. PRODUCT PREVIEW -->
## 🚀 See it in Action

<div align="center">
  <img src="https://raw.githubusercontent.com/your-username/isync-bis-engine/main/docs/dashboard.png" alt="ISync Dashboard Preview" width="100%" onerror="this.src='https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop'">
  <p><i>Real-Time Compliance Matrix with Statutory QCO Badges, Knowledge Graph Traversal & Model NIT Clause Drafting</i></p>
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
* **Category:** Software 
* **Team ID:** `165691`
* **Team Name:** **SYNKRON**

---

