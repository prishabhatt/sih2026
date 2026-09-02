/**
 * Glassmorphic Verification Successful overlay — replaces canvas-confetti.
 * 
 * Shows a centered frosted-glass card with checkmark, "Verified" title,
 * and description. Auto-dismisses after 2 seconds or on click.
 * 
 * Usage:
 *   import { triggerVerification } from '../utils/verificationPulse';
 *   triggerVerification();
 */
export function triggerVerification(title = 'Verified', message = 'Specification compliance confirmed.') {
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
    background: isDark ? 'rgba(10, 10, 10, 0.6)' : 'rgba(0, 0, 0, 0.25)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    opacity: '0',
    transition: 'opacity 0.3s ease',
    cursor: 'pointer',
  });

  // Create glassmorphic card
  const card = document.createElement('div');
  Object.assign(card.style, {
    background: isDark
      ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.85) 0%, rgba(20, 20, 20, 0.75) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0.82) 100%)',
    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.06)'}`,
    borderRadius: '24px',
    padding: '48px 56px',
    textAlign: 'center',
    maxWidth: '340px',
    width: '90%',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    boxShadow: isDark
      ? '0 24px 80px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
      : '0 24px 80px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
    transform: 'scale(0.85) translateY(20px)',
    opacity: '0',
    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  });

  card.innerHTML = `
    <div style="
      width: 72px; height: 72px;
      margin: 0 auto 24px;
      border-radius: 20px;
      background: ${isDark
        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.08) 100%)'
        : 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)'};
      border: 1px solid ${isDark ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.2)'};
      display: flex; align-items: center; justify-content: center;
      position: relative;
    ">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${isDark ? '#34D399' : '#059669'}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="
        opacity: 0; transform: scale(0);
        animation: verify-check-pop 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
      ">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </div>
    <h3 style="
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 18px; font-weight: 700;
      color: ${isDark ? '#F8FAFC' : '#1A1A1A'};
      margin: 0 0 8px;
      letter-spacing: -0.02em;
    ">${title}</h3>
    <p style="
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 13px; font-weight: 400;
      color: ${isDark ? '#94A3B8' : '#6B7280'};
      margin: 0 0 28px;
      line-height: 1.5;
    ">${message}</p>
    <button id="verify-done-btn" style="
      width: 100%;
      padding: 12px 0;
      border-radius: 12px;
      border: none;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 13px; font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      background: ${isDark ? 'rgba(255, 255, 255, 0.9)' : '#1A1A1A'};
      color: ${isDark ? '#0A0A0A' : '#FFFFFF'};
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
    card.style.transform = 'scale(0.95) translateY(10px)';
    card.style.opacity = '0';
    setTimeout(() => backdrop.remove(), 300);
  };

  // Click backdrop or Done button to dismiss
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop || e.target.id === 'verify-done-btn') dismiss();
  });

  // Auto-dismiss after 2.5s
  setTimeout(dismiss, 2500);
}
