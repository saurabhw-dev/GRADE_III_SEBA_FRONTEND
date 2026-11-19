import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Header from './HeaderFooter/Header';
import Footer from './HeaderFooter/Footer';

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

/* Government strip */
.seba-app .gov-strip{background:var(--navy-900);color:#dbe4f0;font-size:12px}
.seba-app .gov-strip .container{display:flex;align-items:center;justify-content:space-between;min-height:38px;gap:16px}
.seba-app .gov-strip__ids{display:flex;align-items:center}
.seba-app .gov-strip__id{display:flex;flex-direction:column;line-height:1.2;padding:4px 16px 4px 0}
.seba-app .gov-strip__id + .gov-strip__id{padding-left:16px;border-left:1px solid rgba(255,255,255,.18)}
.seba-app .gov-strip__id .as{font-size:13px;font-weight:600;color:#fff}
.seba-app .gov-strip__id span:last-child{font-size:10.5px;letter-spacing:.06em;text-transform:uppercase}
.seba-app .gov-strip__tools{display:flex;align-items:center;gap:6px}
.seba-app .gov-strip__tools button{background:transparent;border:1px solid rgba(255,255,255,.22);color:#e7edf5;
  border-radius:5px;font-size:12px;padding:3px 8px;min-width:30px}
.seba-app .gov-strip__tools button:hover{background:rgba(255,255,255,.1)}
.seba-app .gov-strip__tools button[aria-pressed="true"]{background:#fff;color:var(--navy-900)}


/* Main + shared */
.seba-app main{flex:1;padding:32px 0 56px}
.seba-app .page-head{margin-bottom:24px}
.seba-app .breadcrumb{display:flex;gap:6px;font-size:13px;color:var(--text-3);margin:0 0 8px;padding:0;list-style:none}
.seba-app .breadcrumb li+li::before{content:"/";margin-right:6px;color:var(--border-strong)}
.seba-app .breadcrumb a{color:var(--text-3);text-decoration:none}
.seba-app .breadcrumb a:hover{color:var(--navy-700);text-decoration:underline}
.seba-app .page-head h2{margin:0;font-size:26px;color:var(--navy-900);letter-spacing:-.01em}
.seba-app .page-head p{margin:6px 0 0;color:var(--text-2)}
.seba-app .card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm)}
.seba-app .card__head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px;border-bottom:1px solid var(--border)}
.seba-app .card__head h3{margin:0;font-size:16px;color:var(--navy-900);display:flex;align-items:center;gap:8px}
.seba-app .card__head h3 svg{width:18px;height:18px;color:var(--navy-700)}
.seba-app .card__body{padding:20px}



/* ---------- Instructions page ---------- */

.seba-app .instr-alert {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 12px 14px;
    margin-bottom: 14px;
    background: var(--red-50);
    border: 1px solid #fecdca;
    border-left: 5px solid var(--red-600);
    border-radius: var(--radius-lg);
}

.seba-app .instr-alert__icon {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: var(--red-600);
    color: #fff;
}

.seba-app .instr-alert__icon svg {
    width: 17px;
    height: 17px;
}

.seba-app .instr-alert h3 {
    margin: 0 0 4px;
    font-size: 15.5px;
    color: var(--red-600);
}

.seba-app .instr-alert p {
    margin: 0;
    color: #7a1a12;
    font-size: 14.5px;
    line-height: 1.65;
}

.seba-app .facts {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 16px;
}

.seba-app .fact {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    padding: 10px 12px;
}

.seba-app .fact__icon {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: var(--radius);
    display: grid;
    place-items: center;
    background: var(--navy-50);
    color: var(--navy-800);
}

.seba-app .fact__icon svg {
    width: 19px;
    height: 19px;
}

.seba-app .fact small {
    display: block;
    font-size: 11.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .06em;
    color: var(--text-3);
}

.seba-app .fact strong {
    display: block;
    font-size: 15px;
    color: var(--navy-900);
    line-height: 1.35;
    margin-top: 2px;
}

.seba-app .fact span {
    display: block;
    font-size: 12.5px;
    color: var(--text-2);
    margin-top: 2px;
}

.seba-app .fact a {
    color: inherit;
    text-decoration: none;
}

.seba-app .fact a:hover {
    text-decoration: underline;
}

.seba-app .instr-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 280px;
    gap: 16px;
    align-items: start;
}

.seba-app .instr-group {
    margin-bottom: 12px;
    overflow: hidden;
}

.seba-app .instr-group:last-child {
    margin-bottom: 0;
}

.seba-app .instr-group__head {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 14px;
    background: var(--surface-2);
    border-bottom: 1px solid var(--border);
}

.seba-app .instr-group__head svg {
    width: 18px;
    height: 18px;
    color: var(--navy-700);
}

