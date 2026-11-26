import React, { useEffect, useRef, useState } from 'react';

/* ===================================================================
   CONTENT – edit these to change the menu without touching the JSX
=================================================================== */
const EMBLEM_SRC = '/img/emblem_of_india_colorful.png';
const BASE = typeof window !== 'undefined' ? `${window.location.origin}/slrc` : '/slrc';

// Menu shown AFTER login. "key" is used to highlight the current page.
const NAV_ITEMS = [
    { key: 'dashboard',   label: 'Dashboard',      href: `${BASE}/dashboard`,   icon: 'i-grid' },
    { key: 'application', label: 'My Application', href: `${BASE}/application`, icon: 'i-file' },
    /*{ key: 'payment',     label: 'Payment',        href: `${BASE}/payment`,     icon: 'i-card' },*/
    { key: 'profile',     label: 'My Profile',     href: `${BASE}/profile`,     icon: 'i-user' },
    
];

const NEWS = [
    { text: 'Online applications are open for Class III posts under Government of Assam', type: 'Notice', date: '2026-11-18', isNew: true },
    { text: 'Candidates must read the advertisement and eligibility criteria before applying', type: 'Notice', date: '2026-11-15' },
    { text: 'Keep a scanned photograph, signature and valid ID ready before starting the form', type: 'Update', date: '2026-11-12' },
    { text: 'Beware of fraudulent websites and agents: apply only through this official portal', type: 'Update', date: '2026-11-10' },
];
const TICKER_MS = 6000;

const LOGOUT_URL = `${BASE}/logout`;

/* ===================================================================
   STYLES – scoped under .slrc-app
=================================================================== */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Bengali:wght@500;600;700&display=swap');

