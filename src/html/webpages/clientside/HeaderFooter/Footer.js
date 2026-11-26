import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/* ===================================================================
   CONTENT – edit these arrays to change menu / news / FAQ
   without touching the JSX.
=================================================================== */

// Put your real emblem here (e.g. '/img/emblem_of_india_colorful.png').
// If empty, the built-in placeholder seal is used.
const EMBLEM_SRC = '/img/emblem_of_india_colorful.png';

const NAV_ITEMS = [
    { label: 'Home', view: 'home', icon: 'i-home' },
    { label: 'Instructions', view: 'instructions', icon: 'i-book' },
    {
        label: 'Apply Online',
        icon: 'i-edit',
        children: [
            { label: 'Register via DigiLocker', hint: 'First-time applicants', href: '/register', icon: 'i-user-plus' },
            { label: "Candidate's Login", hint: 'Continue or view your application', href: '/login', icon: 'i-login' },
        ],
    },
    { label: 'FAQ', view: 'faq', icon: 'i-help' },
    { label: 'Contact Us', view: 'contact', icon: 'i-phone' },
];

const NEWS = [
    { text: 'Online applications are open for Class III posts under Government of Assam', type: 'Notice', date: '2026-11-18', isNew: true },
    { text: 'Candidates must read the advertisement and eligibility criteria before applying', type: 'Notice', date: '2026-11-15' },
    { text: 'Keep a scanned photograph, signature and valid ID ready before starting the form', type: 'Update', date: '2026-11-12' },
    { text: 'Beware of fraudulent websites and agents: apply only through this official portal', type: 'Update', date: '2026-11-10' },
];

const FAQS = [
    { q: 'How do I apply for Class III posts?', a: 'Applications are accepted online only through this portal. Use the Apply Online menu to begin. (Replace with official text.)' },
    { q: 'Can I apply offline?', a: 'No. Applications are accepted online only. (Replace with official text.)' },
    { q: 'Where can I find the instructions?', a: 'Open the Instructions page from the main navigation. (Replace with official text.)' },
    { q: 'Whom do I contact for help?', a: 'See the Contact Us page for helpdesk details. (Replace with official text.)' },
];

const VIEWS = ['home', 'instructions', 'faq', 'contact'];
const VIEW_TITLES = { home: 'Home', instructions: 'Instructions', faq: 'FAQ', contact: 'Contact Us' };
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const TICKER_MS = 6000;

/* ===================================================================
   STYLES
   Everything is scoped under .seba-app so it will not leak into the
   rest of your site.
=================================================================== */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Bengali:wght@500;600;700&display=swap');