.seba-app .instr-group__head h3 {
    margin: 0;
    font-size: 15.5px;
    color: var(--navy-900);
}

.seba-app .instr-group__head span {
    margin-left: auto;
    font-size: 12.5px;
    color: var(--text-3);
    font-weight: 600;
}

.seba-app .steps {
    list-style: none;
    margin: 0;
    padding: 2px 0;
}

.seba-app .step {
    display: flex;
    gap: 12px;
    padding: 9px 14px;
    color: var(--text);
    font-size: 14.5px;
    line-height: 1.6;
}

.seba-app .step + .step {
    border-top: 1px dashed var(--border);
}

.seba-app .step__num {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    margin-top: 1px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-weight: 700;
    font-size: 13px;
    background: var(--navy-50);
    color: var(--navy-800);
    font-variant-numeric: tabular-nums;
}

.seba-app .step p {
    margin: 0;
    min-width: 0;
}

.seba-app .step a {
    color: var(--navy-700);
    font-weight: 600;
    word-break: break-word;
}

.seba-app .step--warn {
    background: var(--saffron-50);
}

.seba-app .step--warn .step__num {
    background: var(--saffron-500);
    color: #1a1200;
}

.seba-app .step--key .step__num {
    background: var(--red-600);
    color: #fff;
}

.seba-app .step mark {
    background: transparent;
    color: var(--red-600);
    font-weight: 700;
}

.seba-app .instr-aside {
    position: sticky;
    top: calc(var(--nav-h) + 16px);
    display: grid;
    gap: 12px;
}

.seba-app .cta-card {
    padding: 16px;
    background: linear-gradient(160deg, var(--navy-800), var(--navy-900));
    color: #dfe7f3;
    border: 0;
}

.seba-app .cta-card h3 {
    margin: 0 0 6px;
    color: #fff;
    font-size: 17px;
}

.seba-app .cta-card p {
    margin: 0 0 16px;
    font-size: 13.5px;
}

.seba-app .cta-card .btn {
    width: 100%;
}

.seba-app .checklist {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 7px;
    font-size: 13.5px;
    color: var(--text-2);
}

.seba-app .instr-aside .card__head {
    padding: 10px 14px;
}

.seba-app .instr-aside .card__body {
    padding: 12px 14px;
}

.seba-app .checklist li {
    display: flex;
    gap: 10px;
    align-items: flex-start;
}

.seba-app .checklist svg {
    width: 16px;
    height: 16px;
    color: var(--green-600);
    flex-shrink: 0;
    margin-top: 3px;
}

@media (max-width: 1024px) {
    .seba-app .facts {
        grid-template-columns: repeat(2, 1fr);
    }

    .seba-app .instr-layout {
        grid-template-columns: 1fr;
    }

    .seba-app .instr-aside {
        position: static;
    }
}

@media (max-width: 640px) {
    .seba-app .facts {
        grid-template-columns: 1fr;
    }

    .seba-app .step {
        padding: 8px 12px;
        gap: 10px;
    }

    .seba-app .instr-group__head {
        padding: 8px 12px;
    }

    .seba-app .instr-alert {
        padding: 12px;
        gap: 10px;
    }
}


/* ---------- Contact Us page ---------- */

.seba-app .contact-hero {
    position: relative;
    overflow: hidden;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 24px;
    align-items: center;
    padding: 28px 32px;
    margin-bottom: 20px;
    border: 0;
    color: #dfe7f3;
    background:
        radial-gradient(circle at 100% 0, rgba(245,158,11,.22), transparent 45%),
        linear-gradient(135deg, var(--navy-800), var(--navy-900));
}

.seba-app .contact-hero::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 4px;
    background: linear-gradient(
        90deg,
        var(--saffron-500) 0 33.3%,
        #fff 33.3% 66.6%,
        var(--green-600) 66.6%
    );
}

.seba-app .contact-hero__eyebrow {
    display: inline-block;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--saffron-500);
    margin-bottom: 6px;
}

.seba-app .contact-hero h3 {
    margin: 0 0 6px;
    font-size: clamp(20px, 2.4vw, 26px);
    color: #fff;
    letter-spacing: -.01em;
}

.seba-app .contact-hero p {
    margin: 0;
    font-size: 14.5px;
    max-width: 52ch;
}

.seba-app .hours {
    background: rgba(255,255,255,.08);
    border: 1px solid rgba(255,255,255,.16);
    border-radius: var(--radius-lg);
    padding: 16px 18px;
    min-width: 280px;
}

.seba-app .hours__title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12.5px;
    font-weight: 700;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: #c3d1e4;
}

.seba-app .hours__title svg {
    width: 16px;
    height: 16px;
    color: var(--saffron-500);
}