.slrc-app{
  --navy-900:#0c2340; --navy-800:#13315c; --navy-700:#1d4378; --navy-50:#eef3fa;
  --saffron-500:#f59e0b; --saffron-600:#d97706; --saffron-50:#fff7e8;
  --green-600:#15803d; --green-50:#ecfdf3; --red-600:#b42318; --red-50:#fef3f2;
  --surface:#ffffff; --border:#e3e8ef; --border-strong:#cdd5df;
  --text:#101828; --text-2:#475467; --text-3:#667085;
  --radius-sm:6px; --radius:10px;
  --shadow-sm:0 1px 2px rgba(16,24,40,.06);
  --shadow-lg:0 12px 32px -8px rgba(16,24,40,.18);
  --font:"Inter","Segoe UI",system-ui,-apple-system,Roboto,"Helvetica Neue",Arial,sans-serif;
  --font-as:"Noto Sans Bengali","Nirmala UI","Vrinda","Shonar Bangla",sans-serif;
  --container:1200px; --nav-h:56px;
  display:contents; font-family:var(--font); font-size:15px; line-height:1.55; color:var(--text);
}
.slrc-app *,.slrc-app *::before,.slrc-app *::after{box-sizing:border-box}
.slrc-app img,.slrc-app svg{display:block}
.slrc-app a{color:var(--navy-700)}
.slrc-app button{font:inherit;cursor:pointer}
.slrc-app .as{font-family:var(--font-as)}
.slrc-app .container{width:100%;max-width:var(--container);margin:0 auto;padding:0 20px}
.slrc-app .visually-hidden{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.slrc-app :focus-visible{outline:3px solid var(--saffron-500);outline-offset:2px;border-radius:4px}

.slrc-app .skip-link{position:absolute;left:12px;top:-60px;z-index:100;background:var(--navy-800);color:#fff;
  padding:10px 16px;border-radius:var(--radius-sm);text-decoration:none;font-weight:600;transition:top .15s}
.slrc-app .skip-link:focus{top:12px}

/* Government strip */
.slrc-app .gov-strip{background:var(--navy-900);color:#dbe4f0;font-size:12px}
.slrc-app .gov-strip .container{display:flex;align-items:center;justify-content:space-between;min-height:38px;gap:16px}
.slrc-app .gov-strip__ids{display:flex;align-items:center}
.slrc-app .gov-strip__id{display:flex;flex-direction:column;line-height:1.2;padding:4px 16px 4px 0}
.slrc-app .gov-strip__id + .gov-strip__id{padding-left:16px;border-left:1px solid rgba(255,255,255,.18)}
.slrc-app .gov-strip__id .as{font-size:13px;font-weight:600;color:#fff}
.slrc-app .gov-strip__id span:last-child{font-size:10.5px;letter-spacing:.06em;text-transform:uppercase}
.slrc-app .gov-strip__tools{display:flex;align-items:center;gap:6px}
.slrc-app .gov-strip__tools button{background:transparent;border:1px solid rgba(255,255,255,.22);color:#e7edf5;
  border-radius:5px;font-size:12px;padding:3px 8px;min-width:30px}
.slrc-app .gov-strip__tools button:hover{background:rgba(255,255,255,.1)}
.slrc-app .gov-strip__tools button[aria-pressed="true"]{background:#fff;color:var(--navy-900)}
.slrc-app .gov-strip__right{display:flex;align-items:center;gap:16px;min-width:0}
.slrc-app .gov-user{display:flex;align-items:center;gap:10px;min-width:0;white-space:nowrap}
.slrc-app .gov-user__avatar{width:26px;height:26px;border-radius:50%;flex-shrink:0;display:grid;place-items:center;
  background:var(--saffron-500);color:#1a1200;font-weight:800;font-size:12px}
.slrc-app .gov-user__info{display:flex;align-items:baseline;gap:6px;min-width:0}
.slrc-app .gov-user__label{color:#9fb3cc;font-size:12px}
.slrc-app .gov-user__name{color:#fff;font-size:13px;font-weight:700;max-width:180px;overflow:hidden;text-overflow:ellipsis}
.slrc-app .gov-user__app{padding:2px 10px;border-radius:999px;background:rgba(255,255,255,.1);
  border:1px solid rgba(255,255,255,.18);color:#dbe4f0;font-size:12px;font-variant-numeric:tabular-nums}
.slrc-app .gov-user__app strong{color:#fbbf24;font-weight:700}
.slrc-app .gov-strip__tools{padding-left:16px;border-left:1px solid rgba(255,255,255,.18)}

@media (max-width:760px){
  .slrc-app .gov-strip__ids{display:none}
  .slrc-app .gov-strip__right{margin-left:auto}
  .slrc-app .gov-user__label{display:none}
}
/* Masthead */
.slrc-app .masthead{background:var(--surface);position:relative}
.slrc-app .masthead .container{display:grid;grid-template-columns:minmax(200px,1fr) auto minmax(200px,1fr);
  align-items:center;gap:24px;padding-top:18px;padding-bottom:18px}
.slrc-app .brand{display:flex;align-items:center;gap:12px;text-decoration:none;color:inherit}
.slrc-app .brand__emblem{width:52px;height:52px;flex-shrink:0;object-fit:contain}
.slrc-app .brand__text{line-height:1.25}
.slrc-app .brand__text strong{display:block;font-size:15px;color:var(--navy-900)}
.slrc-app .brand__text span{display:block;font-size:12.5px;color:var(--text-2)}
.slrc-app .title-block{text-align:center;max-width:680px}
.slrc-app .title-block__as{font-size:17px;font-weight:600;color:var(--navy-800);margin:0 0 2px}
.slrc-app .title-block h1{margin:0;font-size:clamp(18px,2.2vw,25px);font-weight:800;letter-spacing:.01em;
  color:var(--navy-900);line-height:1.2;text-transform:uppercase}
.slrc-app .title-block p{margin:6px 0 0;font-size:13.5px;color:var(--text-2)}

/* Logged-in candidate card */
.slrc-app .candidate{justify-self:end;display:flex;align-items:center;gap:12px;
  padding:8px 18px 8px 8px;border:1px solid var(--border);border-radius:999px;background:#f9fafb}
.slrc-app .candidate__avatar{width:40px;height:40px;border-radius:50%;flex-shrink:0;display:grid;place-items:center;
  background:linear-gradient(135deg,var(--navy-700),var(--navy-900));color:#fff;font-weight:700;font-size:16px;
  box-shadow:0 0 0 2px #fff,0 0 0 3px var(--border)}
.slrc-app .candidate__info{line-height:1.3;min-width:0}
.slrc-app .candidate__label{display:block;font-size:11.5px;color:var(--text-3)}
.slrc-app .candidate__name{display:block;font-weight:700;font-size:14px;color:var(--navy-900);
  max-width:190px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.slrc-app .candidate__meta{display:block;font-size:12px;color:var(--text-2);font-variant-numeric:tabular-nums}
.slrc-app .candidate__meta strong{color:#b45309;font-weight:700}
.slrc-app .tricolour{display:flex;height:4px}
.slrc-app .tricolour span{flex:1}
.slrc-app .tricolour span:nth-child(1){background:var(--saffron-500)}
.slrc-app .tricolour span:nth-child(2){background:#fff;border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
.slrc-app .tricolour span:nth-child(3){background:var(--green-600)}

/* Navigation – light rani pink */
.slrc-app{--rani-700:#a8135c; --rani-600:#c8196b; --rani-100:#fbd5e6; --rani-50:#fdeaf3}

.slrc-app .site-nav{background:linear-gradient(180deg,#fff4f9,var(--rani-50));
  border-bottom:1px solid #f3bfd6;position:sticky;top:0;z-index:50;
  box-shadow:0 2px 8px -4px rgba(200,25,107,.35)}
.slrc-app .site-nav .container{display:flex;align-items:center;min-height:var(--nav-h);gap:8px}
.slrc-app .nav-toggle{display:none;align-items:center;gap:8px;background:#fff;border:1px solid #e9a9c5;
  border-radius:var(--radius-sm);padding:8px 12px;color:var(--rani-700);font-weight:600}
.slrc-app .nav-toggle svg{width:20px;height:20px}
.slrc-app .nav-list{list-style:none;margin:0;padding:0;display:flex;align-items:center;gap:4px;flex:1}
.slrc-app .nav-item{position:relative}
.slrc-app .nav-link{display:inline-flex;align-items:center;gap:6px;height:40px;padding:0 14px;border-radius:var(--radius-sm);
  color:var(--navy-900);text-decoration:none;font-weight:600;font-size:14.5px;background:transparent;border:0;transition:background .15s,color .15s}
.slrc-app .nav-link svg{width:16px;height:16px;flex-shrink:0;color:var(--rani-600)}
.slrc-app .nav-link:hover{background:var(--rani-100);color:var(--rani-700)}
.slrc-app .nav-link[aria-current="page"]{background:#fff;color:var(--rani-700);box-shadow:inset 0 -3px 0 var(--rani-600)}
.slrc-app .nav-link[aria-expanded="true"]{background:var(--rani-100);color:var(--rani-700)}
.slrc-app .nav-link .chev{width:14px;height:14px;transition:transform .2s}
.slrc-app .nav-link[aria-expanded="true"] .chev{transform:rotate(180deg)}
/* News ticker */
.slrc-app .news{background:var(--navy-800);color:#fff;position:relative}
.slrc-app .news .container{display:flex;align-items:stretch;min-height:48px;padding:0}
.slrc-app .news__label{display:flex;align-items:center;gap:10px;padding:0 20px;font-weight:700;font-size:13.5px;
  letter-spacing:.06em;text-transform:uppercase;background:var(--navy-900);white-space:nowrap}
.slrc-app .news__dot{width:8px;height:8px;border-radius:50%;background:#f97066;animation:seba-pulse 2s infinite}
@keyframes seba-pulse{0%{box-shadow:0 0 0 0 rgba(249,112,102,.6)}70%{box-shadow:0 0 0 8px rgba(249,112,102,0)}100%{box-shadow:0 0 0 0 rgba(249,112,102,0)}}
.slrc-app .news__viewport{flex:1;display:flex;align-items:center;padding:0 20px;min-width:0;overflow:hidden}
.slrc-app .news__item{margin:0;font-weight:600;font-size:14.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;animation:seba-news-in .3s ease both}
@keyframes seba-news-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.slrc-app .news__item a{color:#fff;text-decoration:none}
.slrc-app .news__item a:hover{text-decoration:underline}
.slrc-app .news__tag{display:inline-block;font-size:11px;font-weight:700;letter-spacing:.04em;background:var(--saffron-500);
  color:#1a1200;border-radius:4px;padding:1px 6px;margin-right:10px;vertical-align:1px}
.slrc-app .news__controls{display:flex;align-items:center;gap:2px;padding:0 12px;border-left:1px solid rgba(255,255,255,.12)}
.slrc-app .news__count{font-size:12px;color:#c3d1e4;margin-right:6px;font-variant-numeric:tabular-nums;white-space:nowrap}
.slrc-app .icon-btn{display:inline-grid;place-items:center;width:34px;height:34px;border-radius:var(--radius-sm);background:transparent;border:0;color:#fff}
.slrc-app .icon-btn:hover{background:rgba(255,255,255,.12)}
.slrc-app .icon-btn svg{width:18px;height:18px}
.slrc-app .news__progress{position:absolute;left:0;bottom:0;height:3px;width:0;background:var(--saffron-500)}


/* Logout */
.slrc-app .nav-item--end{margin-left:auto}
.slrc-app .nav-link--logout{color:var(--red-600);border:1px solid #f1b5b0;height:34px;background:#fff}
.slrc-app .nav-link--logout svg{color:var(--red-600)}
.slrc-app .nav-link--logout:hover{background:var(--red-600);color:#fff;border-color:var(--red-600)}
.slrc-app .nav-link--logout:hover svg{color:#fff}

/* Dropdown */
.slrc-app .dropdown{position:absolute;top:calc(100% + 8px);left:0;min-width:260px;background:var(--surface);
  border:1px solid var(--border);border-top:3px solid var(--rani-600);border-radius:var(--radius);
  box-shadow:var(--shadow-lg);padding:6px;list-style:none;margin:0;
  opacity:0;visibility:hidden;transform:translateY(-4px);transition:.15s ease;z-index:60}
.slrc-app .dropdown.is-open{opacity:1;visibility:visible;transform:none}
.slrc-app .dropdown a{display:flex;gap:12px;align-items:flex-start;padding:10px 12px;border-radius:var(--radius-sm);
  text-decoration:none;color:var(--text)}
.slrc-app .dropdown a:hover,.slrc-app .dropdown a:focus-visible{background:var(--rani-50);outline-offset:-2px}
.slrc-app .dropdown a svg{width:20px;height:20px;color:var(--rani-600);margin-top:2px;flex-shrink:0}
.slrc-app .dropdown strong{display:block;font-size:14px}
.slrc-app .dropdown small{display:block;color:var(--text-3);font-size:12.5px}

html.slrc-text-lg .slrc-app{font-size:17px}

/* ===== Header animation ===== */
@keyframes slrc-fade-in{
  from{opacity:0;transform:translateY(-8px)}
  to{opacity:1;transform:none}
}
@keyframes slrc-fade-in-b{
  from{opacity:.5;transform:translateY(-2px)}
  to{opacity:1;transform:none}
}

/* 1. Page load: staggered fade (runs once) */
.slrc-app .gov-strip,
.slrc-app .masthead,
.slrc-app .site-nav,
.slrc-app .news{
  animation:slrc-fade-in .6s ease-out backwards;
}
.slrc-app .gov-strip{animation-delay:0s}
.slrc-app .masthead{animation-delay:.12s}
.slrc-app .site-nav{animation-delay:.24s}
.slrc-app .news{animation-delay:.36s}

/* 2. Scroll back up: light replay */
.slrc-app.hdr-replay .gov-strip,
.slrc-app.hdr-replay .masthead,
.slrc-app.hdr-replay .news{
  animation:slrc-fade-in-b .4s ease-out backwards;
}
.slrc-app.hdr-replay .gov-strip{animation-delay:0s}
.slrc-app.hdr-replay .masthead{animation-delay:.05s}
.slrc-app.hdr-replay .news{animation-delay:.1s}
/* Responsive */
@media (max-width:1024px){
  .slrc-app .masthead .container{grid-template-columns:auto 1fr}
  .slrc-app .candidate{grid-column:1 / -1;justify-self:center}
  .slrc-app .brand__text{display:none}
  .slrc-app .title-block{text-align:left}
}
@media (max-width:860px){
  .slrc-app .nav-toggle{display:inline-flex}
  .slrc-app .nav-list{display:none;position:absolute;left:0;right:0;top:100%;flex-direction:column;align-items:stretch;
    background:var(--surface);border-bottom:1px solid var(--border);box-shadow:var(--shadow-lg);padding:8px 16px 16px;gap:2px}
  .slrc-app .nav-list.is-open{display:flex}
  .slrc-app .nav-link{width:100%;height:46px;justify-content:flex-start}
  .slrc-app .nav-link .chev{margin-left:auto}
  .slrc-app .nav-item--end{margin-left:0;border-top:1px solid var(--border);padding-top:6px;margin-top:4px}
  .slrc-app .dropdown{position:static;box-shadow:none;border:0;border-left:2px solid var(--border);border-radius:0;
    margin:2px 0 6px 18px;display:none;opacity:1;visibility:visible;transform:none;min-width:0}
  .slrc-app .dropdown.is-open{display:block}
}
@media (max-width:640px){
  .slrc-app .container{padding:0 16px}
  .slrc-app .gov-strip__tools{display:none}
  .slrc-app .masthead .container{grid-template-columns:1fr;justify-items:center;gap:12px;padding-top:16px;padding-bottom:16px}
  .slrc-app .masthead .brand{display:none}
  .slrc-app .title-block{text-align:center}
  .slrc-app .title-block__as{font-size:15px}
}
@media (prefers-reduced-motion:reduce){
  .slrc-app *,.slrc-app *::before,.slrc-app *::after{animation:none!important;transition:none!important}
}
`;

/* ===================================================================
   ICONS
=================================================================== */


function IconSprite() {
    const s24 = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
    return (
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
            <defs>
                <symbol id="i-grid" {...s24}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></symbol>
                <symbol id="i-file" {...s24}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></symbol>
                <symbol id="i-card" {...s24}><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20M6 15h4" /></symbol>
                <symbol id="i-user" {...s24}><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" /></symbol>
                <symbol id="i-book" {...s24}><path d="M4 19.5V5a2 2 0 0 1 2-2h14v16H6.5A2.5 2.5 0 0 0 4 21.5 2.5 2.5 0 0 0 6.5 24" /><path d="M8 7h8M8 11h6" /></symbol>
                <symbol id="i-help" {...s24}><circle cx="12" cy="12" r="10" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></symbol>
                <symbol id="i-phone" {...s24}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></symbol>
                <symbol id="i-logout" {...s24}><path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4" /><path d="m16 17 5-5-5-5M21 12H9" /></symbol>
                <symbol id="i-chev-down" {...s24} strokeWidth="2.4"><path d="m6 9 6 6 6-6" /></symbol>
                <symbol id="i-menu" {...s24}><path d="M4 6h16M4 12h16M4 18h16" /></symbol>
                <symbol id="i-close" {...s24}><path d="M18 6 6 18M6 6l12 12" /></symbol>
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

/* ===================================================================
   HEADER PIECES
=================================================================== */

const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function GovStrip({ large, setLarge, candidate = {} }) {
    const name = candidate.name || 'Candidate';
    const initial = name.trim().charAt(0).toUpperCase();

    return (
        <div className="gov-strip">
            <div className="container">
                <div className="gov-strip__ids">
                    <div className="gov-strip__id"><span className="as" lang="as">অসম চৰকাৰ</span><span>Government of Assam</span></div>
                    <div className="gov-strip__id"><span className="as" lang="as">নিযুক্তি আয়োগ</span><span>Recruitment Commission</span></div>
                </div>

                <div className="gov-strip__right">
                    <div className="gov-user" aria-label="Logged in candidate">
                        <span className="gov-user__avatar" aria-hidden="true">{initial}</span>
                        <span className="gov-user__info">
                            <span className="gov-user__label">Logged in as</span>
                            <strong className="gov-user__name">{name}</strong>
                        </span>
                        {candidate.applicationNo && (
                            <span className="gov-user__app">App. No: <strong>{candidate.applicationNo}</strong></span>
                        )}
                    </div>

                    <div className="gov-strip__tools" role="group" aria-label="Text size">
                        <button type="button" aria-pressed={!large} aria-label="Normal text size" onClick={() => setLarge(false)}>A</button>
                        <button type="button" aria-pressed={large} aria-label="Larger text size" onClick={() => setLarge(true)}>A+</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Masthead({ candidate }) {
    const name = candidate.name || 'Candidate';
    const initial = name.trim().charAt(0).toUpperCase();

    return (
        <header className="masthead">
            <div className="container">
                <a className="brand" href={`${BASE}/dashboard`} aria-label="Government of Assam – Recruitment Commission, Class III Posts – Dashboard">
                    <img className="brand__emblem" src={EMBLEM_SRC} alt="" />
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

                
            </div>
            <div className="tricolour" aria-hidden="true"><span /><span /><span /></div>
        </header>
    );
}

function PrimaryNav({ active, onLogout }) {
    const [navOpen, setNavOpen] = useState(false);
    const [openKey, setOpenKey] = useState(null);
    const navRef = useRef(null);

    // close dropdown on outside click / Escape
    useEffect(() => {
        const onClick = (e) => { if (navRef.current && !navRef.current.contains(e.target)) setOpenKey(null); };
        const onKey = (e) => { if (e.key === 'Escape') { setOpenKey(null); setNavOpen(false); } };
        document.addEventListener('click', onClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('click', onClick);
            document.removeEventListener('keydown', onKey);
        };
    }, []);

    return (
        <nav className="site-nav" aria-label="Primary" ref={navRef}>
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
                        <li className="nav-item" key={item.key}>
                            {item.children ? (
                                <>
                                    <button
                                        className="nav-link"
                                        type="button"
                                        aria-haspopup="true"
                                        aria-expanded={openKey === item.key}
                                        aria-controls={`menu-${item.key}`}
                                        onClick={() => setOpenKey((k) => (k === item.key ? null : item.key))}
                                    >
                                        <Icon name={item.icon} />{item.label}<Icon name="i-chev-down" className="chev" />
                                    </button>
                                    <ul className={`dropdown ${openKey === item.key ? 'is-open' : ''}`} id={`menu-${item.key}`} aria-label={`${item.label} options`}>
                                        {item.children.map((c) => (
                                            <li key={c.label}>
                                                <a href={c.href} tabIndex={openKey === item.key ? 0 : -1}>
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
                                    href={item.href}
                                    aria-current={active === item.key ? 'page' : undefined}
                                    onClick={() => setNavOpen(false)}
                                >
                                    <Icon name={item.icon} />{item.label}
                                </a>
                            )}
                        </li>
                    ))}

                    <li className="nav-item nav-item--end">
                        <button className="nav-link nav-link--logout" type="button" onClick={onLogout}>
                            <Icon name="i-logout" />Logout
                        </button>
                    </li>
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
   MAIN COMPONENT
   Props:
     candidate  { name, applicationNo }
     active     'dashboard' | 'application' | 'payment' | 'profile'
     onLogout   optional – defaults to going to LOGOUT_URL
=================================================================== */
export default function SlrcDashboardHeader({
    candidate = { name: 'Candidate', applicationNo: '' },
    active = 'dashboard',
    onLogout,
}) {
    const [large, setLarge] = useState(() => {
        try { return localStorage.getItem('slrc-text-lg') === '1'; } catch (e) { return false; }
    });

    // text size
    useEffect(() => {
        document.documentElement.classList.toggle('slrc-text-lg', large);
        try { localStorage.setItem('slrc-text-lg', large ? '1' : '0'); } catch (e) { /* ignore */ }
        return () => document.documentElement.classList.remove('slrc-text-lg');
    }, [large]);

    // page title
    useEffect(() => {
        const current = NAV_ITEMS.find((n) => n.key === active);
        document.title = `${current ? current.label : 'Dashboard'} – SLRC Class III Posts`;
    }, [active]);

    const handleLogout = onLogout || (() => { window.location.href = LOGOUT_URL; });

    return (
        <div className="slrc-app">
            <style>{CSS}</style>
            <IconSprite />
            <a className="skip-link" href="#main">Skip to main content</a>

            <GovStrip large={large} setLarge={setLarge} candidate={candidate} />
            <Masthead candidate={candidate} />
            <PrimaryNav active={active} onLogout={handleLogout} />
			<NewsTicker />
        </div>
    );
}

/* USAGE
   <SlrcDashboardHeader
       candidate={{ name: 'Rahul Das', applicationNo: 'SLRC-2026-004512' }}
       active="dashboard"
   />
   ...then your dashboard content with <main id="main" tabIndex={-1}>...</main>
*/
