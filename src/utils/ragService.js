/**
 * ragService.js
 * Frontend Client Bridge for the Graph-Augmented RAG Engine
 * Smart India Hackathon (SIH) 2026
 */

const RAG_BACKEND_URL = import.meta.env.VITE_RAG_BACKEND_URL || 'http://localhost:8000';

/**
 * Checks if the local Graph-RAG Python backend is active.
 * @returns {Promise<boolean>}
 */
export async function isRAGBackendOnline() {
  try {
    const res = await fetch(`${RAG_BACKEND_URL}/`, { method: 'GET', signal: AbortSignal.timeout(1500) });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Sends a query to the Graph-Augmented RAG Pipeline.
 * @param {string} query
 * @param {number} [top_k=4]
 * @param {string} [division]
 * @returns {Promise<{
 *   query: string,
 *   canonical_query: string,
 *   detected_language: string,
 *   graph_facts: object|null,
 *   retrieved_sources: Array<object>,
 *   answer: string
 * }>}
 */
export async function queryRAG(query, top_k = 4, division = null) {
  const response = await fetch(`${RAG_BACKEND_URL}/api/rag/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, top_k, division })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`RAG_SERVER_ERROR:${response.status}:${errText}`);
  }

  return await response.json();
}

/**
 * Uploads a tender document (PDF/TXT) or raw specification text for automated compliance auditing.
 * @param {File|string} fileOrText
 * @returns {Promise<object>}
 */
export async function auditTender(fileOrText) {
  const formData = new FormData();

  if (fileOrText instanceof File) {
    formData.append('file', fileOrText);
  } else {
    formData.append('text_content', fileOrText);
  }

  const response = await fetch(`${RAG_BACKEND_URL}/api/rag/audit-tender`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`AUDIT_ERROR:${response.status}:${errText}`);
  }

  return await response.json();
}

/**
 * Fetches the node-link graph structure for D3 / Cytoscape network visualizers.
 * @returns {Promise<{nodes: Array<object>, links: Array<object>}>}
 */
export async function fetchStandardsGraph() {
  const response = await fetch(`${RAG_BACKEND_URL}/api/rag/graph`);
  if (!response.ok) throw new Error("FAILED_FETCH_GRAPH");
  return await response.json();
}
