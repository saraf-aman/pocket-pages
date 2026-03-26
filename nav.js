/**
 * Pocket Pages — shared navigation
 * To add a new page: add one entry to the PAGES array below.
 * Every page that includes this script will automatically show the updated menu.
 *
 * Auth guard is built in here — any page loading this script is automatically
 * protected. No per-page auth code needed.
 */

// ── Auth guard (runs immediately, before anything else) ───────────────────────
(function () {
  const SESSION_KEY   = 'pp_auth';
  const ALLOWED_EMAIL = 'amansaraf28@gmail.com';
  const scriptTag     = document.currentScript;
  const rootPath      = scriptTag ? (scriptTag.getAttribute('data-root') || '..') : '..';

  if (sessionStorage.getItem(SESSION_KEY) !== ALLOWED_EMAIL) {
    window.location.replace(rootPath + '/index.html');
    // Stop all further script execution on this page
    throw new Error('pp:unauthenticated');
  }
})();

// ── Navigation ────────────────────────────────────────────────────────────────
const PAGES = [
  { title: "Laundry Guide", href: "laundry-guide.html", icon: "🧺" },
  // { title: "My New Page", href: "my-new-page.html", icon: "📝" },
];

(function () {
  const BAR_H = 44;

  // ── Inject CSS ────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    .pp-nav-wrapper{position:sticky;top:0;z-index:200;height:${BAR_H}px;}
    .pp-top-bar{background:#111D2E;display:flex;align-items:center;justify-content:space-between;padding:0 20px;height:${BAR_H}px;border-bottom:1px solid rgba(255,255,255,0.07);}
    .pp-back{display:inline-flex;align-items:center;gap:7px;color:rgba(255,255,255,0.55);font-size:13px;font-weight:500;text-decoration:none;transition:color 0.15s;}
    .pp-back:hover{color:#fff;}
    .pp-ham-btn{background:none;border:none;cursor:pointer;color:rgba(255,255,255,0.55);display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:8px;transition:background 0.15s,color 0.15s;padding:0;}
    .pp-ham-btn:hover{background:rgba(255,255,255,0.08);color:#fff;}
    .pp-ham-btn.open{background:rgba(255,255,255,0.1);color:#fff;}
    .pp-overlay{display:none;position:fixed;inset:0;z-index:290;background:rgba(0,0,0,0.25);}
    .pp-overlay.visible{display:block;}
    .pp-panel{position:fixed;top:${BAR_H}px;right:0;z-index:300;width:260px;background:#fff;border-radius:0 0 0 14px;box-shadow:0 8px 32px rgba(0,0,0,0.15);transform:translateX(100%);transition:transform 0.22s cubic-bezier(0.4,0,0.2,1);overflow:hidden;}
    .pp-panel.open{transform:translateX(0);}
    .pp-panel-heading{padding:14px 18px 8px;font-size:10px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#aaa;font-family:'DM Mono',monospace;}
    .pp-page-link{display:flex;align-items:center;gap:11px;padding:11px 18px;font-size:14px;color:#333;text-decoration:none;transition:background 0.13s;}
    .pp-page-link:hover{background:#F4F3EF;}
    .pp-page-link.current{background:#EAF3FC;color:#1E6FBF;font-weight:500;}
    .pp-page-link .pp-icon{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;background:#F0EDE6;}
    .pp-page-link.current .pp-icon{background:#C2D8EF;}
    .pp-panel-divider{height:1px;background:#F0EDE6;margin:6px 0;}
    .pp-home-link{display:flex;align-items:center;gap:9px;padding:11px 18px 14px;font-size:13px;color:#888;text-decoration:none;transition:background 0.13s;}
    .pp-home-link:hover{background:#F4F3EF;color:#333;}
    .main-nav{top:${BAR_H}px !important;}
  `;
  document.head.appendChild(style);

  // ── Detect current page ───────────────────────────────────────────────────
  const scriptTag = document.currentScript;
  const currentHref = scriptTag ? scriptTag.getAttribute('data-current') : null;
  const rootPath = scriptTag ? (scriptTag.getAttribute('data-root') || '..') : '..';

  // ── Build HTML ────────────────────────────────────────────────────────────
  const pageLinks = PAGES.map(p => {
    const isCurrent = currentHref && p.href === currentHref;
    return `<a href="${p.href}" class="pp-page-link${isCurrent ? ' current' : ''}">
      <span class="pp-icon">${p.icon}</span>${p.title}
    </a>`;
  }).join('');

  const topBar = document.createElement('div');
  topBar.className = 'pp-nav-wrapper';
  topBar.innerHTML = `
    <div class="pp-top-bar">
      <a href="${rootPath}/index.html" class="pp-back">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Pocket Pages
      </a>
      <button class="pp-ham-btn" id="ppHamBtn" aria-label="Menu">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
      </button>
    </div>
    <div class="pp-overlay" id="ppOverlay"></div>
    <div class="pp-panel" id="ppPanel">
      <div class="pp-panel-heading">Pages</div>
      ${pageLinks}
      <div class="pp-panel-divider"></div>
      <a href="${rootPath}/index.html" class="pp-home-link">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Back to home
      </a>
    </div>
  `;

  // ── Insert at top of body (safe whether script is in <head> or <body>) ────
  function mount() {
    document.body.insertBefore(topBar, document.body.firstChild);
    document.getElementById('ppHamBtn').addEventListener('click', toggleMenu);
    document.getElementById('ppOverlay').addEventListener('click', closeMenu);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }
  if (document.body) { mount(); } else { document.addEventListener('DOMContentLoaded', mount); }

  // ── Wire up interactions ──────────────────────────────────────────────────
  function toggleMenu() {
    const panel   = document.getElementById('ppPanel');
    const overlay = document.getElementById('ppOverlay');
    const btn     = document.getElementById('ppHamBtn');
    const isOpen  = panel.classList.contains('open');
    panel.classList.toggle('open', !isOpen);
    overlay.classList.toggle('visible', !isOpen);
    btn.classList.toggle('open', !isOpen);
  }
  function closeMenu() {
    document.getElementById('ppPanel').classList.remove('open');
    document.getElementById('ppOverlay').classList.remove('visible');
    document.getElementById('ppHamBtn').classList.remove('open');
  }
})();
