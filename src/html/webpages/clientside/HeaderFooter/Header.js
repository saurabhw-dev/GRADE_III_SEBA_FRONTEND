import React, { useEffect, useState } from 'react';

/* ------------------------------------------------------------------
   CONTENT - edit these arrays to change menu / news without touching JSX
------------------------------------------------------------------- */
const NAV_ITEMS = [
    { label: 'Home', href: '/' },

    // TODO: enable when the About Us pages are ready
    // {
    //     label: 'About Us',
    //     children: [
    //         { label: 'About the Commission', href: '/about' },
    //         { label: 'Vision & Mission', href: '/vision' },
    //     ],
    // },

    { label: 'Instructions', href: '/instructions' },

    {
        label: 'Apply Online',
        children: [
			{ label: 'Register via DigiLocker', href: '/register' },
			{ label: "Candidate's Login", href: '/login' },
        ],
    },

    { label: 'FAQ', href: '/faq' },
    { label: 'Contact Us', href: '/contact' },
];
const NEWS_ITEMS = [
    'Online applications are open for Class III posts under Government of Assam',
    'Candidates must read the advertisement and eligibility criteria before applying',
    'Keep a scanned photograph, signature and valid ID ready before starting the form',
    'Beware of fraudulent websites and agents: apply only through this official portal',
];

/* ------------------------------------------------------------------ */