.seba-app .hours__time {
    display: block;
    margin: 6px 0 12px;
    font-size: 22px;
    font-weight: 800;
    color: #fff;
    font-variant-numeric: tabular-nums;
}

.seba-app .hours__days {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    gap: 6px;
}

.seba-app .hours__days li {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 12px;
    font-weight: 700;
    background: var(--saffron-500);
    color: #1a1200;
}

.seba-app .hours__days li.is-off {
    background: transparent;
    color: #8fa3bf;
    border: 1px dashed rgba(255,255,255,.3);
}

/* Contact cards */

.seba-app .contact-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
    margin-bottom: 20px;
}

.seba-app .contact-card {
    position: relative;
    overflow: hidden;
    padding: 24px;
    transition: border-color .15s, box-shadow .15s, transform .15s;
}

.seba-app .contact-card::before {
    content: "";
    position: absolute;
    inset: 0 0 auto 0;
    height: 4px;
    background: var(--accent, var(--navy-700));
}

.seba-app .contact-card:hover {
    box-shadow: var(--shadow);
    transform: translateY(-2px);
}

.seba-app .contact-card--phone {
    --accent: var(--saffron-500);
    --accent-bg: var(--saffron-50);
    --accent-fg: var(--saffron-600);
}

.seba-app .contact-card--mail {
    --accent: var(--green-600);
    --accent-bg: var(--green-50);
    --accent-fg: var(--green-600);
}

.seba-app .contact-card__top {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 18px;
}

.seba-app .contact-card__icon {
    flex-shrink: 0;
    width: 52px;
    height: 52px;
    border-radius: 14px;
    display: grid;
    place-items: center;
    background: var(--accent-bg);
    color: var(--accent-fg);
}

.seba-app .contact-card__icon svg {
    width: 26px;
    height: 26px;
}

.seba-app .contact-card small {
    display: block;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--text-3);
}

.seba-app .contact-card h3 {
    margin: 2px 0 0;
    font-size: 18px;
    color: var(--navy-900);
}

.seba-app .contact-lines {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 10px;
}

.seba-app .contact-line {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    border-radius: var(--radius);
    background: var(--surface-2);
    border: 1px solid var(--border);
    color: var(--navy-900);
    text-decoration: none;
    font-size: 19px;
    font-weight: 700;
    letter-spacing: .02em;
    font-variant-numeric: tabular-nums;
    word-break: break-all;
    transition: border-color .15s, background .15s;
}

.seba-app .contact-line svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    color: var(--accent-fg);
}

.seba-app a.contact-line:hover {
    border-color: var(--accent);
    background: var(--accent-bg);
}

.seba-app .contact-line--pending {
    color: var(--text-3);
}

/* Contact note */

.seba-app .contact-note {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 14px 18px;
    border-radius: var(--radius);
    background: var(--navy-50);
    border: 1px solid #c6d5ea;
    color: var(--navy-900);
    font-size: 14px;
}

.seba-app .contact-note svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    color: var(--navy-700);
    margin-top: 1px;
}

@media (max-width: 860px) {
    .seba-app .contact-hero {
        grid-template-columns: 1fr;
        padding: 24px;
    }

    .seba-app .hours {
        min-width: 0;
    }

    .seba-app .contact-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 640px) {
    .seba-app .contact-hero {
        padding: 20px;
    }

    .seba-app .hours__days {
        gap: 4px;
    }

    .seba-app .hours__days li {
        width: 30px;
        height: 30px;
        font-size: 11px;
    }

    .seba-app .contact-card {
        padding: 18px;
    }

    .seba-app .contact-line {
        font-size: 17px;
    }
}


/* Hero */
.seba-app .hero{display:grid;grid-template-columns:1.4fr 1fr;overflow:hidden;margin-bottom:28px}
.seba-app .hero__main{padding:32px}
.seba-app .status-pill{display:inline-flex;align-items:center;gap:8px;font-size:12.5px;font-weight:700;color:var(--green-600);
  background:var(--green-50);border:1px solid #b7e4c7;border-radius:999px;padding:4px 12px;margin-bottom:14px}
.seba-app .status-pill::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--green-600)}
.seba-app .hero h2{margin:0 0 10px;font-size:clamp(22px,2.6vw,30px);line-height:1.25;color:var(--navy-900);letter-spacing:-.015em}
.seba-app .hero p{margin:0 0 22px;color:var(--text-2);max-width:56ch}
.seba-app .hero__actions{display:flex;flex-wrap:wrap;gap:12px}
.seba-app .hero__aside{background:linear-gradient(160deg,var(--navy-800),var(--navy-900));color:#e4ebf5;padding:32px;
  display:flex;flex-direction:column;justify-content:center;gap:16px}