.seba-app{
  --navy-900:#0c2340; --navy-800:#13315c; --navy-700:#1d4378; --navy-50:#eef3fa;
  --saffron-500:#f59e0b; --saffron-600:#d97706; --saffron-50:#fff7e8;
  --green-600:#15803d; --green-50:#ecfdf3; --red-600:#b42318; --red-50:#fef3f2;
  --bg:#f5f7fa; --surface:#ffffff; --surface-2:#f9fafb; --border:#e3e8ef; --border-strong:#cdd5df;
  --text:#101828; --text-2:#475467; --text-3:#667085;
  --radius-sm:6px; --radius:10px; --radius-lg:14px;
  --shadow-sm:0 1px 2px rgba(16,24,40,.06);
  --shadow:0 4px 12px -2px rgba(16,24,40,.08), 0 2px 4px -2px rgba(16,24,40,.04);
  --shadow-lg:0 12px 32px -8px rgba(16,24,40,.18);
  --font:"Inter","Segoe UI",system-ui,-apple-system,Roboto,"Helvetica Neue",Arial,sans-serif;
  --font-as:"Noto Sans Bengali","Nirmala UI","Vrinda","Shonar Bangla",sans-serif;
  --container:1200px; --nav-h:56px;

  margin:0;font-family:var(--font);font-size:15px;line-height:1.55;color:var(--text);background:var(--bg);
  min-height:100vh;display:flex;flex-direction:column;
}
.seba-app *,.seba-app *::before,.seba-app *::after{box-sizing:border-box}
html{scroll-behavior:smooth}
.seba-app img,.seba-app svg{display:block}
.seba-app a{color:var(--navy-700)}
.seba-app button{font:inherit;cursor:pointer}
.seba-app .as{font-family:var(--font-as)}
.seba-app .container{width:100%;max-width:var(--container);margin:0 auto;padding:0 20px}
.seba-app .visually-hidden{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.seba-app :focus-visible{outline:3px solid var(--saffron-500);outline-offset:2px;border-radius:4px}

.seba-app .skip-link{position:absolute;left:12px;top:-60px;z-index:100;background:var(--navy-800);color:#fff;
  padding:10px 16px;border-radius:var(--radius-sm);text-decoration:none;font-weight:600;transition:top .15s}
.seba-app .skip-link:focus{top:12px}


/* Footer */
.seba-app .site-footer{background:var(--navy-900);color:#c3d1e4;font-size:14px}
.seba-app .site-footer .container{display:grid;grid-template-columns:1.5fr 1fr 1fr;gap:32px;padding-top:40px;padding-bottom:32px}
.seba-app .site-footer h4{margin:0 0 12px;color:#fff;font-size:14px;text-transform:uppercase;letter-spacing:.08em}
.seba-app .site-footer p{margin:0 0 8px}
.seba-app .site-footer ul{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.seba-app .site-footer a{color:#dbe4f0;text-decoration:none}
.seba-app .site-footer a:hover{color:#fff;text-decoration:underline}
.seba-app .footer-brand{display:flex;gap:12px;align-items:center;margin-bottom:12px}
.seba-app .footer-brand img,.seba-app .footer-brand svg{width:44px;height:44px;object-fit:contain}
.seba-app .footer-brand strong{color:#fff;display:block}
.seba-app .footer-bottom{border-top:1px solid rgba(255,255,255,.1);font-size:12.5px}
.seba-app .footer-bottom .container{display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;padding-top:16px;padding-bottom:16px}

/* Back to top */
.seba-app .to-top{position:fixed;left:20px;bottom:20px;width:44px;height:44px;border-radius:50%;border:1px solid var(--border);
  background:var(--surface);color:var(--navy-800);box-shadow:var(--shadow);display:grid;place-items:center;
  opacity:0;visibility:hidden;transition:.2s;z-index:40}
.seba-app .to-top.is-visible{opacity:1;visibility:visible}
.seba-app .to-top svg{width:20px;height:20px}
/* in .seba-app { ... } remove: margin:0; background:var(--bg); min-height:100vh; display:flex; flex-direction:column; */
/* and use: */
.seba-app{ /* keep all the --variables */ display:contents; font-family:var(--font);font-size:15px;line-height:1.55;color:var(--text); }

/* change main to: */
.seba-app main{background:var(--bg);padding:32px 0 56px}
/* Larger-text mode */
html.seba-text-lg .seba-app{font-size:17px}
/* ===== Footer animation: replays every time it scrolls into view ===== */
.seba-app .site-footer.js-anim .container > div,
.seba-app .site-footer.js-anim .footer-bottom{
  opacity:0;
  transform:translateY(14px);
  transition:opacity .6s cubic-bezier(.22,.61,.36,1), transform .6s cubic-bezier(.22,.61,.36,1);
}
.seba-app .site-footer.js-anim.is-in .container > div,
.seba-app .site-footer.js-anim.is-in .footer-bottom{
  opacity:1;
  transform:none;
}
/* small stagger */
.seba-app .site-footer.js-anim.is-in .container > div:nth-child(2){transition-delay:.1s}
.seba-app .site-footer.js-anim.is-in .container > div:nth-child(3){transition-delay:.2s}
.seba-app .site-footer.js-anim.is-in .footer-bottom{transition-delay:.3s}
/* Responsive */
@media (max-width:1024px){
  .seba-app .quick-grid{grid-template-columns:repeat(2,1fr)}
  .seba-app .home-grid{grid-template-columns:1fr}
  .seba-app .masthead .container{grid-template-columns:auto 1fr}
  .seba-app .portal-badge{grid-column:1 / -1;flex-direction:row;justify-content:center;justify-self:center;align-items:center;gap:12px}
  .seba-app .brand__text{display:none}
  .seba-app .title-block{text-align:left}
}
@media (max-width:860px){
  .seba-app .nav-toggle{display:inline-flex}
  .seba-app .nav-list{display:none;position:absolute;left:0;right:0;top:100%;flex-direction:column;align-items:stretch;
    background:var(--surface);border-bottom:1px solid var(--border);box-shadow:var(--shadow-lg);padding:8px 16px 16px;gap:2px}
  .seba-app .nav-list.is-open{display:flex}
  .seba-app .nav-link{width:100%;height:46px;justify-content:flex-start}
  .seba-app .nav-link .chev{margin-left:auto}
  .seba-app .dropdown{position:static;box-shadow:none;border:0;border-left:2px solid var(--border);border-radius:0;
    margin:2px 0 6px 18px;display:none;opacity:1;visibility:visible;transform:none;min-width:0}
  .seba-app .dropdown.is-open{display:block}
  .seba-app .hero{grid-template-columns:1fr}
  .seba-app .site-footer .container{grid-template-columns:1fr 1fr}
  .seba-app .site-footer .footer-about{grid-column:1 / -1}
}
@media (max-width:640px){
  .seba-app .container{padding:0 16px}
  .seba-app .gov-strip__tools{display:none}
  .seba-app .masthead .container{grid-template-columns:1fr;justify-items:center;gap:12px;padding-top:16px;padding-bottom:16px}
  .seba-app .masthead .brand{display:none}
  .seba-app .title-block{text-align:center}
  .seba-app .title-block__as{font-size:15px}
  .seba-app .portal-badge{flex-direction:column;gap:6px}
  .seba-app .news__label{padding:0 12px}
  .seba-app .news__label-text{display:none}
  .seba-app .news__viewport{padding:0 12px}
  .seba-app .news__count{display:none}
  .seba-app .news__controls{padding:0 4px}
  .seba-app .news__item{white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;font-size:13.5px;line-height:1.4;margin:7px 0;overflow:hidden}
  .seba-app .news__tag{display:none}
  .seba-app .hero__main,.seba-app .hero__aside{padding:22px}
  .seba-app .quick-grid{grid-template-columns:1fr}
  .seba-app .page-head h2{font-size:22px}
  .seba-app .toolbar .select{flex:1}
  .seba-app .site-footer .container{grid-template-columns:1fr}
  .seba-app .btn{flex:1}
}
@media (prefers-reduced-motion:reduce){
  .seba-app *,.seba-app *::before,.seba-app *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
}
`;

/* ===================================================================
   ICONS
=================================================================== */
function IconSprite() {
    const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
    const s24 = { viewBox: '0 0 24 24', ...s };
    return (
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
            <defs>
                <symbol id="i-home" {...s24}><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /></symbol>
                <symbol id="i-book" {...s24}><path d="M4 19.5V5a2 2 0 0 1 2-2h14v16H6.5A2.5 2.5 0 0 0 4 21.5 2.5 2.5 0 0 0 6.5 24" /><path d="M8 7h8M8 11h6" /></symbol>
                <symbol id="i-edit" {...s24}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4z" /></symbol>
                <symbol id="i-help" {...s24}><circle cx="12" cy="12" r="10" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></symbol>
                <symbol id="i-phone" {...s24}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></symbol>
                <symbol id="i-chev-down" {...s24} strokeWidth="2.4"><path d="m6 9 6 6 6-6" /></symbol>
                <symbol id="i-chev-left" {...s24} strokeWidth="2.4"><path d="m15 18-6-6 6-6" /></symbol>
                <symbol id="i-chev-right" {...s24} strokeWidth="2.4"><path d="m9 18 6-6-6-6" /></symbol>
                <symbol id="i-arrow" {...s24} strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></symbol>
                <symbol id="i-pause" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></symbol>
                <symbol id="i-play" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15a1 1 0 0 0 1.5.9l12-7.5a1 1 0 0 0 0-1.7l-12-7.5A1 1 0 0 0 7 4.5z" /></symbol>
                <symbol id="i-menu" {...s24}><path d="M4 6h16M4 12h16M4 18h16" /></symbol>
                <symbol id="i-close" {...s24}><path d="M18 6 6 18M6 6l12 12" /></symbol>
                <symbol id="i-search" {...s24}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></symbol>
                <symbol id="i-info" {...s24}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></symbol>
                <symbol id="i-warn" {...s24}><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></symbol>
                <symbol id="i-bell" {...s24}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></symbol>
                <symbol id="i-user-plus" {...s24}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" /></symbol>
                <symbol id="i-login" {...s24}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><path d="m10 17 5-5-5-5M15 12H3" /></symbol>
                <symbol id="i-shield" {...s24}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></symbol>
                <symbol id="i-up" {...s24} strokeWidth="2.4"><path d="m18 15-6-6-6 6" /></symbol>
                <symbol id="i-emblem" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="30" fill="#fff7e8" stroke="#d97706" strokeWidth="2" />
                    <circle cx="32" cy="32" r="23" fill="none" stroke="#13315c" strokeWidth="1.5" strokeDasharray="2 2.5" />
                    <path d="M32 14l4 9 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" fill="#13315c" />
                    <rect x="20" y="42" width="24" height="3" rx="1.5" fill="#15803d" />
                    <rect x="23" y="47" width="18" height="2.5" rx="1.25" fill="#13315c" />
                </symbol>
            </defs>
        </svg>
    );
}

function Icon({ name, className }) {
    return (
        <svg className={className} aria-hidden="true">
            <use href={`#${name}`} />
        </svg>
    );
}

function Emblem({ className }) {
    return EMBLEM_SRC ? (
        <img className={className} src={EMBLEM_SRC} alt="" />
    ) : (
        <svg className={className} aria-hidden="true"><use href="#i-emblem" /></svg>
    );
}

/* ===================================================================
   HOOKS
=================================================================== */
function useHashView() {
    const read = () => {
        const h = window.location.hash.slice(1);
        return VIEWS.includes(h) ? h : 'home';
    };
    const [view, setView] = useState(read);
    const first = useRef(true);

    useEffect(() => {
        const onHash = () => setView(read());
        window.addEventListener('hashchange', onHash);
        return () => window.removeEventListener('hashchange', onHash);
    }, []);

    useEffect(() => {
        document.title = `${VIEW_TITLES[view]} – SLRC Class III Posts`;
        if (first.current) { first.current = false; return; }
        const main = document.getElementById('main');
        if (main) main.focus({ preventScroll: true });
    }, [view]);

    return view;
}

const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===================================================================
   HEADER PIECES
=================================================================== */
function GovStrip({ large, setLarge }) {
    return (
        <div className="gov-strip">
            <div className="container">
                <div className="gov-strip__ids">
                    <div className="gov-strip__id"><span className="as" lang="as">অসম চৰকাৰ</span><span>Government of Assam</span></div>
                    <div className="gov-strip__id"><span className="as" lang="as">নিযুক্তি আয়োগ</span><span>Recruitment Commission</span></div>
                </div>
                <div className="gov-strip__tools" role="group" aria-label="Text size">
                    <button type="button" aria-pressed={!large} aria-label="Normal text size" onClick={() => setLarge(false)}>A</button>
                    <button type="button" aria-pressed={large} aria-label="Larger text size" onClick={() => setLarge(true)}>A+</button>
                </div>
            </div>
        </div>
    );
}

function Masthead() {
	
	
    return (
        <header className="masthead">
            <div className="container">
                <a className="brand" href="#home" aria-label="Government of Assam – Recruitment Commission, Class III Posts – Home">
                    <Emblem className="brand__emblem" />
                    <span className="brand__text">
                        <strong>Government of Assam</strong>
                        <span>Recruitment Commission</span>
                        <span>Class III Posts</span>
                    </span>
                </a>

                <div className="title-block">
                    <p className="title-block__as as" lang="as">ৰাজ্যিক স্তৰৰ নিযুক্তি আয়োগ</p>
                    <h1>State Level Recruitment Commission for Class III Posts</h1>
                    <p>Online Application Form for Recruitment of Class III Posts under Government of Assam</p>
                </div>

                <div className="portal-badge">
                    <span className="portal-badge__title">Official Recruitment Portal</span>
                    <span className="portal-badge__chip"><Icon name="i-shield" />Apply online only</span>
                </div>
            </div>
            <div className="tricolour" aria-hidden="true"><span /><span /><span /></div>
        </header>
    );
}

function PrimaryNav({ view, navOpen, setNavOpen, applyOpen, setApplyOpen, applyBtnRef, applyMenuRef }) {
    const closeAll = (returnFocus) => {
        setApplyOpen(false);
        if (returnFocus && applyBtnRef.current) applyBtnRef.current.focus();
    };

    const menuLinks = () => Array.from(applyMenuRef.current ? applyMenuRef.current.querySelectorAll('a') : []);

    const onBtnKey = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setApplyOpen(true);
            setTimeout(() => { const l = menuLinks(); if (l[0]) l[0].focus(); }, 0);
        }
    };

    const onMenuKey = (e) => {
        const links = menuLinks();
        const i = links.indexOf(document.activeElement);
        if (e.key === 'ArrowDown') { e.preventDefault(); links[(i + 1) % links.length].focus(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); links[(i - 1 + links.length) % links.length].focus(); }
        else if (e.key === 'Escape') { closeAll(true); }
    };

    const onMenuBlur = (e) => {
        const next = e.relatedTarget;
        if (!applyMenuRef.current.contains(next) && next !== applyBtnRef.current) setApplyOpen(false);
    };

    return (
        <nav className="site-nav" aria-label="Primary">
            <div className="container">
                <button
                    className="nav-toggle"
                    type="button"
                    aria-expanded={navOpen}
                    aria-controls="navList"
                    onClick={() => setNavOpen((o) => !o)}
                >
                    <Icon name={navOpen ? 'i-close' : 'i-menu'} /><span>Menu</span>
                </button>

                <ul className={`nav-list ${navOpen ? 'is-open' : ''}`} id="navList">
                    {NAV_ITEMS.map((item) => (
                        <li className="nav-item" key={item.label}>
                            {item.children ? (
                                <>
                                    <button
                                        ref={applyBtnRef}
                                        className="nav-link"
                                        type="button"
                                        aria-haspopup="true"
                                        aria-expanded={applyOpen}
                                        aria-controls="applyMenu"
                                        onClick={(e) => { e.stopPropagation(); setApplyOpen((o) => !o); }}
                                        onKeyDown={onBtnKey}
                                    >
                                        <Icon name={item.icon} />{item.label}<Icon name="i-chev-down" className="chev" />
                                    </button>
                                    <ul
                                        ref={applyMenuRef}
                                        className={`dropdown ${applyOpen ? 'is-open' : ''}`}
                                        id="applyMenu"
                                        aria-label="Apply Online options"
                                        onKeyDown={onMenuKey}
                                        onBlur={onMenuBlur}
                                    >
                                        {item.children.map((c) => (
                                            <li key={c.label}>
                                                <a href={c.href} tabIndex={applyOpen ? 0 : -1}>
                                                    <Icon name={c.icon} />
                                                    <span><strong>{c.label}</strong><small>{c.hint}</small></span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ) : (
                                <a
                                    className="nav-link"
                                    href={`#${item.view}`}
                                    aria-current={view === item.view ? 'page' : undefined}
                                    onClick={() => setNavOpen(false)}
                                >
                                    <Icon name={item.icon} />{item.label}
                                </a>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}

function NewsTicker() {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(prefersReducedMotion);
    const pausedRef = useRef(paused);
    const hoverRef = useRef(false);
    const elapsed = useRef(0);
    const barRef = useRef(null);

    useEffect(() => { pausedRef.current = paused; }, [paused]);

    useEffect(() => {
        let raf;
        let last = null;
        const loop = (ts) => {
            if (last !== null && !pausedRef.current && !hoverRef.current) {
                elapsed.current += ts - last;
                if (elapsed.current >= TICKER_MS) {
                    elapsed.current = 0;
                    setIndex((i) => (i + 1) % NEWS.length);
                }
            }
            last = ts;
            if (barRef.current) barRef.current.style.width = `${Math.min(100, (elapsed.current / TICKER_MS) * 100)}%`;
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, []);

    const go = (step) => {
        elapsed.current = 0;
        setIndex((i) => (i + step + NEWS.length) % NEWS.length);
    };

    const n = NEWS[index];

    return (
        <section
            className="news"
            aria-label="Latest news"
            onMouseEnter={() => { hoverRef.current = true; }}
            onMouseLeave={() => { hoverRef.current = false; }}
            onFocus={() => { hoverRef.current = true; }}
            onBlur={() => { hoverRef.current = false; }}
        >
            <div className="container">
                <div className="news__label">
                    <span className="news__dot" aria-hidden="true" />
                    <span className="news__label-text">Latest News</span>
                    <span className="visually-hidden">Latest news</span>
                </div>

                <div className="news__viewport">
                    <p className="news__item" key={index} aria-live="polite">
                        <span className="news__tag">{n.isNew ? 'NEW' : n.type.toUpperCase()}</span>
                        <a href="#home">{n.text}</a>
                    </p>
                </div>

                <div className="news__controls">
                    <span className="news__count">{index + 1} / {NEWS.length}</span>
                    <button className="icon-btn" type="button" aria-label="Previous news item" onClick={() => go(-1)}>
                        <Icon name="i-chev-left" />
                    </button>
                    <button
                        className="icon-btn"
                        type="button"
                        aria-pressed={paused}
                        aria-label={paused ? 'Play news ticker' : 'Pause news ticker'}
                        onClick={() => setPaused((p) => !p)}
                    >
                        <Icon name={paused ? 'i-play' : 'i-pause'} />
                    </button>
                    <button className="icon-btn" type="button" aria-label="Next news item" onClick={() => go(1)}>
                        <Icon name="i-chev-right" />
                    </button>
                </div>
            </div>
            <div className="news__progress" ref={barRef} aria-hidden="true" />
        </section>
    );
}

/* ===================================================================
   VIEWS
=================================================================== */
function Breadcrumb({ current }) {
    return (
        <ol className="breadcrumb">
            <li><a href="#home">Home</a></li>
            <li aria-current="page">{current}</li>
        </ol>
    );
}

function EmptyCard({ icon, title, text }) {
    return (
        <div className="card">
            <div className="empty">
                <div className="empty__icon"><Icon name={icon} /></div>
                <h4>{title}</h4>
                <p>{text}</p>
            </div>
        </div>
    );
}

/*function HomeView({ onApply }) {
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState('all');

    const items = useMemo(() => {
        const q = query.trim().toLowerCase();
        return NEWS.filter((n) => (filter === 'all' || n.type === filter) && (!q || n.text.toLowerCase().includes(q)));
    }, [query, filter]);

    return (
        <section aria-labelledby="homeHeading">
            <div className="card hero">
                <div className="hero__main">
                    <span className="status-pill">Applications open</span>
                    <h2 id="homeHeading">Online applications are open for Class III posts under Government of Assam</h2>
                    <p>Use this official portal to apply for recruitment to Class III posts. Read the instructions carefully before you begin your application.</p>
                    <div className="hero__actions">
                        <button type="button" className="btn btn--accent" onClick={onApply}>
                            <Icon name="i-edit" />Apply Online
                        </button>
                        <a className="btn btn--secondary" href="#instructions"><Icon name="i-book" />Read Instructions</a>
                    </div>
                </div>
                <aside className="hero__aside" aria-label="How to use this portal">
                    <h3>How to use this portal</h3>
                    <ol>
                        <li>Read the Instructions</li>
                        <li>Apply Online</li>
                        <li>Check FAQ or Contact Us for help</li>
                    </ol>
                </aside>
            </div>

            <div className="section-title"><h3>Quick links</h3></div>
            <div className="quick-grid">
                <a className="card quick-card" href="#instructions">
                    <span className="quick-card__icon"><Icon name="i-book" /></span>
                    <strong>Instructions</strong><span>Guidelines for filling in the online application form.</span>
                    <em>View <Icon name="i-arrow" /></em>
                </a>
                <a className="card quick-card quick-card--accent" href="#apply" onClick={onApply}>
                    <span className="quick-card__icon"><Icon name="i-edit" /></span>
                    <strong>Apply Online</strong><span>Start or continue your application for Class III posts.</span>
                    <em>Open <Icon name="i-arrow" /></em>
                </a>
                <a className="card quick-card" href="#faq">
                    <span className="quick-card__icon"><Icon name="i-help" /></span>
                    <strong>FAQ</strong><span>Answers to frequently asked questions.</span>
                    <em>View <Icon name="i-arrow" /></em>
                </a>
                <a className="card quick-card" href="#contact">
                    <span className="quick-card__icon"><Icon name="i-phone" /></span>
                    <strong>Contact Us</strong><span>Get in touch with the helpdesk.</span>
                    <em>View <Icon name="i-arrow" /></em>
                </a>
            </div>

            <div className="home-grid">
                <div className="card">
                    <div className="card__head">
                        <h3><Icon name="i-bell" />Latest News &amp; Notices</h3>
                    </div>
                    <div className="toolbar">
                        <label className="search">
                            <span className="visually-hidden">Search news</span>
                            <Icon name="i-search" />
                            <input
                                className="input"
                                type="search"
                                placeholder="Search news…"
                                autoComplete="off"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </label>
                        <label>
                            <span className="visually-hidden">Filter by type</span>
                            <select className="select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                                <option value="all">All types</option>
                                <option value="Notice">Notices</option>
                                <option value="Update">Updates</option>
                            </select>
                        </label>
                    </div>
                    <ul className="notice-list" aria-live="polite">
                        {items.length === 0 ? (
                            <li className="empty">
                                <div className="empty__icon"><Icon name="i-search" /></div>
                                <h4>No matching news</h4>
                                <p>Try a different search term or choose “All types”.</p>
                            </li>
                        ) : (
                            items.map((n) => {
                                const d = new Date(`${n.date}T00:00:00`);
                                return (
                                    <li className="notice" key={n.text}>
                                        <div className="notice__date" aria-hidden="true">
                                            <span>{MONTHS[d.getMonth()]}</span><b>{d.getDate()}</b>
                                        </div>
                                        <div className="notice__body">
                                            <a href="#home">{n.text}</a>
                                            <div className="notice__meta">
                                                <time dateTime={n.date}>{d.getDate()} {MONTHS[d.getMonth()]} {d.getFullYear()}</time>
                                                <span className="badge badge--info">{n.type}</span>
                                                {n.isNew && <span className="badge badge--new">New</span>}
                                            </div>
                                        </div>
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>

                <div className="stack">
                    <div className="alert alert--warn" role="note">
                        <Icon name="i-warn" />
                        <div><strong>Apply online only</strong>Applications are accepted only through this official portal.</div>
                    </div>
                    <div className="card">
                        <div className="card__head"><h3><Icon name="i-help" />Need help?</h3></div>
                        <div className="card__body" style={{ padding: 8 }}>
                            <ul className="help-list">
                                <li><a href="#instructions"><Icon name="i-book" />Instructions<Icon name="i-chev-right" /></a></li>
                                <li><a href="#faq"><Icon name="i-help" />Frequently Asked Questions<Icon name="i-chev-right" /></a></li>
                                <li><a href="#contact"><Icon name="i-phone" />Contact Us<Icon name="i-chev-right" /></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function InstructionsView() {
    return (
        <section aria-labelledby="instrHeading">
            <div className="page-head">
                <Breadcrumb current="Instructions" />
                <h2 id="instrHeading">Instructions</h2>
                <p>Guidelines for completing the Online Application Form for Class III posts.</p>
            </div>
            <EmptyCard
                icon="i-book"
                title="Instructions will appear here"
                text="Insert the commission's published instructions in this section."
            />
        </section>
    );
}

function FaqView() {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(() => new Set());

    const q = query.trim().toLowerCase();
    const visible = FAQS.map((f, i) => ({ ...f, i })).filter((f) => !q || `${f.q} ${f.a}`.toLowerCase().includes(q));
    const allOpen = FAQS.every((_, i) => open.has(i));

    const toggle = (i) => setOpen((prev) => {
        const next = new Set(prev);
        next.has(i) ? next.delete(i) : next.add(i);
        return next;
    });

    return (
        <section aria-labelledby="faqHeading">
            <div className="page-head">
                <Breadcrumb current="FAQ" />
                <h2 id="faqHeading">Frequently Asked Questions</h2>
                <p>Search or browse common questions about the online application.</p>
            </div>
            <div className="card">
                <div className="toolbar">
                    <label className="search">
                        <span className="visually-hidden">Search FAQs</span>
                        <Icon name="i-search" />
                        <input
                            className="input"
                            type="search"
                            placeholder="Search questions…"
                            autoComplete="off"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </label>
                    <button
                        type="button"
                        className="btn btn--secondary btn--sm"
                        onClick={() => setOpen(allOpen ? new Set() : new Set(FAQS.map((_, i) => i)))}
                    >
                        {allOpen ? 'Collapse all' : 'Expand all'}
                    </button>
                </div>
                <ul className="accordion">
                    {visible.map((f) => {
                        const isOpen = open.has(f.i);
                        return (
                            <li className="acc-item" key={f.q}>
                                <h3>
                                    <button
                                        className="acc-btn"
                                        type="button"
                                        id={`faq-b${f.i}`}
                                        aria-expanded={isOpen}
                                        aria-controls={`faq-p${f.i}`}
                                        onClick={() => toggle(f.i)}
                                    >
                                        <span>{f.q}</span><Icon name="i-chev-down" />
                                    </button>
                                </h3>
                                <div className="acc-panel" id={`faq-p${f.i}`} role="region" aria-labelledby={`faq-b${f.i}`} hidden={!isOpen}>
                                    <p>{f.a}</p>
                                </div>
                            </li>
                        );
                    })}
                    {visible.length === 0 && (
                        <li className="empty">
                            <div className="empty__icon"><Icon name="i-search" /></div>
                            <h4>No questions found</h4>
                            <p>Try another keyword, or visit Contact Us for help.</p>
                        </li>
                    )}
                </ul>
            </div>
        </section>
    );
}

function ContactView() {
    return (
        <section aria-labelledby="contactHeading">
            <div className="page-head">
                <Breadcrumb current="Contact Us" />
                <h2 id="contactHeading">Contact Us</h2>
                <p>Helpdesk details for applicants.</p>
            </div>
            <EmptyCard
                icon="i-phone"
                title="Contact details will appear here"
                text="Insert the official helpdesk phone numbers, email and office address in this section."
            />
        </section>
    );
}
*/
/* ===================================================================
   FOOTER + BACK TO TOP
=================================================================== */
function Footer({ onApply }) {
	
	// footer: animate in every time it scrolls into view
	useEffect(() => {
	    const footer = document.querySelector('.seba-app .site-footer');
	    if (!footer || !('IntersectionObserver' in window)) return;
	    footer.classList.add('js-anim');
	    const io = new IntersectionObserver(
	        ([entry]) => footer.classList.toggle('is-in', entry.isIntersecting),
	        { threshold: 0.15 }
	    );
	    io.observe(footer);
	    return () => { io.disconnect(); footer.classList.remove('js-anim', 'is-in'); };
	}, []);
    return (
        <footer className="site-footer">
            <div className="container">
                <div className="footer-about">
                    <div className="footer-brand">
                        <Emblem />
                        <div>
                            <strong>State Level Recruitment Commission for Class III Posts</strong>
                            <span className="as" lang="as">ৰাজ্যিক স্তৰৰ নিযুক্তি আয়োগ</span>
                        </div>
                    </div>
                    <p>Official Recruitment Portal · Government of Assam</p>
                    <p>Online Application Form for Recruitment of Class III Posts.</p>
                </div>
                <div>
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#instructions">Instructions</a></li>
                        <li><a href="#apply" onClick={onApply}>Apply Online</a></li>
                        <li><a href="#faq">FAQ</a></li>
                        <li><a href="#contact">Contact Us</a></li>
                    </ul>
                </div>
                <div>
                    <h4>Important</h4>
                    <p>Applications are accepted online only through this portal.</p>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container">
                    <span>© {new Date().getFullYear()} Government of Assam · Recruitment Commission</span>
                </div>
            </div>
        </footer>
    );
}

function BackToTop() {
    const [show, setShow] = useState(false);
    useEffect(() => {
        const onScroll = () => setShow(window.pageYOffset > 400);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    return (
        <button
            className={`to-top ${show ? 'is-visible' : ''}`}
            type="button"
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })}
        >
            <Icon name="i-up" />
        </button>
    );
}

/* ===================================================================
   APP
=================================================================== */
export default function SebaPortal() {
    const view = useHashView();
    const [navOpen, setNavOpen] = useState(false);
    const [applyOpen, setApplyOpen] = useState(false);
    const [large, setLarge] = useState(() => {
        try { return localStorage.getItem('seba-text-lg') === '1'; } catch (e) { return false; }
    });
    const applyBtnRef = useRef(null);
    const applyMenuRef = useRef(null);

    // text size
    useEffect(() => {
        document.documentElement.classList.toggle('seba-text-lg', large);
        try { localStorage.setItem('seba-text-lg', large ? '1' : '0'); } catch (e) { /* ignore */ }
        return () => document.documentElement.classList.remove('seba-text-lg');
    }, [large]);

    // close menus when the view changes
    useEffect(() => { setNavOpen(false); setApplyOpen(false); }, [view]);

    // outside click + Escape
    useEffect(() => {
        const onClick = (e) => {
            const inMenu = applyMenuRef.current && applyMenuRef.current.contains(e.target);
            const onBtn = applyBtnRef.current && applyBtnRef.current.contains(e.target);
            if (!inMenu && !onBtn) setApplyOpen(false);
        };
        const onKey = (e) => { if (e.key === 'Escape') { setApplyOpen(false); setNavOpen(false); } };
        document.addEventListener('click', onClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('click', onClick);
            document.removeEventListener('keydown', onKey);
        };
    }, []);

    // "Apply Online" buttons elsewhere on the page open the nav dropdown
    const openApply = useCallback((e) => {
        if (e && e.preventDefault) { e.preventDefault(); e.stopPropagation(); }
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
        if (window.innerWidth <= 860) setNavOpen(true);
        setTimeout(() => {
            setApplyOpen(true);
            setTimeout(() => {
                const first = applyMenuRef.current && applyMenuRef.current.querySelector('a');
                if (first) first.focus();
            }, 0);
        }, prefersReducedMotion() ? 0 : 250);
    }, []);

    return (
        <div className="seba-app">
            <style>{CSS}</style>
            <IconSprite />
            <a className="skip-link" href="#main">Skip to main content</a>

            {/*<GovStrip large={large} setLarge={setLarge} />
            <Masthead />
            <PrimaryNav
                view={view}
                navOpen={navOpen}
                setNavOpen={setNavOpen}
                applyOpen={applyOpen}
                setApplyOpen={setApplyOpen}
                applyBtnRef={applyBtnRef}
                applyMenuRef={applyMenuRef}
            />
            <NewsTicker />*/}

            {/*<main id="main" tabIndex={-1}>
                <div className="container">
                    {view === 'home' && <HomeView onApply={openApply} />}
                    {view === 'instructions' && <InstructionsView />}
                    {view === 'faq' && <FaqView />}
                    {view === 'contact' && <ContactView />}
                </div>
            </main>*/}

            <Footer onApply={openApply} /> 
            
        </div>
    );
}