# Backend Integration Map

This document maps all frontend components, state stores, and views to their corresponding backend API integration points.

---

## 🗺️ Master Integration Matrix

| Feature / Component | Clean File Path | Current State | What's Needed for Backend Integration |
| :--- | :--- | :--- | :--- |
| **API Client & Base URL** | `src/services/api.js` *(New)* | Does not exist | Create Axios/fetch client with `VITE_API_BASE_URL` and JWT bearer token interceptor |
| **Dev Server Proxy** | `vite.config.js` | Standalone local config | Add proxy rule for `/api` pointing to backend server (e.g. `http://localhost:8000`) |
| **Auth & Session State** | `src/context/AuthContext.jsx` | Hardcoded demo personas in React state | Connect `POST /api/v1/auth/login`, `GET /api/v1/auth/me`, and store JWT token in storage/cookies |
| **Login & SSO View** | `src/views/LoginView.jsx` | Mock form submissions | Send credentials/OTP to backend auth endpoint and store received token on success |
| **Tender & Procurement State** | `src/context/ProcurementContext.jsx` | In-memory state using static arrays | Add async state actions: `submitTender()`, `fetchStandards()`, `updateOverrides()` |
| **Tender Scope & BOQ Upload** | `src/views/InputFormView.jsx` | Local state form with mock file | Submit `multipart/form-data` (Excel/PDF BOQ + text) to `POST /api/v1/tenders/analyze` |
| **AI Neural Processing Logs** | `src/views/AnalyzingView.jsx` | Simulated timer & fake log lines | Connect to Server-Sent Events (SSE) or WebSocket (`/api/v1/tenders/:id/stream`) |
| **Resolved Standards & Matrix** | `src/views/DashboardView.jsx` | Reads static mock data from context | Load resolved standards, bias score, and QCO status from `GET /api/v1/tenders/:id` |
| **Standards Table & Overrides** | `src/components/StandardsTable.jsx` | In-memory filter and local toggle | Send manual inclusion/exclusion updates via `PATCH /api/v1/tenders/:id/standards` |
| **Compliance Score Meter** | `src/components/ComplianceMeter.jsx` | Static calculated score in context | Render dynamic score breakdown payload computed by the backend audit engine |
| **Model NIT Clause Export** | `src/components/ModelClauseModal.jsx` | Hardcoded text generator | Fetch official synthesized NIT technical clause from `GET /api/v1/tenders/:id/nit-clause` |
| **Digital QR Passport Tag** | `src/components/DigitalPassportQR.jsx` | Client-generated JSON payload | Encode cryptographic SHA-256 passport hash and verification URL from backend |
| **Official Certificate Reports** | `src/views/ReportsView.jsx` | Mock report templates | Trigger server-side PDF generation & download via `GET /api/v1/certificates/:id/pdf` |
| **CORA AI Mascot Chatbot** | `src/components/ChatbotWidget.jsx` | Static `BOT_KNOWLEDGE` array matcher | Replace with streaming LLM endpoint `POST /api/v1/chat/cora` |
| **Interactive Test Scenarios** | `src/views/SandboxView.jsx` | Static scenarios from file | Fetch presets from `GET /api/v1/scenarios` |
| **BIS Divisions Data** | `src/data/divisionsData.js` | Static 7 divisions list | Keep as fallback or hydrate dynamically from `GET /api/v1/divisions` |

---

## ⚠️ Centralization Requirements (Before Integration)

1. **Central API Client (`src/services/api.js`)**:
   - Create a single HTTP client instance with `baseURL` set from `import.meta.env.VITE_API_BASE_URL`.
   - Never write direct `fetch()` or `axios` calls directly inside individual JSX views.

2. **Consolidate Mock Data Imports**:
   - Remove direct imports of `src/data/mockStandardsData.js` from individual components (`StandardsTable.jsx`, `DigitalPassportQR.jsx`, `ReportsView.jsx`, `ModelClauseModal.jsx`).
   - Route all standard selections and updates exclusively through `src/context/ProcurementContext.jsx`.

3. **Global Authorization Header**:
   - Add a request interceptor in `src/services/api.js` to automatically attach:
     ```javascript
     config.headers.Authorization = `Bearer ${token}`;
     ```
