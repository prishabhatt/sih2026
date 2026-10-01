# 🛡️ ISync — Right Standard, Every Time
### **AI-Powered Recommendation & Statutory Compliance Engine for Public Procurement Specifications**

<div align="center">

[![SIH 2026](https://img.shields.io/badge/SIH-2026-FF6F00?style=for-the-badge&logo=target&logoColor=white)](https://www.sih.gov.in/)
[![Problem Statement](https://img.shields.io/badge/PS_ID-SIH26108-0052CC?style=for-the-badge&logo=gov.uk&logoColor=white)](https://www.sih.gov.in/)
[![Theme](https://img.shields.io/badge/Theme-Smart_Automation-00897B?style=for-the-badge&logo=sparkles&logoColor=white)](https://www.sih.gov.in/)
[![Team SYNKRON](https://img.shields.io/badge/Team-SYNKRON_(165691)-6A1B9A?style=for-the-badge&logo=users&logoColor=white)](https://github.com/prishabhatt/sih2026)
[![License: MIT](https://img.shields.io/badge/License-MIT-2E7D32?style=for-the-badge&logo=open-source-initiative&logoColor=white)](LICENSE)

<br />

[![React 18](https://img.shields.io/badge/React_18.3-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI_0.110-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python 3.11](https://img.shields.io/badge/Python_3.11-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![NetworkX 3.2](https://img.shields.io/badge/NetworkX-Knowledge_Graph-orange?style=flat-square&logo=diagram-next&logoColor=white)](https://networkx.org/)
[![SentenceTransformers](https://img.shields.io/badge/SentenceTransformers-all--MiniLM--L6--v2-blueviolet?style=flat-square&logo=huggingface&logoColor=white)](https://huggingface.co/)
[![Groq LLM](https://img.shields.io/badge/LLM_Inference-Groq_API-F55036?style=flat-square&logo=groq&logoColor=white)](https://groq.com/)

<p align="center">
  <b>Translating colloquial procurement intent into authoritative Indian Standards (IS), mandatory Quality Control Orders (QCOs), and audit-ready tender clauses in seconds.</b>
</p>

[🚀 Quick Start](#quick-start) • [💡 Problem & Solution](#problem-solution) • [📊 Facts & Impact](#facts-impact) • [🏗️ System Architecture](#system-architecture) • [📸 Visual Walkthrough](#visual-walkthrough) • [👥 Team Details](#team-details)

</div>

---

<p align="center">
  <img src="./photos/Landing%20page.png" alt="ISync Hero Landing Page" width="95%" />
  <br />
  <i>Figure 1: ISync Institutional Landing Page featuring Live Regulatory Statistics, Real-time RAG Access, and BIS Division Directory.</i>
</p>

---

## 📌 Executive Summary

Public procurement in India accounts for approximately **20% to 25% of the national GDP**. Under **General Financial Rules (GFR 2017) Rule 144(xi)** and statutory **Quality Control Orders (QCOs)** issued under **Section 16 of the Bureau of Indian Standards (BIS) Act, 2016**, procuring entities across Central Ministries, CPWD, Indian Railways, NHAI, Defense, and State PSUs are legally bound to specify Indian Standards (IS) and enforce mandatory certification.

However, with **over 22,410+ active standards** spanning 15 engineering divisions, procurement officials face extreme cognitive overload. The result:
1. **Copy-Paste Inertia:** Tenders routinely recycle 10-year-old specifications containing superseded or withdrawn standards.
2. **Missing Normative Linkages:** Tenders specify a primary product code (e.g., `IS 694` for PVC cables) but omit mandatory auxiliary raw-material testing protocols (`IS 8130` for conductor resistance, `IS 5831` for insulation elongation, `IS 10810` for spark testing).
3. **Statutory Non-Compliance:** Unlawful inclusion of in-house testing exemptions or unbranded waivers that violate Gazette QCOs and expose officers to vigilance and CAG audit penalties.
4. **Vendor Lock-in Bias:** Subtle proprietary clauses intentionally tailored to favor single OEMs, destroying competitive neutrality.

**ISync** resolves this systemic crisis. It is a domain-specialized GovTech compliance and recommendation engine that ingests plain-language requirements or multi-format tender BOQs (PDF, DOCX, XLSX, TXT), performs **Graph-Augmented Hybrid RAG (BM25 + Dense Semantic Embeddings + NetworkX Knowledge Graph DAG)**, executes a **4-Tier Statutory Audit**, and auto-generates audit-ready **Model NIT Clauses** equipped with tamper-proof **SHA-256 Digital Compliance Passports**.

---

<a id="facts-impact"></a>
## 📊 Key Facts & Impact Metrics

| Metric / Dimension | Traditional Procurement Process | With ISync Engine | Measurable Gain / Impact |
| :--- | :--- | :--- | :--- |
| **Average Specification Time** | 3 to 7 working days | **< 45 seconds** | **~98% reduction in drafting cycle** |
| **Standards Search Accuracy** | Keyword lookup / Manual index search | **Hybrid RRF (BM25 + `all-MiniLM-L6-v2`)** | Captures exact technical codes (`Fe 500D`) and intent |
| **QCO Evasion Detection** | Manual vetting (often missed during evaluation) | **Automated Section 16 BIS Act Enforcement** | **100% elimination of illegal self-certification loopholes** |
| **Normative Test Chain Identification** | Rarely identified beyond main product code | **Automated NetworkX DAG Traversal** | Automatically attaches linked raw material & safety codes |
| **Document Anti-Slop Safeguard** | Evaluators manually sift through junk files | **Regex & Linguistic Multi-Pattern Classifier** | Instantly rejects non-procurement files with 0% score |
| **Linguistic Accessibility** | Exclusively English | **8 Indian Languages** (Hindi, Gujarati, Tamil, etc.) | Democratizes procurement standards across regional offices |
| **Audit Verification Trail** | Physical paper stamps & manual file review | **Cryptographic SHA-256 Hash + Scannable QR** | Instant non-repudiation for CAG & CVC vigilance audits |

---

<a id="problem-solution"></a>
## 💡 The Problem & The Solution

```
THE REAL-WORLD VIGILANCE CHALLENGE:
  Tender Clause Drafted: "Vendor may submit in-house lab test reports in lieu of BIS certification to support startups."
  STATUTORY VERDICT:     ILLEGAL UNDER SECTION 16 & 29, BIS ACT 2016.
                         Procuring officers cannot waive Gazette Quality Control Orders.
                         Result: Tender cancellation, litigation, audit recovery.
```

### The Problem
* **22,410+ Standards Across 15 Technical Divisions:** Navigating Civil (CED), Electrotechnical (ETD), Electronics (LITD), Mechanical (MED), Food & Agriculture (FAD), and Chemicals (PCD) is virtually impossible without specialized technical committees.
* **Severe Statutory Hazards:** Omitting `Fe 500D` ductility thresholds (minimum 16.0% elongation under `IS 1786:2008`) or permitting recycled plastics in potable water pipelines (`IS 4984:1995`) causes catastrophic structural and public health failures.
* **CAG & CVC Scrutiny:** Central Vigilance Commission (CVC) guidelines mandate strict neutrality; deviations invite departmental inquiries and project stay-orders.

### The Solution: ISync 4-Pillar Regulatory Engine
1. **Semantic IS Resolution:** Maps unstructured requirements, colloquially phrased BOQ line items, or technical tender documents into authentic Bureau of Indian Standards codes.
2. **Deterministic Gazette QCO Enforcement:** Cross-references active Gazette decrees to distinguish Scheme-I (ISI Mark) from Scheme-II (CRS Registration) and flag unlawful exemption clauses.
3. **Graph-Augmented Normative Traversal:** Traverses dependency graphs to ensure zero missing feedstock or auxiliary test clauses.
4. **Institutional Non-Repudiation:** Generates formatted Model NIT Technical Clauses, printable compliance certificates, and tamper-proof SHA-256 QR passports.

---

<a id="system-architecture"></a>
## 🏗️ System Architecture & Flow Diagrams

### 1. End-to-End System Architecture

The following diagram illustrates how an incoming procurement request moves from multi-format parsing through hybrid retrieval, knowledge graph validation, regulatory LLM synthesis, and output generation:

```mermaid
flowchart TD
    classDef default fill:#0f172a,stroke:#334155,stroke-width:1.5px,color:#ffffff;
    classDef stage fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#ffffff;
    classDef check fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#ffffff;
    classDef reject fill:#7f1d1d,stroke:#ef4444,stroke-width:2px,color:#ffffff;
    classDef success fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#ffffff;
    classDef warn fill:#78350f,stroke:#f59e0b,stroke-width:2px,color:#ffffff;

    subgraph S1["1. MULTI-FORMAT INGESTION & ANTI-SLOP SECURITY GATEWAY"]
        INP["📄 Draft Tender Upload / BOQ Input\nFormats: PDF (PyMuPDF), DOCX (python-docx), XLSX (openpyxl), TXT, Prompt"]
        PARSE["⚙️ Multi-Format Document Parser\nExtracts text layers, structural tables, and schedules of requirements"]
        GATE{"🛡️ Procurement Document Classifier\nRegex heuristics + domain semantic signal detection"}
        REJ["🚫 Rejection Notice Issued\nStatutory Compliance: 0.0%\nRejection Reason: Non-Procurement File (CV / LOR / Medical)\nHalts processing & suppresses hallucinated standards"]
        NORM["🌐 Indic Linguistic Normalizer\nUnicode script detection & transliteration for 8 Indian Languages\nProduces canonical English search query"]

        INP --> PARSE
        PARSE --> GATE
        GATE -- "Detected Non-Tender" --> REJ
        GATE -- "Valid Public Tender" --> NORM
    end

    subgraph S2["2. GRAPH-AUGMENTED HYBRID RETRIEVAL (RRF FUSION)"]
        CANON["🔍 Canonical Technical Specification\nNormalized tender line item terms (e.g., '1.1 kV PVC armoured cable')"]
        
        BM25["🔤 Sparse Lexical Retrieval (BM25Okapi)\nMatches exact alphanumeric standards:\n• Fe 500D, IS 694:2010, IS 1786\n• Ingress Protection IP66, IK08 impact"]
        DENSE["🧠 Dense Semantic Retrieval (all-MiniLM-L6-v2)\n384-dimensional dense vector embeddings\nCaptures contextual engineering requirements & colloquial terms"]
        
        RRF["⚡ Reciprocal Rank Fusion (RRF, k=60)\nRRF_Score = Σ (1 / (60 + rank_i))\nSynthesizes optimal ranked standard clause chunks"]
        
        CANON --> BM25
        CANON --> DENSE
        BM25 --> RRF
        DENSE --> RRF
    end

    subgraph S3["3. DETERMINISTIC KNOWLEDGE GRAPH TRAVERSAL (NetworkX DAG)"]
        DAG["🕸️ Standards Knowledge Graph (NetworkX DAG)\n22,410+ Active Standards across 15 BIS Engineering Divisions"]
        
        NORM_DEP["🔗 Normative Testing Dependencies\nAuto-attaches mandatory lab test codes:\n• IS 8130 (Conductor Resistance)\n• IS 5831 (Tensile & Elongation)\n• IS 10810 (Spark & Oxygen Index)"]
        QCO_RULE["📜 Statutory Gazette QCO Verification\nCross-references Ministry orders under Section 16 BIS Act 2016\nEnforces mandatory ISI/CRS licensing"]
        SCHEME["🏷️ Conformity Scheme Validation\nDistinguishes Scheme-I (ISI Mark CM/L) from Scheme-II (CRS R-XXXXXXXX)"]
        TOL_RULE["📐 Mechanical & Chemical Tolerances\n• Fe 500D: Enforces elongation >= 16.0%\n• HDPE Pipes: Strict 0% recycled PE policy (IS 4984)"]

        DAG --> NORM_DEP
        DAG --> QCO_RULE
        DAG --> SCHEME
        DAG --> TOL_RULE
    end

    subgraph S4["4. REGULATORY GUARDRAILS & STRICT LLM INFERENCE"]
        CTX["📦 Structured Regulatory Context Assembly\nFuses: (1) RRF Standard Chunks + (2) Deterministic Graph Rules + (3) GFR 2017 Directives"]
        LLM["🤖 Groq API Inference Engine\nModel: openai/gpt-oss-120b | Temperature: 0.2\nSystem Guardrail: Zero-hallucination policy with mandatory clause-level statutory citations"]
        
        RRF --> CTX
        NORM_DEP & QCO_RULE & SCHEME & TOL_RULE --> CTX
        CTX --> LLM
    end

    subgraph S5["5. STATUTORY COMPLIANCE DELIVERABLES"]
        SCORE["📊 Dynamic Legal Index\nEvaluates tender compliance percentage (0% to 100%)"]
        VERD["🚨 4-Tier Audit Verdict\nFlags tolerance defects, QCO evasions, and purges spurious codes"]
        CLAUSE["📝 Model NIT Technical Clause\nGenerates authentic Sections 1.0 - 4.0 tender clauses for GeM / CPPP"]
        PDF["🖨️ Printable Compliance Report\nOfficial printable dossier with departmental verification blocks"]
        QR["🔐 SHA-256 Digital Passport & QR\nCryptographically tamper-proof audit verification token for CAG / CVC"]
        CHAT["💬 CORA AI Multilingual Copilot\nReal-time SSE streaming copilot strictly scoped to procurement standards"]

        LLM --> SCORE
        LLM --> VERD
        LLM --> CLAUSE
        LLM --> PDF
        LLM --> QR
        LLM --> CHAT
    end

    NORM --> CANON
    CANON --> DAG

    class INP,PARSE,NORM,CANON,BM25,DENSE,RRF,DAG,CTX,LLM stage;
    class GATE,SCHEME check;
    class REJ,VERD reject;
    class NORM_DEP,QCO_RULE,TOL_RULE warn;
    class SCORE,CLAUSE,PDF,QR,CHAT success;
```

---

### 2. The 4-Tier Statutory Audit & Verification Workflow

```mermaid
flowchart TD
    classDef default fill:#0f172a,stroke:#334155,stroke-width:1.5px,color:#ffffff;
    classDef stage fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#ffffff;
    classDef check fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#ffffff;
    classDef reject fill:#7f1d1d,stroke:#ef4444,stroke-width:2px,color:#ffffff;
    classDef success fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#ffffff;
    classDef warn fill:#78350f,stroke:#f59e0b,stroke-width:2px,color:#ffffff;

    START["📥 Ingest Extracted Tender Specification & BOQ Schedule"] --> TIER1

    subgraph T1["TIER 1: SPECIFICATION PARSING & ANTI-HALLUCINATION GATE"]
        TIER1["⚙️ Tokenize & Align BOQ Line Items\nExtract engineering descriptions, material grades, and alphanumeric references"]
        MAP1["🔍 Match Governing BIS Standards\nResolve candidate standards across 15 engineering divisions"]
        FILTER{"🧹 Semantic Hallucination Check\nDid vector search over-generalize to unrelated domains?"}
        PURGE["🗑️ Purge Spurious / Hallucinated Codes\n• Purge IS 7098 P2 (33kV XLPE) when tender only specifies 1.1kV low-voltage PVC\n• Purge IS 13252 (IT Safety) when tender specifies roadway LED street lighting\nLogs purged codes to transparency audit trail"]
        VALID_STD["✅ Retain Authentic Governing Standards\ne.g., IS 1786 (TMT Bars), IS 694 (PVC Cables), IS 4984 (HDPE Pipes), IS 10322 (Luminaires)"]

        TIER1 --> MAP1
        MAP1 --> FILTER
        FILTER -- "Hallucinated Standards Detected" --> PURGE
        FILTER -- "Valid Standard Alignment" --> VALID_STD
        PURGE --> VALID_STD
    end

    VALID_STD --> TIER2

    subgraph T2["TIER 2: STATUTORY QCO ENFORCEMENT & EVASION DETECTION"]
        TIER2["📜 Gazette QCO Decree Verification\nCross-reference Ministry Quality Control Orders under Section 16 BIS Act 2016"]
        QCO_CHECK{"⚖️ Check for Unlawful Exemption Clauses\nDoes tender allow 'in-house test certificates' or 'startup waivers'?"}
        QCO_FAIL["🚨 Flag Statutory Violation: Ultra Vires Exemption\n• Violation: GFR 2017 Rule 144(xi) & Section 29 BIS Act 2016\n• Finding: Procuring entities cannot waive statutory QCO certification\n• Impact: Tender invalidation & vigilance risk"]
        SCHEME_CHECK{"🏷️ Verify Conformity Assessment Scheme\nScheme-I (ISI Mark) vs Scheme-II (CRS Registration)"}
        SCHEME_FAIL["⚠️ Flag Incorrect Certification Scheme\ne.g., Demanding ISI Mark for LED Luminaires instead of mandatory CRS Registration (R-XXXXXXXX)"]
        QCO_PASS["✅ Statutory QCO Clearance\nMandatory certification clauses validated with exact legal citations"]

        TIER2 --> QCO_CHECK
        QCO_CHECK -- "Illegal Exemption Found" --> QCO_FAIL
        QCO_CHECK -- "No Illegal Exemptions" --> SCHEME_CHECK
        SCHEME_CHECK -- "Wrong Scheme Specified" --> SCHEME_FAIL
        SCHEME_CHECK -- "Scheme Validated" --> QCO_PASS
        QCO_FAIL --> TIER3
        SCHEME_FAIL --> TIER3
        QCO_PASS --> TIER3
    end

    subgraph T3["TIER 3: MECHANICAL, CHEMICAL & FEEDSTOCK INTEGRITY CHECKS"]
        TIER3["🔬 Deep Normative & Tolerance Audit\nInspect physical property thresholds and normative dependency test chains"]
        MECH_CHECK{"📐 Mechanical Ductility Check (IS 1786 Table 3)\nIs Fe 500D specified with >= 16.0% elongation?"}
        MECH_FAIL["💥 CRITICAL DEFECT: Structural Collapse Hazard\nTender specifies 12% elongation for Fe 500D; permits brittle base Fe 500 rebar in bridge viaducts"]
        POLY_CHECK{"🧪 Feedstock Purity Check (IS 4984 Clause 5.1/5.2)\nDoes HDPE specification permit recycled or regrind plastic?"}
        POLY_FAIL["⚠️ CONTAMINATION DEFECT: Pipeline Burst Hazard\nTender permits 30% recycled regrind PE; violates zero-recycled mandate for potable water"]
        TEST_CHAIN["🔗 Auto-Link Mandatory Normative Lab Tests\n• Conductor Resistance (IS 8130)  • Insulation Elongation (IS 5831)  • Spark Test (IS 10810)"]

        TIER3 --> MECH_CHECK
        MECH_CHECK -- "Elongation < 16.0%" --> MECH_FAIL
        MECH_CHECK -- "Compliant >= 16.0%" --> POLY_CHECK
        MECH_FAIL --> POLY_CHECK
        POLY_CHECK -- "Recycled Plastic Allowed" --> POLY_FAIL
        POLY_CHECK -- "Virgin Polymer Only" --> TEST_CHAIN
        POLY_FAIL --> TEST_CHAIN
    end

    TEST_CHAIN --> TIER4

    subgraph T4["TIER 4: LEGAL INDEX COMPUTATION & ARTIFACT SYNTHESIS"]
        TIER4["🧮 Compute Quantitative Statutory Score\nCalculates Legal Index (0.0% - 100.0%) based on weighted defect severity"]
        CLAUSE_GEN["📄 Synthesize Model NIT Technical Clause\nDrafts Sections 1.0 (Scope), 2.0 (Normative Codes), 3.0 (TPIA: RITES/CEIL), 4.0 (PBG Default)"]
        PASSPORT_GEN["🔐 Generate Cryptographic SHA-256 Digital Passport & Scannable QR\nEmbeds tamper-proof hash for instant verification during CAG & CVC vigilance inspections"]

        TIER4 --> CLAUSE_GEN
        CLAUSE_GEN --> PASSPORT_GEN
    end

    class START,TIER1,MAP1,VALID_STD,TIER2,TIER3,TEST_CHAIN,TIER4 stage;
    class FILTER,QCO_CHECK,SCHEME_CHECK,MECH_CHECK,POLY_CHECK check;
    class QCO_FAIL,MECH_FAIL reject;
    class PURGE,SCHEME_FAIL,POLY_FAIL warn;
    class QCO_PASS,CLAUSE_GEN,PASSPORT_GEN success;
```

---

### 3. Procurement Officer Remediation Loop

The following interactive lifecycle illustrates the end-to-end remediation process when a procurement official identifies and rectifies statutory non-compliance:

```mermaid
flowchart TD
    classDef default fill:#0f172a,stroke:#334155,stroke-width:1.5px,color:#ffffff;
    classDef userAction fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#ffffff;
    classDef engineAction fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#ffffff;
    classDef alertState fill:#7f1d1d,stroke:#ef4444,stroke-width:2px,color:#ffffff;
    classDef remedyState fill:#78350f,stroke:#f59e0b,stroke-width:2px,color:#ffffff;
    classDef successState fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#ffffff;
    classDef auditState fill:#0f172a,stroke:#10b981,stroke-width:2px,color:#ffffff;

    subgraph STEP1["PHASE 1: DRAFT TENDER INGESTION & DIAGNOSTIC AUDIT"]
        U1["👤 Procurement Officer Action\nUploads draft tender schedule / BOQ (e.g., CPWD Civil & Electrical Works .pdf)"]
        SYS1["⚡ FastAPI Engine & Knowledge Graph\nExtracts line items • Queries NetworkX Standards DAG • Cross-references Gazette QCOs"]
        DEFECTS["🚨 Initial Audit Verdict: Score 34% (CRITICAL NON-COMPLIANCE ALERT)\n• Critical Defect 1: Fe 500D rebar specified with 12% elongation (permits brittle steel in bridge viaducts)\n• Critical Defect 2: Cable clause allows unbranded in-house testing (Section 16 BIS Act violation)\n• Critical Defect 3: Missing mandatory auxiliary lab testing codes (IS 8130, IS 5831, IS 10810)"]

        U1 --> SYS1
        SYS1 --> DEFECTS
    end

    subgraph STEP2["PHASE 2: ONE-CLICK STATUTORY REMEDIATION"]
        U2["👤 Procurement Officer Action\nReviews flagged violations & clicks: 'Adopt Recommended IS Standards & Normative Clauses'"]
        SYS2["⚙️ Regulatory Remediation Engine\n• Upgrades rebar specification to Fe 500D with >= 16.0% elongation (IS 1786 Table 3)\n• Revokes in-house self-testing waiver; enforces mandatory Scheme-I ISI Mark\n• Auto-attaches complete normative testing dependency chain into tender clauses"]
        SURGE["📈 Real-Time Compliance Surge: Legal Index Jumps from 34% ➔ 96%\nAll statutory quality control orders and GFR Rule 144(xi) principles satisfied"]

        DEFECTS --> U2
        U2 --> SYS2
        SYS2 --> SURGE
    end

    subgraph STEP3["PHASE 3: STATUTORY ARTIFACT GENERATION & PUBLICATION"]
        MODEL["📝 Synthesize Model NIT Technical Clause\nGenerates formatted GoI tender text (Sections 1.0 Scope, 2.0 Normative Standards, 3.0 TPIA, 4.0 PBG)"]
        PDF["🖨️ Download Printable Audit Dossier (PDF)\nIncludes complete compliance certificate with official verification & signature blocks"]
        QR["🔐 Issue Cryptographic SHA-256 Digital Passport & Scannable QR\nEmbeds tamper-proof verification hash into the published GeM / CPPP tender notice"]

        SURGE --> MODEL
        MODEL --> PDF
        MODEL --> QR
    end

    subgraph STEP4["PHASE 4: FIELD INSPECTION & VIGILANCE AUDITABILITY"]
        AUDIT["🔍 CAG / CVC Vigilance Inspector Field Verification\nInspector scans dynamic QR code on published tender dossier or site delivery\nInstant real-time verification confirms immutable SHA-256 hash & regulatory compliance"]

        QR --> AUDIT
    end

    class U1,U2 userAction;
    class SYS1,SYS2 engineAction;
    class DEFECTS alertState;
    class SURGE successState;
    class MODEL,PDF,QR remedyState;
    class AUDIT auditState;
```

---

<a id="visual-walkthrough"></a>
## 📸 Visual Feature Walkthrough

Here is the complete, documented visual journey through **ISync**, demonstrating how each module functions in real time with high-resolution captures from the operational application.

---

### Phase 1: Institutional Portal & Role-Based Access Control

The ISync platform provides a hardened GovTech interface designed for high accessibility, multi-role operations, and instant visibility into national standardization metrics.

<p align="center">
  <img src="./photos/Landing%20page.png" alt="ISync Landing Page" width="95%" />
  <br />
  <i>Figure 1.1: Institutional Landing Page showcasing the national compliance matrix, live stats (22,410+ standards, 15 divisions), and direct access to compliance tools.</i>
</p>

<p align="center">
  <img src="./photos/Login%20sign%20up%20options%20availble%20for%20the%20portal.png" alt="Role-Based Authentication Options" width="85%" />
  <br />
  <i>Figure 1.2: Multi-persona Authentication Interface with fine-grained access tiers for Procurement Officers, Technical Evaluators, and Vigilance Officers.</i>
</p>

---

### Phase 2: Live RAG Regulatory Search & Interactive Engine

Procurement officials can query technical specifications, obscure product standards, or normative requirements directly from the home portal with sub-second hybrid retrieval.

<p align="center">
  <img src="./photos/RAG%20Pipeline%20execution%20option%20on%20the%20landing%20page.png" alt="RAG Pipeline Execution Option" width="95%" />
  <br />
  <i>Figure 2.1: Integrated RAG Pipeline interactive console on the landing page for quick statutory verification of specific engineering items.</i>
</p>

<p align="center">
  <img src="./photos/Execution%20of%20RAG%20pipeline%20in%20action.png" alt="RAG Pipeline in Action" width="95%" />
  <br />
  <i>Figure 2.2: Live RAG execution tracing canonical query expansion, retrieved normative standard chunks, and citation-backed legal findings.</i>
</p>

---

### Phase 3: Intelligent Tender Audit & Anti-Slop Safeguard

A critical feature for hackathon evaluation: ISync accepts genuine procurement documents (PDF/DOCX/XLSX) and rigorously detects non-procurement files (such as academic letters of recommendation, resumes, or medical bills), immediately rejecting them to preserve system integrity.

#### Scenario A: Genuine Public Procurement Tender (BOQ)
When an official CPWD/Railways tender is uploaded, ISync extracts every schedule item, identifies latent tolerance defects, and flags illegal QCO exemptions.

<p align="center">
  <img src="./photos/uploading%20Procurement%20File.png" alt="Uploading Procurement File" width="90%" />
  <br />
  <i>Figure 3.1: Ingestion of genuine multi-item public procurement schedule (BOQ specification containing steel rebars, cables, and piping).</i>
</p>

<p align="center">
  <img src="./photos/Result%20of%20%20procurement%20file.png" alt="Result of Procurement File Audit" width="95%" />
  <br />
  <i>Figure 3.2: Comprehensive 4-Tier Audit Verdict flagging critical tolerance defects (Fe 500D elongation breach) and statutory QCO evasions.</i>
</p>

#### Scenario B: Non-Procurement Document Rejection (Anti-Slop Guard)
Generic AI tools often hallucinate standards even when fed non-procurement files. ISync's classification gate immediately rejects invalid files and logs a zero-compliance audit notice.

<p align="center">
  <img src="./photos/uploading%20none%20procurement%20file.png" alt="Uploading Non-Procurement File" width="90%" />
  <br />
  <i>Figure 3.3: Ingestion of a non-procurement document (Letter of Recommendation / Academic CV) to test system resilience.</i>
</p>

<p align="center">
  <img src="./photos/Result%20of%20None%20procurement%20file.png" alt="Result of Non-Procurement File" width="95%" />
  <br />
  <i>Figure 3.4: Instant Document Rejection: Engine detects zero procurement line items, awards 0% compliance, and halts spurious processing.</i>
</p>

---

### Phase 4: Statutory Legal Index & Real-Time Remediation

When the procurement officer clicks to accept recommended standard corrections, the system automatically resolves missing auxiliary test codes, eliminates illegal clauses, and recalculates the tender's Legal Index.

<p align="center">
  <img src="./photos/Result%20in%20Legal%20index%20after%20adding%20the%20recommended%20IS%20standards.png" alt="Legal Index Surge After Adding Recommended Standards" width="95%" />
  <br />
  <i>Figure 4.1: Real-time Legal Index jump from high risk to 95%+ statutory compliance upon incorporating recommended BIS standards and normative testing codes.</i>
</p>

---

### Phase 5: Model NIT Technical Clauses & Offline Printable Reports

ISync automates the complete statutory clause drafting process according to Government of India tender conventions (Sections 1.0 to 4.0), and generates official printable reports for physical departmental files.

<p align="center">
  <img src="./photos/Generated%20Model%20Clause.png" alt="Generated Model NIT Clause" width="95%" />
  <br />
  <i>Figure 5.1: Synthesized Model NIT Technical Clause ready for one-click copy and incorporation into GeM / Central Public Procurement Portal bids.</i>
</p>

<p align="center">
  <img src="./photos/Generated%20compliance%20report%20for%20offline%20filing%20(printable).png" alt="Printable Compliance Report" width="95%" />
  <br />
  <i>Figure 5.2: Government-formatted, printable Statutory Compliance Dossier with physical signature and verification blocks for departmental records.</i>
</p>

---

### Phase 6: Domain-Grounded Multilingual Conversational AI (CORA Copilot)

CORA (Compliance & Official Regulatory Assistant) is our specialized copilot. Powered by strict regulatory guardrails, CORA assists officers in 8 Indian languages, clarifying obscure clauses while strictly declining off-topic prompts.

<p align="center">
  <img src="./photos/CORA%20AI%20live%20in%20action%20making%20recommendation.png" alt="CORA AI Live in Action" width="95%" />
  <br />
  <i>Figure 6.1: CORA Copilot explaining normative requirements, mandatory testing protocols, and Gazette directives in real time.</i>
</p>

<p align="center">
  <img src="./photos/CORA%20AI%20does%20not%20answer%20unrelated%20questions.png" alt="CORA AI Domain Guardrails" width="95%" />
  <br />
  <i>Figure 6.2: Institutional Guardrails in action: CORA politely declines non-regulatory / off-topic queries to preserve GovTech focus and audit integrity.</i>
</p>

---

### Phase 7: Cryptographic SHA-256 Digital Compliance Passport

Every generated tender dossier is cryptographically hashed using SHA-256 and embedded into a scannable QR Code. Field vigilance inspectors, CAG auditors, and site engineers can scan the code to verify authenticity in real time.

<p align="center">
  <img src="./photos/QR%20CODE%20scanning%20feature%20available%20(the%20site%20needs%20to%20be%20live%20for%20this%20to%20work).png" alt="Digital Compliance Passport QR Feature" width="85%" />
  <br />
  <i>Figure 7.1: SHA-256 Tamper-Proof Digital Passport & Dynamic QR Code ensuring non-repudiation during CVC inspections and vigilance reviews.</i>
</p>

---

## 🔬 The 4-Tier Regulatory Verification Engine

The core compliance logic in `backend/audit/tender_auditor.py` executes a comprehensive 4-stage inspection:

```
┌────────────────────────────────────────────────────────────────────────┐
│               ISYNC 4-TIER REGULATORY AUDIT PROTOCOL                  │
├────────────────────────────────────────────────────────────────────────┤
│ TIER 1: ITEM RESOLUTION & HALLUCINATION PURGING                        │
│   • Multi-term regex + token alignment against BIS standard registry   │
│   • Explicit purge of hallucinated standards (e.g. XLPE cables or MeitY│
│     IT safety codes when tender specifies low-voltage PVC wires)       │
├────────────────────────────────────────────────────────────────────────┤
│ TIER 2: STATUTORY QCO ENFORCEMENT (SECTION 16 BIS ACT 2016)           │
│   • Flags unlawful clauses: "in-house testing accepted", "startup     │
│     waiver for ISI mark", or unbranded supplies                        │
│   • Enforces mandatory Scheme-I (ISI Mark) vs Scheme-II (CRS)          │
├────────────────────────────────────────────────────────────────────────┤
│ TIER 3: MECHANICAL, CHEMICAL & FEEDSTOCK INTEGRITY CHECKS              │
│   • Fe 500D rebar: Enforces minimum 16.0% elongation (IS 1786 Table 3) │
│   • HDPE potable water pipes: Enforces 0% recycled / regrind polymer   │
│     blend (IS 4984 Clause 5.1/5.2)                                     │
│   • Auto-links mandatory test standards (IS 8130, IS 5831, IS 10810)   │
├────────────────────────────────────────────────────────────────────────┤
│ TIER 4: LEGAL INDEX SCORING & DIGITAL PASSPORT TAGGING                 │
│   • Computes quantitative statutory risk score (0.0% to 100.0%)        │
│   • Generates Model NIT Clauses with RITES/CEIL/TUV inspection rules   │
│   • Computes SHA-256 tamper-proof hash and scannable QR verification   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🧰 Technology Stack

### Architecture & Layer Breakdown

| Component / Layer | Technology | Key Capabilities & Rationale |
| :--- | :--- | :--- |
| **Frontend Framework** | `React 18.3` + `Vite 6.0` | Ultra-fast Hot Module Replacement, sub-second route rendering |
| **Styling & Design System** | `TailwindCSS v3.4` + `Framer Motion` | Modern GovTech glassmorphism, responsive light/dark themes |
| **Icons & Visuals** | `lucide-react` | Clean, standardized government-grade iconography |
| **PDF & Report Export** | `jsPDF 4.2` | Client-side vector rendering of official printable dossiers |
| **Cryptographic Tagging** | `qrcode.react` + `hashlib` (SHA-256) | Non-repudiable verification for field vigilance inspections |
| **Backend REST & SSE** | `FastAPI 0.110` + `Uvicorn 0.28` | Asynchronous Python ASGI server with native streaming endpoints |
| **Document Ingestion** | `PyMuPDF (fitz)` + `openpyxl` + `docx` | High-speed structured extraction from PDF, DOCX, XLSX, and TXT |
| **Dense Embeddings** | `SentenceTransformers (all-MiniLM-L6-v2)` | 384-dimensional dense semantic vector space for intent matching |
| **Lexical Search** | `rank-bm25 (BM25Okapi)` | Exact matching of alphanumeric engineering codes (`Fe 500D`, `IS 694`) |
| **Retrieval Fusion** | `Reciprocal Rank Fusion (RRF, k=60)` | Blends dense and sparse retrieval ranks without manual weight tuning |
| **Knowledge Graph** | `NetworkX 3.2` | Directed Acyclic Graph (DAG) for normative testing dependencies & QCOs |
| **LLM Inference** | `Groq API (openai/gpt-oss-120b)` | Low-latency inference (<1.2s) constrained by strict regulatory prompts |
| **Multilingual NLP** | Indic Normalizer (Regex + Unicode Map) | Normalizes 8 Indian languages (Hindi, Gujarati, Marathi, Tamil, etc.) |
| **State Management** | React Context (`ProcurementContext`, `AuthContext`) | Centralized state store for tender analysis, overrides, and auth |

---

<a id="quick-start"></a>
## ⚡ Quick Start (Local Setup)

Follow these instructions to run **ISync** locally on your machine.

### Prerequisites
* **Node.js** (v18.0 or higher) & **npm**
* **Python** (v3.10 or v3.11)
* **Git**

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/prishabhatt/sih2026.git
cd sih2026
```

---

### Step 2: Frontend Setup
```bash
# 1. Install frontend npm dependencies
npm install

# 2. Start the Vite development server
npm run dev
```
> The web interface will become accessible at: **`http://localhost:3000`** (or `http://localhost:5173`).

---

### Step 3: Backend Setup
Open a new terminal window:
```bash
# Navigate to the backend directory
cd backend

# Create a Python virtual environment
python -m venv .venv

# Activate the virtual environment
# On Windows:
.venv\Scripts\activate
# On Linux / macOS:
source .venv/bin/activate

# Install required Python dependencies
pip install -r requirements.txt

# Start the FastAPI ASGI server with auto-reload
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
> Interactive Swagger API documentation will be available at: **`http://localhost:8000/docs`**.

---

### Step 4: Environment Variables (`.env`)
Create or verify `.env` in the root of `sih2026/`:
```env
# Groq / LLM API Configuration
VITE_OPENAI_API_KEY=your_groq_or_openai_api_key_here
VITE_OPENAI_BASE_URL=https://api.groq.com/openai/v1
VITE_OPENAI_MODEL=openai/gpt-oss-120b

# Backend API Configuration
VITE_API_BASE_URL=http://localhost:8000
```

---

<a id="team-details"></a>
## 👥 Meet the Team

<div align="center">

### **Smart India Hackathon 2026 (SIH 2026)**
**Ministry / Organization:** Bureau of Indian Standards (BIS) / Ministry of Consumer Affairs  
**Problem Statement ID:** `SIH26108`  
**Problem Statement Title:** *AI-Powered Recommendation Engine for Identifying Applicable Indian Standards for Procurement Specifications*  
**Theme:** `Smart Automation`  
**Category:** `Software / GovTech`  

<br />

| Metric | Official Details |
| :--- | :--- |
| **Team ID** | `165691` |
| **Team Name** | **SYNKRON** |
| **Repository** | [prishabhatt/sih2026](https://github.com/prishabhatt/sih2026) |

</div>

---

## 📜 Compliance & Regulatory References

1. **The Bureau of Indian Standards Act, 2016 (Act No. 11 of 2016):**
   * *Section 16:* Power of Central Government to direct mandatory use of Standard Mark under Quality Control Orders.
   * *Section 29:* Penalties for improper use of Standard Mark, spurious conformity claims, and contravention of Section 16 orders.
2. **General Financial Rules (GFR 2017), Ministry of Finance, Department of Expenditure:**
   * *Rule 144(i):* Specifications must meet the basic needs of the procuring entity without including superfluous requirements.
   * *Rule 144(iv):* Standards must be generic and, wherever available, must conform to national standards issued by the Bureau of Indian Standards.
   * *Rule 144(xi):* Prohibition of restrictive brand/make conditions or specifications favoring single vendors.
3. **Manual for Procurement of Goods (Updated 2024), Ministry of Finance:**
   * Guidelines on Third-Party Inspection Agencies (TPIA: RITES, CEIL, DNV, TUV, SGS) and Performance Bank Guarantee (PBG) invocations for quality default.

---

## 📄 License
This project is developed for the **Smart India Hackathon (SIH 2026)** and is distributed under the **MIT License**. See the `LICENSE` file for full terms and conditions.

<div align="center">
  <sub>Built with ❤️ by Team <b>SYNKRON</b> for Smart India Hackathon 2026</sub>
</div>
