/**
 * Glassmorphic Action Notification Modal — for Standard Enrollment & Statutory Verification.
 * 
 * Shows a centered frosted-glass card with relevant standard code, title,
 * statutory status, and action feedback.
 * 
 * Usage:
 *   triggerVerification({
 *     title: 'Standard Added to Draft',
 *     code: 'IS 7098 (Part 2) : 2011',
 *     description: 'Crosslinked Polyethylene Insulated Cables',
 *     badge: 'Mandatory QCO Enforced',
 *     actionText: 'Enrolled in active tender schedule with normative test protocols.'
 *   });
 */
export function triggerVerification(opts = {}) {
  // Support both object arguments and legacy string signatures (title, message)
  let title = 'Official Identity Verified';
  let message = '2-Factor Government Token & Biometric Signature Authenticated.';
  let code = '';
  let badge = 'BIS Authorized Official';
  let isRemoval = false;

  if (typeof opts === 'string') {
    title = opts;
    message = arguments[1] || message;
  } else if (typeof opts === 'object' && opts !== null) {
    title = opts.title || title;
    code = opts.code || '';
    message = opts.description || opts.message || message;
    badge = opts.badge !== undefined ? opts.badge : badge;
    isRemoval = Boolean(opts.isRemoval);
  }

  // Remove any existing overlay
  const existing = document.getElementById('verify-overlay');
  if (existing) existing.remove();

  const isDark = document.documentElement.classList.contains('dark');

  // Create backdrop
  const backdrop = document.createElement('div');
  backdrop.id = 'verify-overlay';
  Object.assign(backdrop.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '99999',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: isDark ? 'rgba(5, 10, 20, 0.75)' : 'rgba(15, 23, 42, 0.35)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    opacity: '0',
    transition: 'opacity 0.25s ease',
    cursor: 'pointer',
    padding: '16px'
  });

  // Create glassmorphic card
  const card = document.createElement('div');
  Object.assign(card.style, {
    background: isDark
      ? 'linear-gradient(145deg, rgba(20, 28, 48, 0.92) 0%, rgba(10, 15, 30, 0.88) 100%)'
      : 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
    border: `2px solid ${isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.95)'}`,
    borderRadius: '28px',
    padding: '32px 28px',
    textAlign: 'center',
    maxWidth: '380px',
    width: '100%',
    backdropFilter: 'blur(28px)',
    WebkitBackdropFilter: 'blur(28px)',
    boxShadow: isDark
      ? '0 24px 80px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
      : '0 24px 80px rgba(15, 23, 42, 0.16), inset 0 2px 0 rgba(255, 255, 255, 1)',
    transform: 'scale(0.88) translateY(16px)',
    opacity: '0',
    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
    cursor: 'default',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  });

  const iconBg = isRemoval
    ? (isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)')
    : (isDark ? 'rgba(16, 185, 129, 0.18)' : 'rgba(16, 185, 129, 0.12)');

  const iconBorder = isRemoval
    ? (isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.25)')
    : (isDark ? 'rgba(16, 185, 129, 0.35)' : 'rgba(16, 185, 129, 0.25)');

  const iconColor = isRemoval
    ? (isDark ? '#F87171' : '#DC2626')
    : (isDark ? '#34D399' : '#059669');

  const iconSvg = isRemoval
    ? `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation: verify-check-pop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>`
    : `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation: verify-check-pop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;">
        <polyline points="20 6 9 17 4 12"/>
      </svg>`;

  card.innerHTML = `
    <!-- Top Icon Badge -->
    <div style="
      width: 58px; height: 58px;
      margin: 0 auto;
      border-radius: 18px;
      background: ${iconBg};
      border: 1.5px solid ${iconBorder};
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 14px ${iconBg};
    ">
      ${iconSvg}
    </div>

    <!-- Title -->
    <div>
      <h3 style="
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 16px; font-weight: 800;
        color: ${isDark ? '#F8FAFC' : '#0F172A'};
        margin: 0;
        letter-spacing: -0.02em;
      ">${title}</h3>
      ${badge ? `
        <span style="
          display: inline-block;
          margin-top: 6px;
          padding: 2px 10px;
          border-radius: 9999px;
          font-size: 10px; font-weight: 700;
          background: ${isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.12)'};
          color: ${isDark ? '#34D399' : '#047857'};
          border: 1px solid ${isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.2)'};
          font-family: system-ui, sans-serif;
        ">${badge}</span>
      ` : ''}
    </div>

    <!-- Standard Details Card -->
    ${code ? `
      <div style="
        width: 100%;
        padding: 12px 14px;
        border-radius: 14px;
        background: ${isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(241, 245, 249, 0.8)'};
        border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(226, 232, 240, 0.8)'};
        text-align: left;
        margin: 4px 0;
      ">
        <span style="
          display: block;
          font-family: ui-monospace, SFMono-Regular, monospace;
          font-size: 12px; font-weight: 800;
          color: ${isDark ? '#60A5FA' : '#1D4ED8'};
          letter-spacing: -0.01em;
        ">${code}</span>
        <p style="
          font-family: system-ui, sans-serif;
          font-size: 11px; font-weight: 500;
          color: ${isDark ? '#CBD5E1' : '#475569'};
          margin: 4px 0 0;
          line-height: 1.4;
        ">${message}</p>
      </div>
    ` : `
      <p style="
        font-family: system-ui, sans-serif;
        font-size: 12px; font-weight: 400;
        color: ${isDark ? '#94A3B8' : '#64748B'};
        margin: 0;
        line-height: 1.5;
      ">${message}</p>
    `}

    <!-- Done / Close Button -->
    <button id="verify-done-btn" style="
      width: 100%;
      padding: 10px 0;
      border-radius: 12px;
      border: 1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'};
      font-family: system-ui, sans-serif;
      font-size: 12px; font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      background: ${isDark ? '#FFFFFF' : '#0B1E36'};
      color: ${isDark ? '#0A0A0A' : '#FFFFFF'};
      margin-top: 4px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    ">Done</button>
  `;

  // Inject keyframes if not already present
  if (!document.getElementById('verify-keyframes')) {
    const style = document.createElement('style');
    style.id = 'verify-keyframes';
    style.textContent = `
      @keyframes verify-check-pop {
        0% { opacity: 0; transform: scale(0) rotate(-20deg); }
        60% { opacity: 1; transform: scale(1.15) rotate(3deg); }
        100% { opacity: 1; transform: scale(1) rotate(0deg); }
      }
    `;
    document.head.appendChild(style);
  }

  backdrop.appendChild(card);
  document.body.appendChild(backdrop);

  // Trigger entrance animation
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      backdrop.style.opacity = '1';
      card.style.transform = 'scale(1) translateY(0)';
      card.style.opacity = '1';
    });
  });

  // Dismiss function
  const dismiss = () => {
    backdrop.style.opacity = '0';
    card.style.transform = 'scale(0.95) translateY(8px)';
    card.style.opacity = '0';
    setTimeout(() => backdrop.remove(), 250);
  };

  // Click backdrop or Done button to dismiss
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop || e.target.id === 'verify-done-btn' || e.target.closest('#verify-done-btn')) dismiss();
  });

  // Auto-dismiss after 2.8s
  setTimeout(dismiss, 2800);
}