.seba-app .hero__aside h3{margin:0;color:#fff;font-size:15px;text-transform:uppercase;letter-spacing:.08em}
.seba-app .hero__aside ol{margin:0;padding:0;list-style:none;display:grid;gap:12px;counter-reset:step}
.seba-app .hero__aside li{display:flex;gap:12px;align-items:flex-start;font-size:14px;counter-increment:step}
.seba-app .hero__aside li::before{content:counter(step);flex-shrink:0;width:26px;height:26px;border-radius:50%;
  display:grid;place-items:center;font-weight:700;font-size:13px;background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.25)}

/* Quick links */
.seba-app .section-title{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin:0 0 14px}
.seba-app .section-title h3{margin:0;font-size:18px;color:var(--navy-900)}
.seba-app .quick-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px}
.seba-app .quick-card{display:flex;flex-direction:column;gap:10px;padding:20px;text-decoration:none;color:inherit;
  transition:border-color .15s,box-shadow .15s,transform .15s}
.seba-app .quick-card:hover{border-color:var(--navy-700);box-shadow:var(--shadow);transform:translateY(-2px)}
.seba-app .quick-card__icon{width:44px;height:44px;border-radius:var(--radius);display:grid;place-items:center;background:var(--navy-50);color:var(--navy-800)}
.seba-app .quick-card__icon svg{width:22px;height:22px}
.seba-app .quick-card--accent .quick-card__icon{background:var(--saffron-50);color:var(--saffron-600)}
.seba-app .quick-card strong{font-size:15.5px;color:var(--navy-900)}
.seba-app .quick-card span{font-size:13.5px;color:var(--text-2)}
.seba-app .quick-card em{margin-top:auto;font-style:normal;font-size:13.5px;font-weight:600;color:var(--navy-700);display:inline-flex;align-items:center;gap:4px}
.seba-app .quick-card em svg{width:14px;height:14px;transition:transform .15s}
.seba-app .quick-card:hover em svg{transform:translateX(3px)}
.seba-app .quick-card__icon{flex-shrink:0}

/* Notices */
.seba-app .home-grid{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:20px;align-items:start}
.seba-app .toolbar{display:flex;gap:10px;flex-wrap:wrap;padding:14px 20px;border-bottom:1px solid var(--border);background:var(--surface-2)}
.seba-app .search{position:relative;flex:1;min-width:180px}
.seba-app .search svg{position:absolute;left:12px;top:50%;transform:translateY(-50%);width:16px;height:16px;color:var(--text-3)}
.seba-app .input,.seba-app .select{width:100%;height:40px;border:1px solid var(--border-strong);border-radius:var(--radius-sm);
  background:var(--surface);color:var(--text);font:inherit;font-size:14px;padding:0 12px}
.seba-app .search .input{padding-left:36px}
.seba-app .select{width:auto;min-width:150px;padding-right:32px;appearance:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23475467'%3E%3Cpath d='M5.3 7.3a1 1 0 011.4 0L10 10.6l3.3-3.3a1 1 0 111.4 1.4l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 010-1.4z'/%3E%3C/svg%3E");
  background-repeat:no-repeat;background-position:right 10px center;background-size:16px}
.seba-app .input:focus,.seba-app .select:focus{outline:none;border-color:var(--navy-700);box-shadow:0 0 0 3px rgba(29,67,120,.18)}
.seba-app .notice-list{list-style:none;margin:0;padding:0}
.seba-app .notice{display:flex;gap:14px;padding:14px 20px;border-bottom:1px solid var(--border);align-items:flex-start}
.seba-app .notice:last-child{border-bottom:0}
.seba-app .notice__date{flex-shrink:0;width:52px;text-align:center;border:1px solid var(--border);border-radius:var(--radius-sm);overflow:hidden;font-variant-numeric:tabular-nums}
.seba-app .notice__date b{display:block;font-size:18px;line-height:1.6;color:var(--navy-900)}
.seba-app .notice__date span{display:block;font-size:10.5px;font-weight:700;text-transform:uppercase;background:var(--navy-50);color:var(--navy-700);padding:1px 0}
.seba-app .notice__body{min-width:0;flex:1}
.seba-app .notice__body a{font-weight:600;color:var(--text);text-decoration:none}
.seba-app .notice__body a:hover{color:var(--navy-700);text-decoration:underline}
.seba-app .notice__meta{display:flex;gap:8px;flex-wrap:wrap;margin-top:6px;font-size:12.5px;color:var(--text-3)}
.seba-app .badge{display:inline-flex;align-items:center;gap:4px;font-size:11.5px;font-weight:700;border-radius:4px;padding:1px 7px;border:1px solid currentColor;line-height:1.5}
.seba-app .badge--new{color:var(--red-600);background:var(--red-50)}
.seba-app .badge--info{color:var(--navy-700);background:var(--navy-50)}