function Header() {
    const [openMenu, setOpenMenu] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [newsIndex, setNewsIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [fontScale, setFontScale] = useState(100);

    useEffect(() => {
        if (paused) return undefined;
        const t = setInterval(() => setNewsIndex((i) => (i + 1) % NEWS_ITEMS.length), 4500);
        return () => clearInterval(t);
    }, [paused]);

    useEffect(() => {
        document.documentElement.style.fontSize = `${fontScale}%`;
    }, [fontScale]);

    const prevNews = () => setNewsIndex((i) => (i - 1 + NEWS_ITEMS.length) % NEWS_ITEMS.length);
    const nextNews = () => setNewsIndex((i) => (i + 1) % NEWS_ITEMS.length);
    const changeFont = (delta) => setFontScale((s) => Math.min(120, Math.max(90, s + delta)));

    return (
        <>
            <style>{`
                :root {
                    --h-navy: #0f2f5c;
                    --h-navy-deep: #0a2244;
                    --h-ink: #111111;
                    --h-grey: #f4f1ec;
                    --h-line: #dcd7cf;
                    --h-accent: #f5a30f;
                    --h-saffron: #ff9933;
                    --h-green: #138808;
                }

                .site-header, .site-header * { box-sizing: border-box; }
                .site-header { font-family: 'Segoe UI', 'Noto Sans', Arial, sans-serif; position: relative; z-index: 50; }

                .skip-link {
                    position: absolute; left: -9999px; top: 0;
                    background: var(--h-accent); color: #000; padding: 6px 12px; font-weight: 600; z-index: 100;
                }
                .skip-link:focus { left: 8px; top: 8px; }

                /* ---------- 1. Top government strip ---------- */
                .gov-strip {
                    background: var(--h-grey);
                    border-bottom: 1px solid var(--h-line);
                    display: flex; align-items: stretch; justify-content: space-between;
                    animation: dropIn .5s ease both;
                }
                .gov-strip__left { display: flex; align-items: stretch; padding-left: 3%; }
                .gov-strip__block { padding: 3px 12px 3px 0; line-height: 1.15; font-size: 10.5px; color: #222; }
                .gov-strip__block + .gov-strip__block { padding-left: 12px; border-left: 1px solid #b9b3a8; }
                .gov-strip__block b { display: block; font-size: 11.5px; font-weight: 600; }
                .gov-strip__block span { font-weight: 600; text-transform: uppercase; letter-spacing: .2px; }

                .gov-strip__tools { display: flex; align-items: stretch; }
                .tool-btn {
                    background: none; border: none; border-left: 1px solid var(--h-line);
                    padding: 0 11px; cursor: pointer; color: #111; font-weight: 700; font-size: 11.5px;
                    min-width: 32px; transition: background .2s, transform .15s;
                }
                .tool-btn:hover { background: #e8e3da; }
                .tool-btn:active { transform: scale(.92); }
                .tool-btn:focus-visible { outline: 2px solid var(--h-navy); outline-offset: -2px; }

                /* ---------- 2. Logo + title row ---------- */
                .brand-row {
                    position: relative;
                    background: linear-gradient(180deg, #ffffff, #f8fafd);
                    display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
                    gap: 12px; padding: 18px 3%;
                    border-bottom: 1px solid var(--h-line);
                }
                /* tricolour line that draws in under the brand row */
                .brand-row::after {
                    content: ""; position: absolute; left: 0; right: 0; bottom: -1px; height: 2px;
                    background: linear-gradient(to right, var(--h-saffron) 33.33%, #fff 33.33% 66.66%, var(--h-green) 66.66%);
                    transform-origin: left; animation: draw 1s cubic-bezier(.22,.8,.3,1) .3s both;
                }

                .brand-left { display: flex; align-items: center; gap: 9px; }
                .brand-emblem {
                    height: 44px; width: auto; object-fit: contain;
                    mix-blend-mode: multiply;
                    animation: popIn .7s cubic-bezier(.22,.8,.3,1) both, floaty 5s ease-in-out 1s infinite;
                }
                .brand-left__text { line-height: 1.2; animation: slideIn .7s ease .15s both; }
                .brand-left__text strong { display: block; font-size: 12.5px; color: var(--h-ink); }
                .brand-left__text span { display: block; font-size: 11.5px; color: #333; }

                .brand-center { text-align: center; animation: slideIn .8s ease .1s both; }
                .brand-center__local { font-size: 14px; font-weight: 500; color: var(--h-ink); margin: 0; line-height: 1.25; }
                .brand-center__title {
                    margin: 0; font-size: 20px; font-weight: 800; color: var(--h-ink);
                    line-height: 1.15; text-transform: uppercase;
                    animation: trackIn 1s ease .2s both;
                }
                .brand-center__sub { margin: 2px 0 0; font-size: 11.5px; font-weight: 600; color: var(--h-navy); }

                .brand-right { display: flex; justify-content: flex-end; align-items: center; gap: 9px; animation: slideIn .7s ease .25s both; }
                .brand-right__text { text-align: right; line-height: 1.2; }
                .brand-right__text strong { display: block; font-size: 12.5px; color: var(--h-ink); }
                .brand-right__text span { font-size: 11.5px; color: #333; }
                .brand-right__tricolour {
                    width: 5px; height: 34px; border-radius: 3px;
                    background: linear-gradient(180deg, var(--h-saffron) 33%, #fff 33% 66%, var(--h-green) 66%);
                    border: 1px solid var(--h-line);
                    animation: pulseBar 3s ease-in-out infinite;
                }

                /* ---------- 3. Navigation bar ---------- */
				.nav-bar {
				    background: var(--h-grey);
				    border-bottom: 1px solid var(--h-line);
				    padding: 0 3%;
				    position: relative;
				    z-index: 70;            /* add this line */
				}
                .nav-toggle {
                    display: none; width: 100%; background: none; border: none; padding: 9px 0;
                    font-size: 13.5px; font-weight: 700; text-align: left; cursor: pointer; color: var(--h-ink);
                }
                .nav-list { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; }
                .nav-item { position: relative; animation: dropIn .5s ease both; }
                .nav-item:nth-child(1) { animation-delay: .10s; }
                .nav-item:nth-child(2) { animation-delay: .16s; }
                .nav-item:nth-child(3) { animation-delay: .22s; }
                .nav-item:nth-child(4) { animation-delay: .28s; }
                .nav-item:nth-child(5) { animation-delay: .34s; }
                .nav-item:nth-child(6) { animation-delay: .40s; }
                .nav-item:nth-child(7) { animation-delay: .46s; }

                .nav-link {
                    display: flex; align-items: center; gap: 5px;
                    padding: 9px 15px; background: none; border: none; cursor: pointer;
                    font-family: inherit; font-size: 13.5px; font-weight: 600; color: var(--h-ink);
                    text-decoration: none; position: relative; transition: background .2s;
                }
                .nav-link::after {
                    content: ""; position: absolute; left: 15px; right: 15px; bottom: 5px; height: 2px;
                    background: var(--h-navy); transform: scaleX(0); transform-origin: left; transition: transform .25s ease;
                }
                .nav-link:hover::after, .nav-item--open > .nav-link::after { transform: scaleX(1); }
                .nav-link:focus-visible { outline: 2px solid var(--h-navy); outline-offset: -2px; }
                .nav-link--active {
                    background: linear-gradient(110deg, var(--h-accent) 40%, #ffd36a 50%, var(--h-accent) 60%);
                    background-size: 250% 100%;
                    animation: shine 4s ease-in-out 1s infinite;
                }
                .nav-link--active::after { display: none; }
                .caret { width: 6px; height: 6px; border-right: 2px solid currentColor; border-bottom: 2px solid currentColor; transform: rotate(45deg) translateY(-2px); transition: transform .2s; }
                .nav-item--open .caret { transform: rotate(-135deg) translateY(-2px); }

                .dropdown {
                    list-style: none; margin: 0; padding: 4px 0;
                    position: absolute; top: 100%; left: 0; min-width: 215px;
                    background: #fff; border: 1px solid var(--h-line); border-top: 3px solid var(--h-navy);
                    box-shadow: 0 12px 24px -10px rgba(0,0,0,.3);
                    opacity: 0; visibility: hidden; transform: translateY(8px);
                    transition: opacity .2s, transform .2s, visibility .2s;
                    z-index: 60;
                }
                .nav-item--open > .dropdown { opacity: 1; visibility: visible; transform: translateY(0); }
                .dropdown a {
                    display: block; padding: 7px 15px; font-size: 13px; color: #1b1b1b; text-decoration: none;
                    border-left: 3px solid transparent; transition: background .15s, border-color .15s, padding .15s;
                }
                .dropdown a:hover, .dropdown a:focus-visible { background: #eef3fa; border-left-color: var(--h-navy); padding-left: 19px; outline: none; }

                /* ---------- 4. Latest news bar ---------- */
                .news-bar {
                    position: relative; overflow: hidden;
                    background: var(--h-navy); color: #fff;
                    display: flex; align-items: stretch; min-height: 36px;
                }
                .news-bar::after {                      /* slow light sweep */
                    content: ""; position: absolute; inset: 0; pointer-events: none;
                    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,.12) 50%, transparent 60%);
                    transform: translateX(-100%); animation: sweep 6s ease-in-out 1.2s infinite;
                }
                .news-bar__label {
                    flex: 0 0 auto; padding: 0 3%; display: flex; align-items: center;
                    font-size: 14.5px; font-weight: 700; letter-spacing: .3px;
                    border-right: 1px solid rgba(255,255,255,.35);
                }
                .news-bar__label i {
                    width: 7px; height: 7px; border-radius: 50%; background: #ff5a4d; margin-right: 9px;
                    animation: livePulse 1.6s ease-in-out infinite;
                }
                .news-bar__text { flex: 1; display: flex; align-items: center; justify-content: center; padding: 4px 16px; overflow: hidden; }
                .news-bar__text a {
                    color: #fff; text-decoration: none; font-weight: 600; font-size: 13px; text-align: center;
                    animation: newsIn .5s ease both;
                }
                .news-bar__text a:hover { text-decoration: underline; }
                .news-bar__controls { display: flex; align-items: center; gap: 2px; padding-right: 3%; position: relative; z-index: 1; }
                .news-btn {
                    width: 26px; height: 26px; display: grid; place-items: center;
                    background: none; border: none; color: #fff; cursor: pointer; border-radius: 4px;
                    transition: background .2s, transform .15s;
                }
                .news-btn:hover { background: rgba(255,255,255,.18); }
                .news-btn:active { transform: scale(.88); }
                .news-btn:focus-visible { outline: 2px solid #fff; }
                .news-btn svg { width: 13px; height: 13px; fill: none; stroke: currentColor; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
                .news-btn svg .solid { fill: currentColor; stroke: none; }

                .news-progress { height: 2px; background: var(--h-navy-deep); overflow: hidden; }
                .news-progress span {
                    display: block; height: 100%; width: 100%; background: var(--h-accent);
                    transform-origin: left; animation: progress 4.5s linear both;
                }
                .news-progress--paused span { animation-play-state: paused; }

                /* ---------- Keyframes ---------- */
                @keyframes popIn { from { opacity: 0; transform: scale(.85); } to { opacity: 1; transform: scale(1); } }
                @keyframes floaty { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
                @keyframes slideIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes dropIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes trackIn { from { opacity: 0; letter-spacing: 3px; } to { opacity: 1; letter-spacing: .3px; } }
                @keyframes draw { from { transform: scaleX(0); } to { transform: scaleX(1); } }
                @keyframes pulseBar { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(.8); } }
                @keyframes shine { 0%,100% { background-position: 100% 0; } 50% { background-position: 0 0; } }
                @keyframes sweep { 0% { transform: translateX(-100%); } 35%,100% { transform: translateX(100%); } }
                @keyframes newsIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes livePulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .35; transform: scale(.7); } }
                @keyframes progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }

                /* ---------- Responsive ---------- */
                @media (max-width: 1000px) {
                    .brand-row { grid-template-columns: 1fr; text-align: center; justify-items: center; gap: 4px; }
                    .brand-right { display: none; }
                    .brand-center__title { font-size: 18px; }
                    .brand-center__local { font-size: 13px; }
                }

                @media (max-width: 760px) {
                    .gov-strip__left { padding-left: 10px; }
                    .gov-strip__block { font-size: 9.5px; padding-right: 8px; }
                    .gov-strip__block b { font-size: 10.5px; }
                    .gov-strip__block + .gov-strip__block { padding-left: 8px; }
                    .brand-left { display: none; }
                    .brand-row { padding: 6px 10px; }
                    .brand-center__title { font-size: 15px; }
                    .brand-center__local { font-size: 12px; }
                    .brand-center__sub { font-size: 10.5px; }

                    .nav-toggle { display: block; }
                    .nav-list { display: none; flex-direction: column; padding-bottom: 6px; }
                    .nav-list--open { display: flex; }
                    .nav-link { width: 100%; justify-content: space-between; padding: 9px 6px; }
                    .nav-link::after { display: none; }
                    .dropdown {
                        position: static; box-shadow: none; border: none; border-left: 3px solid var(--h-navy);
                        margin-left: 6px; display: none; opacity: 1; visibility: visible; transform: none;
                    }
                    .nav-item--open > .dropdown { display: block; }

                    .news-bar { flex-wrap: wrap; }
                    .news-bar__label { font-size: 13px; padding: 0 10px; min-height: 32px; border-right: none; }
                    .news-bar__text { order: 3; flex-basis: 100%; padding: 0 10px 6px; }
                    .news-bar__text a { font-size: 12px; }
                    .news-bar__controls { margin-left: auto; padding-right: 6px; }
                }

                @media (prefers-reduced-motion: reduce) {
                    .site-header *, .site-header *::after { animation: none !important; transition: none !important; }
                }
            `}</style>

            <div className="site-header" id="home">
                <a className="skip-link" href="#main-content">Skip to main content</a>

                {/* 1. Top government strip */}
                <div className="gov-strip">
                    <div className="gov-strip__left">
                        <div className="gov-strip__block">
                            <b>অসম চৰকাৰ</b>
                            <span>Government of Assam</span>
                        </div>
                        <div className="gov-strip__block">
                            <b>নিযুক্তি আয়োগ</b>
                            <span>Recruitment Commission</span>
                        </div>
                    </div>
                    
                </div>

                {/* 2. Logo + title row */}
                <div className="brand-row">
                    <div className="brand-left">
                        <img
                            className="brand-emblem"
                            src="/img/emblem_of_india_colorful.png"
                            alt="National Emblem of India"
                        />
                        <div className="brand-left__text">
                            <strong>Government of Assam</strong>
                            <span>Recruitment Commission</span>
                            <span>Class III Posts</span>
                        </div>
                    </div>

                    <div className="brand-center">
                        <p className="brand-center__local">ৰাজ্যিক স্তৰৰ নিযুক্তি আয়োগ</p>
                        <h1 className="brand-center__title">
                            State Level Recruitment Commission for Class III Posts
                        </h1>
                        <p className="brand-center__sub">Online Application Form for Recruitment of Class III Posts under Government of Assam</p>
                    </div>

                    <div className="brand-right">
                        <div className="brand-right__text">
                            <strong>Official Recruitment Portal</strong>
                            <span>Apply online only</span>
                        </div>
                        <div className="brand-right__tricolour" aria-hidden="true" />
                    </div>
                </div>

                {/* 3. Navigation */}
                <nav className="nav-bar" aria-label="Main navigation">
                    <button
                        className="nav-toggle"
                        onClick={() => setMobileOpen((o) => !o)}
                        aria-expanded={mobileOpen}
                    >
                        {mobileOpen ? '✕  Close menu' : '☰  Menu'}
                    </button>

                    <ul className={`nav-list ${mobileOpen ? 'nav-list--open' : ''}`}>
                        {NAV_ITEMS.map((item, idx) => {
                            const hasChildren = Boolean(item.children);
                            const isOpen = openMenu === idx;
                            return (
                                <li
                                    key={item.label}
                                    className={`nav-item ${isOpen ? 'nav-item--open' : ''}`}
                                    onMouseEnter={() => hasChildren && setOpenMenu(idx)}
                                    onMouseLeave={() => hasChildren && setOpenMenu(null)}
                                >
                                    {hasChildren ? (
                                        <button
                                            className="nav-link"
                                            aria-haspopup="true"
                                            aria-expanded={isOpen}
                                            onClick={() => setOpenMenu(isOpen ? null : idx)}
                                        >
                                            {item.label}
                                            <span className="caret" />
                                        </button>
                                    ) : (
                                        <a
                                            className={`nav-link ${idx === 0 ? 'nav-link--active' : ''}`}
                                            href={item.href}
                                        >
                                            {item.label}
                                        </a>
                                    )}

                                    {hasChildren && (
                                        <ul className="dropdown">
                                            {item.children.map((c) => (
                                                <li key={c.label}>
                                                    <a href={c.href}>{c.label}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* 4. Latest news bar */}
                <div className="news-bar" role="region" aria-label="Latest news">
                    <div className="news-bar__label"><i aria-hidden="true" />LATEST NEWS</div>

                    <div className="news-bar__text" aria-live="polite">
                        <a key={newsIndex} href="#notices">{NEWS_ITEMS[newsIndex]}</a>
                    </div>

                    <div className="news-bar__controls">
                        <button className="news-btn" onClick={prevNews} aria-label="Previous news">
                            <svg viewBox="0 0 24 24"><polyline points="15 4 7 12 15 20" /></svg>
                        </button>
                        <button className="news-btn" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Play news' : 'Pause news'}>
                            <svg viewBox="0 0 24 24">
                                {paused
                                    ? <polygon className="solid" points="6 3 20 12 6 21" />
                                    : <><rect className="solid" x="5" y="3" width="5" height="18" /><rect className="solid" x="14" y="3" width="5" height="18" /></>}
                            </svg>
                        </button>
                        <button className="news-btn" onClick={nextNews} aria-label="Next news">
                            <svg viewBox="0 0 24 24"><polyline points="9 4 17 12 9 20" /></svg>
                        </button>
                    </div>
                </div>
                <div className={`news-progress ${paused ? 'news-progress--paused' : ''}`}>
                    <span key={`${newsIndex}-${paused}`} />
                </div>
            </div>
        </>
    );
}

export default Header;