/* Empty state */
.seba-app .empty{text-align:center;padding:40px 24px;color:var(--text-2);list-style:none}
.seba-app .empty__icon{width:56px;height:56px;margin:0 auto 14px;border-radius:50%;display:grid;place-items:center;background:var(--navy-50);color:var(--navy-700)}
.seba-app .empty__icon svg{width:26px;height:26px}
.seba-app .empty h4{margin:0 0 6px;color:var(--navy-900);font-size:16px}
.seba-app .empty p{margin:0 auto;max-width:46ch;font-size:14px}

/* Help card + alert */
.seba-app .help-list{list-style:none;margin:0;padding:0;display:grid;gap:4px}
.seba-app .help-list a{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:var(--radius-sm);text-decoration:none;color:var(--text);font-weight:500;font-size:14px}
.seba-app .help-list a:hover{background:var(--navy-50);color:var(--navy-800)}
.seba-app .help-list svg{width:18px;height:18px;color:var(--navy-700);flex-shrink:0}
.seba-app .help-list a svg:last-child{margin-left:auto;width:14px;height:14px;color:var(--text-3)}
.seba-app .alert{display:flex;gap:12px;align-items:flex-start;padding:14px 16px;border-radius:var(--radius);border:1px solid;font-size:14px}
.seba-app .alert svg{width:20px;height:20px;flex-shrink:0;margin-top:1px}
.seba-app .alert--warn{background:var(--saffron-50);border-color:#f8d79a;color:#6b3d00}
.seba-app .alert strong{display:block;margin-bottom:2px}
.seba-app .stack{display:grid;gap:20px}

/* FAQ */
.seba-app .accordion{list-style:none;margin:0;padding:0}
.seba-app .acc-item{border-bottom:1px solid var(--border)}
.seba-app .acc-item:last-child{border-bottom:0}
.seba-app .acc-item h3{margin:0}
.seba-app .acc-btn{width:100%;display:flex;align-items:center;justify-content:space-between;gap:16px;text-align:left;
  padding:16px 20px;background:transparent;border:0;font-weight:600;font-size:15px;color:var(--text)}
.seba-app .acc-btn:hover{background:var(--surface-2)}
.seba-app .acc-btn svg{width:18px;height:18px;flex-shrink:0;color:var(--text-3);transition:transform .2s}
.seba-app .acc-btn[aria-expanded="true"]{color:var(--navy-800)}
.seba-app .acc-btn[aria-expanded="true"] svg{transform:rotate(180deg);color:var(--navy-700)}
.seba-app .acc-panel{padding:0 20px 18px;color:var(--text-2);font-size:14.5px}
.seba-app .acc-panel p{margin:0}


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
/*function GovStrip({ large, setLarge }) {
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
}*/

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

function HomeView({ onApply }) {
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

/* ---------- Instructions page ---------- */

function InstructionsView() {
    return (
        <section aria-labelledby="instrHeading">

            <div className="page-head">
                <Breadcrumb current="Instructions" />

                <h2 id="instrHeading">Instructions to Applicants</h2>

                <p>
                    Please read all instructions carefully before filling
                    in the Online Application Form.
                </p>
            </div>

            {/* Important alert */}

            <div className="instr-alert" role="note">
                <div className="instr-alert__icon">
                    <svg aria-hidden="true">
                        <use href="#i-warn" />
                    </svg>
                </div>

                <div>
                    <h3>Start here: complete the common registration first</h3>
                    <p>
                        Register once in the portal before applying for Class III
                        or Class IV posts. The same Registration ID can be used
                        for Class III, Class IV, or both, as per your eligibility.
                        See instruction 2.
                    </p>
                </div>
            </div>

            {/* Quick facts */}

            <div className="facts">

                <div className="card fact">
                    <span className="fact__icon">
                        <svg aria-hidden="true">
                            <use href="#i-edit" />
                        </svg>
                    </span>

                    <div>
                        <small>Mode</small>
                        <strong>Online only</strong>
                        <span>No physical copy needed</span>
                    </div>
                </div>

                <div className="card fact">
                    <span className="fact__icon">
                        <svg aria-hidden="true">
                            <use href="#i-id" />
                        </svg>
                    </span>

                    <div>
                        <small>Uploads (JPG/JPEG)</small>
                        <strong>Photo ≤ 35 KB</strong>
                        <span>Signature ≤ 30 KB</span>
                    </div>
                </div>

                <div className="card fact">
                    <span className="fact__icon">
                        <svg aria-hidden="true">
                            <use href="#i-phone" />
                        </svg>
                    </span>

                    <div>
                        <small>Technical helpline</small>
                        <strong>
                            <a href="tel:9582390056">9582390056</a>
                        </strong>
                        <span>Mon–Sat, 10 am – 5 pm</span>
                    </div>
                </div>

                <div className="card fact">
                    <span className="fact__icon">
                        <svg aria-hidden="true">
                            <use href="#i-shield" />
                        </svg>
                    </span>

                    <div>
                        <small>Best viewed in</small>
                        <strong>Chrome or Firefox</strong>
                        <span>Use the latest version</span>
                    </div>
                </div>

            </div>

            {/* Main layout */}

            <div className="instr-layout">

                <div>

                    {/* Group 1 */}

                    <article className="card instr-group" aria-labelledby="ig1">

                        <div className="instr-group__head">
                            <svg aria-hidden="true">
                                <use href="#i-info" />
                            </svg>

                            <h3 id="ig1">Getting started</h3>
                            <span>1–2</span>
                        </div>

                        <ol className="steps">

                            <li className="step">
                                <span className="step__num">1</span>

                                <p>
                                    The Commission invites applications in online
                                    mode only. Candidates are required to log on to{' '}
                                    <a href="https://www.sebaonline.org"
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        www.sebaonline.org
                                    </a>
                                    {' '}or{' '}
                                    <a href="https://assam.gov.in"
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        assam.gov.in
                                    </a>
                                    {' '}to access the home page of the
                                    "ONLINE APPLICATIONS". A single online
                                    application for each class of posts
                                    (i.e. Class-III and Class-IV) can be filled
                                    in and submitted in the prescribed web portal
                                    within the last date of submission of
                                    applications as mentioned in the Advertisement.
                                </p>
                            </li>

                            <li className="step step--key">
                                <span className="step__num">2</span>

                                <p>
                                    <mark>
                                        As a first step, a candidate has to do
                                        common registration in the portal before
                                        proceeding with filling of the online
                                        application of Class III posts or Class IV
                                        posts.
                                    </mark>
                                    {' '}A candidate may register from either the
                                    Class III or the Class IV website. For example,
                                    if a candidate registers for a Class III post,
                                    he/she need not register again for a Class IV
                                    post. The candidate may fill the application
                                    form with the same registration ID for Class III
                                    posts, Class IV posts, or both, as per eligibility.
                                </p>
                            </li>

                        </ol>
                    </article>

                    {/* Group 2 */}

                    <article className="card instr-group" aria-labelledby="ig2">

                        <div className="instr-group__head">
                            <svg aria-hidden="true">
                                <use href="#i-check" />
                            </svg>

                            <h3 id="ig2">Eligibility &amp; choosing posts</h3>
                            <span>3–5</span>
                        </div>

                        <ol className="steps">

                            <li className="step">
                                <span className="step__num">3</span>

                                <p>
                                    Before filling the online application form,
                                    an applicant has to identify the category of
                                    post/posts for which he/she is eligible. An
                                    applicant can apply for multiple categories
                                    of posts as per his/her eligibility through
                                    the online application form. For example,
                                    in respect of Class-III posts, a candidate
                                    with the minimum qualification specified in
                                    B, C or D can also apply for the qualification
                                    specified in A, and a candidate with the
                                    minimum qualification specified in C and D
                                    can also apply for the qualification specified
                                    in A and B. Similarly, a candidate with the
                                    minimum qualification specified in F can also
                                    apply for the qualification specified in E.
                                </p>
                            </li>

                            <li className="step">
                                <span className="step__num">4</span>

                                <p>
                                    An applicant has to apply separately for
                                    Class III posts and for Class IV posts,
                                    if desired.
                                </p>
                            </li>

                            <li className="step">
                                <span className="step__num">5</span>

                                <p>
                                    The applicant has to clearly mention and fill
                                    <strong> 'Yes' </strong>
                                    for the category of post/posts where he/she
                                    wants to apply and fill
                                    <strong> 'No' </strong>
                                    against the category of post/posts where
                                    he/she does not want to apply or is not
                                    eligible to apply.
                                </p>
                            </li>

                        </ol>
                    </article>

                    {/* Group 3 */}

                    <article className="card instr-group" aria-labelledby="ig3">

                        <div className="instr-group__head">
                            <svg aria-hidden="true">
                                <use href="#i-edit" />
                            </svg>

                            <h3 id="ig3">Filling the application form</h3>
                            <span>6–9</span>
                        </div>

                        <ol className="steps">

                            <li className="step">
                                <span className="step__num">6</span>

                                <p>
                                    The applicant must have the same valid mobile
                                    number throughout the process of recruitment.
                                    Authentication of the mobile number by OTP
                                    will be done. This may be used for further
                                    correspondence too.
                                </p>
                            </li>

                            <li className="step">
                                <span className="step__num">7</span>

                                <p>
                                    The candidates are required to fill the online
                                    application form, which consists of personal
                                    information, choice of examination centre,
                                    and uploading of signature and photograph.
                                </p>
                            </li>

                            <li className="step">
                                <span className="step__num">8</span>

                                <p>
                                    The <strong>Application Number</strong> and
                                    the <strong>Password</strong> will have to
                                    be used for further login into the portal.
                                </p>
                            </li>

                            <li className="step">
                                <span className="step__num">9</span>

                                <p>
                                    Upload your scanned photograph and signature.
                                    The size of the photograph and signature
                                    should not be more than
                                    <strong> 35 KB </strong> and
                                    <strong> 30 KB </strong> respectively,
                                    in <strong>'jpeg' or 'jpg'</strong> format only.
                                </p>
                            </li>

                        </ol>
                    </article>

                    {/* Group 4 */}

                    <article className="card instr-group" aria-labelledby="ig4">

                        <div className="instr-group__head">
                            <svg aria-hidden="true">
                                <use href="#i-lock" />
                            </svg>

                            <h3 id="ig4">Before &amp; after you submit</h3>
                            <span>10–13</span>
                        </div>

                        <ol className="steps">

                            <li className="step step--warn">
                                <span className="step__num">10</span>

                                <p>
                                    There is no provision to make changes in the
                                    application form after clicking the 'Submit'
                                    button. The applicant has to
                                    <strong> Preview Application Form </strong>
                                    and <strong>verify</strong> all entries properly
                                    before clicking on 'Submit'.
                                </p>
                            </li>

                            <li className="step">
                                <span className="step__num">11</span>

                                <p>
                                    The applicant need not send any physical copy
                                    of the application form or any document to
                                    the Commission or its authorized agency.
                                </p>
                            </li>

                            <li className="step">
                                <span className="step__num">12</span>

                                <p>
                                    Applicants are advised to go through the
                                    detailed instructions given at the time of
                                    inviting online applications by the Commission
                                    to ensure that their applications are not rejected.
                                </p>
                            </li>

                            <li className="step step--warn">
                                <span className="step__num">13</span>

                                <p>
                                    If any inadvertent mistake is made by the
                                    applicant while filling the online application
                                    form, it cannot be corrected later. The
                                    Commission or its authorized agency shall
                                    not take any responsibility in such cases.
                                </p>
                            </li>

                        </ol>
                    </article>

                    {/* Group 5 */}

                    <article className="card instr-group" aria-labelledby="ig5">

                        <div className="instr-group__head">
                            <svg aria-hidden="true">
                                <use href="#i-help" />
                            </svg>

                            <h3 id="ig5">Help &amp; support</h3>
                            <span>14–15</span>
                        </div>

                        <ol className="steps">

                            <li className="step">
                                <span className="step__num">14</span>

                                <p>
                                    The applicant may contact the Helpline no.
                                    <strong>
                                        {' '}
                                        <a href="tel:9582390056">9582390056</a>
                                    </strong>
                                    {' '}[Monday to Saturday: 10:00 am to 05:00 pm]
                                    only for
                                    <strong>
                                        {' '}technical queries related to the
                                        online application.
                                    </strong>
                                </p>
                            </li>

                            <li className="step">
                                <span className="step__num">15</span>

                                <p>
                                    This application module is best viewed in
                                    Mozilla Firefox or Google Chrome.
                                </p>
                            </li>

                        </ol>
                    </article>

                </div>

                {/* Right sidebar */}

                <aside className="instr-aside" aria-label="Apply">

                    <div className="card cta-card">

                        <h3>Ready to apply?</h3>

                        <p>
                            Make sure you have read every instruction
                            before you start.
                        </p>

                        <button
                            type="button"
                            className="btn btn--accent"
                            data-action="open-apply-menu"
                        >
                            <svg aria-hidden="true">
                                <use href="#i-edit" />
                            </svg>
                            Apply Online
                        </button>

                    </div>

                    <div className="card">

                        <div className="card__head">
                            <h3>
                                <svg aria-hidden="true">
                                    <use href="#i-check" />
                                </svg>
                                Keep these ready
                            </h3>
                        </div>

                        <div className="card__body">

                            <ul className="checklist">

                                <li>
                                    <svg aria-hidden="true">
                                        <use href="#i-check" />
                                    </svg>
                                    A valid mobile number for OTP
                                </li>

                                <li>
                                    <svg aria-hidden="true">
                                        <use href="#i-check" />
                                    </svg>
                                    Scanned photo, JPG, up to 35 KB
                                </li>

                                <li>
                                    <svg aria-hidden="true">
                                        <use href="#i-check" />
                                    </svg>
                                    Scanned signature, JPG, up to 30 KB
                                </li>

                                <li>
                                    <svg aria-hidden="true">
                                        <use href="#i-check" />
                                    </svg>
                                    Your preferred examination centre
                                </li>

                                <li>
                                    <svg aria-hidden="true">
                                        <use href="#i-check" />
                                    </svg>
                                    Details of your qualifications
                                </li>

                            </ul>

                        </div>
                    </div>

                </aside>

            </div>

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


/* ---------- Contact Us page ---------- */

function ContactView() {

    return (

        <section aria-labelledby="contactHeading">

            {/* Page heading */}

            <div className="page-head">

                <Breadcrumb current="Contact Us" />

                <h2 id="contactHeading">Contact Us</h2>

                <p>Help desk details for applicants.</p>

            </div>

            {/* Banner with working hours */}

            <div className="card contact-hero">

                <div>

                    <span className="contact-hero__eyebrow">
                        Help Desk
                    </span>

                    <h3>Need help with your online application?</h3>

                    <p>
                        Reach the help desk by phone or email during
                        working hours.
                    </p>

                </div>

                <div className="hours" aria-label="Working hours">

                    <span className="hours__title">

                        <svg aria-hidden="true">
                            <use href="#i-clock" />
                        </svg>

                        Working hours

                    </span>

                    <span className="hours__time">
                        10 A.M. – 5 P.M.
                    </span>

                    <ul className="hours__days">

                        <li title="Monday">
                            M<span className="visually-hidden">onday: open</span>
                        </li>

                        <li title="Tuesday">
                            T<span className="visually-hidden">uesday: open</span>
                        </li>

                        <li title="Wednesday">
                            W<span className="visually-hidden">ednesday: open</span>
                        </li>

                        <li title="Thursday">
                            T<span className="visually-hidden">hursday: open</span>
                        </li>

                        <li title="Friday">
                            F<span className="visually-hidden">riday: open</span>
                        </li>

                        <li title="Saturday">
                            S<span className="visually-hidden">aturday: open</span>
                        </li>

                        <li className="is-off" title="Sunday: closed">
                            S<span className="visually-hidden">unday: closed</span>
                        </li>

                    </ul>

                </div>

            </div>

            {/* Contact cards */}

            <div className="contact-grid">

                {/* Help Desk phone numbers */}

                <article
                    className="card contact-card contact-card--phone"
                    aria-labelledby="contactPhoneHeading"
                >

                    <div className="contact-card__top">

                        <span className="contact-card__icon">

                            <svg aria-hidden="true">
                                <use href="#i-phone" />
                            </svg>

                        </span>

                        <div>

                            <small>Call us</small>

                            <h3 id="contactPhoneHeading">
                                Help Desk
                            </h3>

                        </div>

                    </div>

                    <ul className="contact-lines">

                        <li>

                            <a
                                className="contact-line"
                                href="tel:9582390056"
                            >

                                <svg aria-hidden="true">
                                    <use href="#i-phone" />
                                </svg>

                                9582390056

                            </a>

                        </li>

                        {/* Replace with official second number */}

                        <li>

                            <span className="contact-line contact-line--pending">

                                <svg aria-hidden="true">
                                    <use href="#i-phone" />
                                </svg>

                                XXXXXXXXXX

                            </span>

                        </li>

                    </ul>

                </article>

                {/* Email */}

                <article
                    className="card contact-card contact-card--mail"
                    aria-labelledby="contactEmailHeading"
                >

                    <div className="contact-card__top">

                        <span className="contact-card__icon">

                            <svg aria-hidden="true">
                                <use href="#i-mail" />
                            </svg>

                        </span>

                        <div>

                            <small>Write to us</small>

                            <h3 id="contactEmailHeading">
                                Email ID
                            </h3>

                        </div>

                    </div>

                    <ul className="contact-lines">

                        <li>

                            <a
                                className="contact-line"
                                href="mailto:xxx@gmail.com"
                            >

                                <svg aria-hidden="true">
                                    <use href="#i-mail" />
                                </svg>

                                xxx@gmail.com

                            </a>

                        </li>

                    </ul>

                </article>

            </div>

            {/* Important note */}

            <div className="contact-note" role="note">

                <svg aria-hidden="true">
                    <use href="#i-info" />
                </svg>

                <span>
                    The help desk is only for
                    <strong>
                        {' '}technical queries related to the online application
                    </strong>
                    {' '}(see Instruction 14).
                </span>

            </div>

        </section>

    );

}

/* ===================================================================
   FOOTER + BACK TO TOP
=================================================================== */
{/*function Footer({ onApply }) {
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
}*/}

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
			
			<Header />

            <main id="main" tabIndex={-1}>
                <div className="container">
                    {view === 'home' && <HomeView onApply={openApply} />}
                    {view === 'instructions' && <InstructionsView />}
                    {view === 'faq' && <FaqView />}
                    {view === 'contact' && <ContactView />}
                </div>
            </main>

            {/*<Footer onApply={openApply} /> */}
			<Footer />
            <BackToTop />
        </div>
    );
}