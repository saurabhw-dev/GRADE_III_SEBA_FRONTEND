import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../HeaderFooter/Header';   // adjust the path if your folders differ
import Footer from '../HeaderFooter/Footer';
import API_BASE_URL from '../../../../apiConfig';

/* ===================================================================
   ICONS  (only the icons this page uses, drawn inline)
=================================================================== */
const S = 'stroke';
const ICONS = {
    'i-login': [S, <><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><path d="m10 17 5-5-5-5M15 12H3" /></>],
    'i-id': [S, <><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="11" r="2" /><path d="M15 10h3M15 14h3M6 16c.6-1.4 1.7-2 3-2s2.4.6 3 2" /></>],
    'i-lock': [S, <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>],
    'i-eye': [S, <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>],
    'i-eye-off': [S, <><path d="M3 3l18 18" /><path d="M10.6 6.1A9.8 9.8 0 0 1 12 6c6.4 0 10 6 10 6a17 17 0 0 1-3.2 3.9M6.6 7.6C3.9 9.3 2 12 2 12s3.6 6 10 6a9.7 9.7 0 0 0 4-.9" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></>],
    'i-shield': [S, <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></>],
    'i-refresh': [S, <><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 4v5h-5" /></>],
    'i-alert': [S, <><circle cx="12" cy="12" r="10" /><path d="M12 8v5M12 16h.01" /></>],
    'i-warn': [S, <><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></>],
    'i-user-plus': [S, <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" /></>],
    'i-book': [S, <><path d="M4 19.5V5a2 2 0 0 1 2-2h14v16H6.5A2.5 2.5 0 0 0 4 21.5 2.5 2.5 0 0 0 6.5 24" /><path d="M8 7h8M8 11h6" /></>],
    'i-help': [S, <><circle cx="12" cy="12" r="10" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></>],
    'i-phone': [S, <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />],
    'i-chev-right': [S, <path d="m9 18 6-6-6-6" />, 2.4],
};

function Icon({ name, className }) {
    const entry = ICONS[name];
    if (!entry) return null;
    const [, node, width] = entry;
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth={width || 2}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {node}
        </svg>
    );
}

/* ===================================================================
   BASE CSS  (colour tokens, fonts, reset, .btn) – scoped to .seba-app
   .seba-app uses display:contents, so it never changes your layout.
=================================================================== */
const BASE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.seba-app{
  display:contents;
  --navy-900:#0c2340; --navy-800:#13315c; --navy-700:#1d4378; --navy-50:#eef3fa;
  --saffron-500:#f59e0b; --saffron-600:#d97706; --saffron-50:#fff7e8;
  --green-600:#15803d; --green-50:#ecfdf3; --red-600:#b42318; --red-50:#fef3f2;
  --bg:#f5f7fa; --surface:#ffffff; --surface-2:#f9fafb; --border:#e3e8ef; --border-strong:#cdd5df;
  --text:#101828; --text-2:#475467; --text-3:#667085;
  --radius-sm:6px; --radius:10px; --radius-lg:14px;
  --shadow:0 4px 12px -2px rgba(16,24,40,.08), 0 2px 4px -2px rgba(16,24,40,.04);
  --font:"Inter","Segoe UI",system-ui,-apple-system,Roboto,"Helvetica Neue",Arial,sans-serif;
  font-family:var(--font);font-size:15px;line-height:1.55;color:var(--text);
}
.seba-app *,.seba-app *::before,.seba-app *::after{box-sizing:border-box}
.seba-app svg{display:block}
.seba-app a{color:var(--navy-700)}
.seba-app button{font:inherit;cursor:pointer}
.seba-app :focus-visible{outline:3px solid var(--saffron-500);outline-offset:2px;border-radius:4px}
html.seba-text-lg .seba-app{font-size:17px}

.seba-app .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:42px;padding:0 18px;
  border-radius:var(--radius-sm);font-weight:600;font-size:14.5px;text-decoration:none;border:1px solid transparent;
  transition:background .15s,border-color .15s,box-shadow .15s;white-space:nowrap}
.seba-app .btn svg{width:18px;height:18px}
.seba-app .btn--secondary{background:var(--surface);color:var(--navy-800);border-color:var(--border-strong)}
.seba-app .btn--secondary:hover{background:var(--surface-2);border-color:var(--navy-700)}

@media (prefers-reduced-motion:reduce){
  .seba-app *,.seba-app *::before,.seba-app *::after{animation:none!important;transition:none!important}
}
`;

/* ===================================================================
   LOGIN CSS  (only the styles used by this page)
   Converted from the login HTML. Scoped under .seba-app.
=================================================================== */
const LOGIN_CSS = `
.seba-app [hidden]{display:none!important}

/* 3. Page layout */
.seba-app main.login-page{background:var(--bg);display:flex;align-items:center;justify-content:center;padding:32px 16px}
.seba-app .login-wrap{width:100%;max-width:1000px}
.seba-app .login-card{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);overflow:hidden;
  background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);box-shadow:var(--shadow)}
.seba-app .login-main{display:flex;flex-direction:column}
.seba-app .login-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 22px;border-bottom:1px solid var(--border)}
.seba-app .login-head h1{margin:0;font-size:17px;color:var(--navy-900);display:flex;align-items:center;gap:8px;letter-spacing:.01em}
.seba-app .login-head h1 svg{width:18px;height:18px;color:var(--navy-700)}
.seba-app .login-head__tag{font-size:12.5px;font-weight:600;color:var(--text-3)}
.seba-app .login-form{padding:18px 22px 20px;display:grid;gap:14px}
.seba-app .form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}

/* 4. Form fields */
.seba-app .field{display:grid;gap:5px;align-content:start}
.seba-app .field label{font-weight:600;font-size:13.5px;color:var(--text)}
.seba-app .field__top{display:flex;align-items:baseline;justify-content:space-between;gap:10px}
.seba-app .field__control{position:relative}
.seba-app .field__icon{position:absolute;left:11px;top:50%;transform:translateY(-50%);width:16px;height:16px;color:var(--text-3);pointer-events:none}
.seba-app .login-form .input{width:100%;height:42px;border:1px solid var(--border-strong);border-radius:var(--radius-sm);
  background:var(--surface);color:var(--text);font:inherit;font-size:14.5px;padding:0 10px 0 35px;
  transition:border-color .15s,box-shadow .15s}
.seba-app .login-form .input::placeholder{color:#98a2b3;letter-spacing:.02em}
.seba-app .login-form .input:hover{border-color:#b3bdca}
.seba-app .login-form .input:focus{outline:none;border-color:var(--navy-700);box-shadow:0 0 0 3px rgba(29,67,120,.18)}
.seba-app .field__control:focus-within .field__icon{color:var(--navy-700)}
.seba-app .field--password .input{padding-right:42px}
.seba-app .pw-toggle{position:absolute;right:4px;top:50%;transform:translateY(-50%);width:34px;height:34px;display:grid;place-items:center;
  border:0;background:transparent;color:var(--text-3);border-radius:var(--radius-sm)}
.seba-app .pw-toggle:hover{background:var(--navy-50);color:var(--navy-800)}
.seba-app .pw-toggle svg{width:17px;height:17px}
.seba-app .field__error{display:none;align-items:center;gap:6px;font-size:13px;font-weight:500;color:var(--red-600);margin:0}
.seba-app .field__error svg{width:15px;height:15px;flex-shrink:0}
.seba-app .field.is-invalid .input{border-color:var(--red-600);background:#fffbfa}
.seba-app .field.is-invalid .input:focus{box-shadow:0 0 0 3px rgba(180,35,24,.15)}
.seba-app .field.is-invalid .field__icon{color:var(--red-600)}
.seba-app .field.is-invalid .field__error{display:flex}
.seba-app .caps-warn{display:none;align-items:center;gap:6px;font-size:12.5px;font-weight:600;color:#6b3d00;margin:0}
.seba-app .caps-warn svg{width:15px;height:15px;color:var(--saffron-600)}
.seba-app .caps-warn.is-visible{display:flex}
.seba-app .forgot{font-size:13.5px;font-weight:600;color:var(--navy-700);text-decoration:none;border-radius:4px}
.seba-app .forgot:hover{text-decoration:underline;color:var(--navy-800)}

/* 5. Captcha */
.seba-app .captcha{display:grid;grid-template-columns:auto minmax(0,1fr);gap:8px}
.seba-app .captcha__box{display:flex;align-items:center;height:42px;border:1px solid var(--border-strong);border-radius:var(--radius-sm);
  background:var(--surface-2);overflow:hidden}
.seba-app .captcha__box canvas,.seba-app .captcha__box img{width:116px;height:40px;user-select:none}
.seba-app .captcha__refresh{width:36px;height:40px;display:grid;place-items:center;border:0;border-left:1px solid var(--border);
  background:transparent;color:var(--navy-700)}
.seba-app .captcha__refresh:hover{background:var(--navy-50)}
.seba-app .captcha__refresh svg{width:17px;height:17px;transition:transform .3s}
.seba-app .captcha__refresh.is-spinning svg{transform:rotate(360deg)}
.seba-app .field.is-invalid .captcha__box{border-color:var(--red-600)}

/* 6. Buttons */
.seba-app .btn--primary{background:var(--navy-800);color:#fff}
.seba-app .btn--primary:hover{background:var(--navy-700)}
.seba-app .btn--sm{height:38px;padding:0 14px;font-size:14px}
.seba-app .btn--block{width:100%;margin-top:2px}
.seba-app .btn:disabled{opacity:.6;cursor:not-allowed}
.seba-app .btn .spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;
  animation:seba-spin .7s linear infinite;display:none}
.seba-app .btn.is-loading .spinner{display:inline-block}
.seba-app .btn.is-loading .btn__icon{display:none}
@keyframes seba-spin{to{transform:rotate(360deg)}}
.seba-app .signup{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px 16px;
  padding-top:14px;border-top:1px solid var(--border)}
.seba-app .signup p{margin:0;font-size:13.5px;color:var(--text-2);line-height:1.35}
.seba-app .signup p strong{color:var(--navy-900)}
.seba-app .alert{display:flex;gap:12px;align-items:flex-start;padding:12px 14px;border-radius:var(--radius);border:1px solid;font-size:14px}
.seba-app .alert svg{width:20px;height:20px;flex-shrink:0;margin-top:1px}
.seba-app .alert--error{background:var(--red-50);border-color:#fecdca;color:var(--red-600)}
.seba-app .alert strong{display:block;margin-bottom:2px}

/* 7. Navy help panel */
.seba-app .login-aside{background:linear-gradient(160deg,var(--navy-800),var(--navy-900));color:#e4ebf5;padding:22px 24px;
  display:flex;flex-direction:column;gap:14px}
.seba-app .login-aside h2{margin:0;color:#fff;font-size:14px;text-transform:uppercase;letter-spacing:.08em}
.seba-app .login-aside ol{margin:0;padding:0;list-style:none;display:grid;gap:10px;counter-reset:step}
.seba-app .login-aside li{display:flex;gap:10px;align-items:center;font-size:13.5px;counter-increment:step}
.seba-app .login-aside li::before{content:counter(step);flex-shrink:0;width:24px;height:24px;border-radius:50%;
  display:grid;place-items:center;font-weight:700;font-size:12.5px;background:rgba(255,255,255,.12);color:#fff;
  border:1px solid rgba(255,255,255,.25)}
.seba-app .login-aside__help{margin-top:auto;padding-top:12px;border-top:1px solid rgba(255,255,255,.14);display:grid;gap:2px}
.seba-app .login-aside__help p{margin:0 0 2px;font-size:12px;color:#c3d1e4;text-transform:uppercase;letter-spacing:.06em;font-weight:600}
.seba-app .login-aside__help a{display:flex;align-items:center;gap:10px;padding:7px 10px;margin:0 -10px;border-radius:var(--radius-sm);
  color:#fff;text-decoration:none;font-size:13.5px;font-weight:500}
.seba-app .login-aside__help a:hover{background:rgba(255,255,255,.1)}
.seba-app .login-aside__help svg{width:16px;height:16px;flex-shrink:0;color:#c3d1e4}
.seba-app .login-aside__help a svg:last-child{margin-left:auto;width:14px;height:14px}
.seba-app .secure-note{display:flex;align-items:center;justify-content:center;gap:8px;margin:14px 0 0;font-size:13px;color:var(--text-3)}
.seba-app .secure-note svg{width:16px;height:16px;color:var(--green-600)}

/* 8. Responsive */
@media (max-width:860px){
  .seba-app .login-wrap{max-width:560px}
  .seba-app .login-card{grid-template-columns:1fr}
}
@media (max-width:640px){
  .seba-app main.login-page{align-items:flex-start;padding:16px}
  .seba-app .login-head{padding:10px 18px}
  .seba-app .login-form{padding:16px 18px 18px}
  .seba-app .login-aside{padding:22px 18px}
  .seba-app .login-form .input{font-size:16px}
  .seba-app .signup .btn{flex:1}
}
@media (max-width:480px){
  .seba-app .form-row{grid-template-columns:1fr;gap:12px}
}


/* Center Screen Designer Alert - CSS only fade in / fade out */
.custom-alert {
    --accent: #18743a;
    --accent-soft: rgba(24, 116, 58, 0.14);
    --duration: 4s; /* total time the alert stays on screen */

    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99999;

    display: flex;
    align-items: center;
    gap: 14px;

    width: calc(100% - 40px);
    max-width: 400px;
    padding: 18px 20px;
    overflow: hidden;

    background: rgba(255, 255, 255, 0.85);
    -webkit-backdrop-filter: blur(18px) saturate(160%);
    backdrop-filter: blur(18px) saturate(160%);
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-radius: 18px;
    box-shadow:
        0 20px 50px -12px rgba(0, 0, 0, 0.25),
        0 2px 6px rgba(0, 0, 0, 0.06),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);

    opacity: 0;
    animation: alertLife var(--duration) cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

/* Variants */
.custom-alert--success {
    --accent: #1f9d55;
    --accent-soft: rgba(31, 157, 85, 0.16);
}

.custom-alert--error {
    --accent: #e03a3a;
    --accent-soft: rgba(224, 58, 58, 0.16);
}

/* Soft colored glow in the corner */
.custom-alert::before {
    content: "";
    position: absolute;
    top: -60px;
    left: -60px;
    width: 160px;
    height: 160px;
    background: radial-gradient(circle, var(--accent-soft), transparent 70%);
    pointer-events: none;
}

/* Auto-dismiss progress bar */
.custom-alert::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, var(--accent), transparent);
    transform-origin: left;
    animation: alertProgress var(--duration) linear forwards;
}

/* Icon badge */
.custom-alert__icon {
    position: relative;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    width: 44px;
    height: 44px;
    font-size: 22px;

    color: #fff;
    background: linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 70%, #000));
    border-radius: 50%;
    box-shadow: 0 6px 16px -4px var(--accent);
}

.custom-alert__icon svg {
    color: #fff;
}

.custom-alert__content {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 3px;
    flex: 1;
}

.custom-alert__content strong {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: #111;
}

.custom-alert__content span {
    font-size: 13px;
    line-height: 1.5;
    color: #5b5b63;
}

/* Close button */
.custom-alert__close {
    position: relative;
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;

    background: rgba(0, 0, 0, 0.05);
    border: none;
    border-radius: 50%;
    color: #6b6b73;
    cursor: pointer;
    font-size: 14px;
    padding: 0;
    transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.custom-alert__close:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #111;
    transform: rotate(90deg);
}

/* Fade in -> stay -> fade out (all in one animation) */
@keyframes alertLife {
    0% {
        opacity: 0;
        transform: translate(-50%, -46%) scale(0.94);
        filter: blur(4px);
        visibility: visible;
    }
    8% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
        filter: blur(0);
    }
    90% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
        filter: blur(0);
    }
    100% {
        opacity: 0;
        transform: translate(-50%, -54%) scale(0.96);
        filter: blur(4px);
        visibility: hidden;
    }
}

@keyframes alertProgress {
    from { transform: scaleX(1); }
    to   { transform: scaleX(0); }
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
    .custom-alert {
        background: rgba(30, 30, 34, 0.85);
        border-color: rgba(255, 255, 255, 0.08);
        box-shadow:
            0 20px 50px -12px rgba(0, 0, 0, 0.7),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
    }
    .custom-alert__content strong { color: #fff; }
    .custom-alert__content span { color: #a8a8b0; }
    .custom-alert__close { background: rgba(255, 255, 255, 0.08); color: #bbb; }
    .custom-alert__close:hover { background: rgba(255, 255, 255, 0.16); color: #fff; }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    .custom-alert::after { animation: none; }
}
/* ===== Login page: entry + exit ===== */
@keyframes seba-login-in{
  from{opacity:0;transform:translateY(10px) scale(.99)}
  to{opacity:1;transform:none}
}
@keyframes seba-login-out{
  from{opacity:1;transform:none}
  to{opacity:0;transform:translateY(-8px) scale(.99)}
}
@keyframes seba-fade-soft{ from{opacity:0} to{opacity:1} }

/* entry */
.seba-app .login-card{animation:seba-login-in .5s cubic-bezier(.22,.61,.36,1) backwards}
.seba-app .secure-note{animation:seba-fade-soft .5s ease-out .25s backwards}

/* exit (added by JS after a successful login) */
.seba-app .login-card.is-leaving{animation:seba-login-out .35s ease-in forwards}
.seba-app .secure-note.is-leaving{animation:seba-login-out .35s ease-in forwards}

`;

const CAPTCHA_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O or 1/I look-alikes

/* ===================================================================
   LOGIN (default export)

   Optional props:
     serverError – string. Shows the red "Login failed" box with this text.
     onLogin     – function({ applicationNo, password, captcha }).
                   If given, the form calls it instead of a normal POST
                   (use it for fetch / axios).
     action      – form action URL for a normal POST (default "").
=================================================================== */
function Login({ serverError = '', onLogin, action = '' }) {

    const location = useLocation();
	const navigate = useNavigate();
    useEffect(() => {

        if (location.state && location.state.message) {

            setAlertType(location.state.alertType);
            setLoginError(location.state.message);
            setShowAlert(true);

            navigate(location.pathname, { replace: true, state: null });
        }

    }, [location, navigate]);
    
    const [applicationNo, setApplicationNo] = useState('');
    const [password, setPassword] = useState('');
    const [captcha, setCaptcha] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [capsLock, setCapsLock] = useState(false);
    const [loading, setLoading] = useState(false);
    const [disableLogin, setDisableLogin] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [alertType, setAlertType] = useState('');
    const [refreshSpin, setRefreshSpin] = useState(false);
    const [captchaError, setCaptchaError] = useState('Please enter the captcha.');
    const [errors, setErrors] = useState({ applicationNo: false, password: false, captcha: false });

    const canvasRef = useRef(null);
    const appNoRef = useRef(null);
    const passwordRef = useRef(null);
    const captchaInputRef = useRef(null);
    const captchaCodeRef = useRef('');

    /* ---------- captcha (PROTOTYPE – the server must verify it in production) ---------- */
    const drawCaptcha = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dpr = window.devicePixelRatio || 1;
        const w = 116;
        const h = 40;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const rnd = (a, b) => a + Math.random() * (b - a);

        ctx.fillStyle = '#eef3fa';
        ctx.fillRect(0, 0, w, h);

        for (let i = 0;i < 5;i++) {
            ctx.strokeStyle = `rgba(29,67,120,${rnd(0.15, 0.35)})`;
            ctx.lineWidth = rnd(0.8, 1.6);
            ctx.beginPath();
            ctx.moveTo(rnd(0, w), rnd(0, h));
            ctx.lineTo(rnd(0, w), rnd(0, h));
            ctx.stroke();
        }

        let code = '';
        for (let j = 0;j < 5;j++) {
            const ch = CAPTCHA_CHARS.charAt(Math.floor(Math.random() * CAPTCHA_CHARS.length));
            code += ch;
            ctx.save();
            ctx.translate(13 + j * 21.5, h / 2 + rnd(-3, 3));
            ctx.rotate(rnd(-0.35, 0.35));
            ctx.font = `700 ${Math.round(rnd(18, 22))}px 'Segoe UI', Arial, sans-serif`;
            ctx.fillStyle = ['#0c2340', '#13315c', '#1d4378', '#d97706'][Math.floor(Math.random() * 4)];
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.fillText(ch, 0, 0);
            ctx.restore();
        }
        captchaCodeRef.current = code;

        for (let k = 0;k < 30;k++) {
            ctx.fillStyle = `rgba(19,49,92,${rnd(0.15, 0.4)})`;
            ctx.fillRect(rnd(0, w), rnd(0, h), 1.5, 1.5);
        }
    }, []);

    /* ---------- start-up ---------- */
    useEffect(() => {
        drawCaptcha();

        // desktop only: put the cursor in the first field (no keyboard pop-up on phones)
        if (window.matchMedia && window.matchMedia('(pointer:fine)').matches && appNoRef.current) {
            appNoRef.current.focus({ preventScroll: true });
        }

        // returning with the browser Back button: reset button + captcha
        const onPageShow = () => {
            setLoading(false);
            setDisableLogin(false);
            setCaptcha('');
            drawCaptcha();
        };
        window.addEventListener('pageshow', onPageShow);
        return () => window.removeEventListener('pageshow', onPageShow);
    }, [drawCaptcha]);

    /* ---------- handlers ---------- */
    const clearError = (name, value) => {
        if (value.trim() !== '') setErrors((p) => ({ ...p, [name]: false }));
    };

    const refreshCaptcha = () => {
        drawCaptcha();
        setCaptcha('');
        setRefreshSpin((p) => !p);
        setErrors((p) => ({ ...p, captcha: false }));
        if (captchaInputRef.current) captchaInputRef.current.focus();
    };

    const checkCaps = (e) => {
        if (e.getModifierState) setCapsLock(e.getModifierState('CapsLock'));
    };


    const handleSubmit = async (e) => {
        console.log("login called");
        e.preventDefault();

        const bad = {
            applicationNo: applicationNo.trim() === '',
            password: password.trim() === '',
            captcha: captcha.trim() === ''
        };

        setCaptchaError('Please enter the captcha.');
        setErrors(bad);

        // 1. Empty-field validation
        if (bad.applicationNo || bad.password || bad.captcha) {

            if (bad.applicationNo && appNoRef.current)
                appNoRef.current.focus();

            else if (bad.password && passwordRef.current)
                passwordRef.current.focus();

            else if (captchaInputRef.current)
                captchaInputRef.current.focus();

            return;
        }

        // 2. Captcha validation (prototype only)
        if (captcha.trim().toUpperCase() !== captchaCodeRef.current) {

            setCaptchaError('Captcha does not match. Please try the new one.');

            setErrors((p) => ({
                ...p,
                captcha: true
            }));

            drawCaptcha();
            setCaptcha('');

            if (captchaInputRef.current)
                captchaInputRef.current.focus();

            return;
        }

        // 3. Login API call
        try {

            setLoading(true);
            setDisableLogin(true);
            setLoginError('');

            const response = await fetch(`${API_BASE_URL}/api/registrationlogin/checkLogin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    applicationNo: applicationNo.trim(),
                    password: password,
                    captcha: captcha.trim()
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Store JWT Token
                sessionStorage.setItem("token", data.token);
                setAlertType('success');
                setLoginError(data.message || 'Login successful!');
                setShowAlert(true);

                console.log('Login successful:', data);

                setTimeout(() => {
                    navigate('/slrc/dashboard');
                }, 1000);

            } else {

                setAlertType('error');
                setLoginError(data.message || 'Invalid Application No. / Mobile No. or Password.');
                setShowAlert(true);

            }

        } catch (error) {

            console.error('Login error:', error);

            setAlertType('error');
            setLoginError('Unable to connect to server. Please try again.');
            setShowAlert(true);

        } finally {

            setLoading(false);
            setDisableLogin(false);

        }

    };

    const [showAlert, setShowAlert] = useState(false);
    useEffect(() => {

        if (showAlert) {

            const timer = setTimeout(() => {
                setShowAlert(false);
                setLoginError('');
                setAlertType('');
            }, 2000);

            return () => clearTimeout(timer);
        }

    }, [showAlert]);

    return (
        <>
            <Header />

            <div className="seba-app">
                <style>{BASE_CSS}</style>
                <style>{LOGIN_CSS}</style>

                <main className="login-page" id="main" tabIndex={-1}>
                    <div className="login-wrap">

                        <div className="login-card" id="loginCard">

                            {/* ===================== LEFT: LOGIN FORM ===================== */}
                            <section className="login-main" aria-labelledby="loginHeading">
                                <div className="login-head">
                                    <h1 id="loginHeading"><Icon name="i-login" />LOGIN</h1>
                                    <span className="login-head__tag">Candidate Login</span>
                                </div>

                                <form
                                    className="login-form"
                                    id="loginForm"
                                    action={action}
                                    method="post"
                                    noValidate
                                    autoComplete="on"
                                    onSubmit={handleSubmit}
                                >
                                    {/* server error message */}
                                    <div className="alert alert--error" role="alert" hidden={!serverError}>
                                        <Icon name="i-alert" />
                                        <div>
                                            <strong>Login failed</strong>
                                            <span>{serverError || 'Please check your Application No and Password.'}</span>
                                        </div>
                                    </div>

                                    <div className="form-row">

                                        {/* ---------- Application No ---------- */}
                                        <div className={`field ${errors.applicationNo ? 'is-invalid' : ''}`}>
                                            <label htmlFor="applicationNo">Application No. / Mobile No.</label>

                                            <div className="field__control">
                                                <input
                                                    ref={appNoRef}
                                                    className="input"
                                                    type="text"
                                                    id="applicationNo"
                                                    name="application_no"
                                                    placeholder="APPLICATION NO. / MOBILE NO."
                                                    autoComplete="off"
                                                    spellCheck={false}
                                                    autoCapitalize="characters"
                                                    required
                                                    aria-describedby="appNoError"
                                                    aria-invalid={!!errors.applicationNo}
                                                    value={applicationNo}
                                                    onChange={(e) => {
                                                        setApplicationNo(e.target.value);
                                                        clearError('applicationNo', e.target.value);
                                                    }}
                                                />

                                                <Icon name="i-id" className="field__icon" />
                                            </div>

                                            <p className="field__error" id="appNoError">
                                                <Icon name="i-alert" />
                                                <span>Please enter your Application No. or Mobile No.</span>
                                            </p>
                                        </div>

                                        {/* ---------- Password ---------- */}
                                        <div className={`field field--password ${errors.password ? 'is-invalid' : ''}`}>
                                            <div className="field__top">
                                                <label htmlFor="password">Password</label>
                                                {/* TODO: put the real "Forgot password?" URL here */}
                                                <a className="forgot" href="/forgot-password">Forgot password?</a>
                                            </div>
                                            <div className="field__control">
                                                <input
                                                    ref={passwordRef}
                                                    className="input"
                                                    type={showPassword ? 'text' : 'password'}
                                                    id="password"
                                                    name="password"
                                                    placeholder="PASSWORD"
                                                    autoComplete="current-password"
                                                    required
                                                    aria-describedby="pwError capsWarn"
                                                    aria-invalid={errors.password}
                                                    value={password}
                                                    onChange={(e) => { setPassword(e.target.value); clearError('password', e.target.value); }}
                                                    onKeyDown={checkCaps}
                                                    onKeyUp={checkCaps}
                                                    onBlur={() => setCapsLock(false)}
                                                />
                                                <Icon name="i-lock" className="field__icon" />
                                                <button
                                                    className="pw-toggle"
                                                    type="button"
                                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                                    aria-pressed={showPassword}
                                                    onClick={() => {
                                                        setShowPassword((p) => !p);
                                                        if (passwordRef.current) passwordRef.current.focus();
                                                    }}
                                                >
                                                    <Icon name={showPassword ? 'i-eye-off' : 'i-eye'} />
                                                </button>
                                            </div>
                                            <p className="field__error" id="pwError">
                                                <Icon name="i-alert" /><span>Please enter your Password.</span>
                                            </p>
                                            <p className={`caps-warn ${capsLock ? 'is-visible' : ''}`} id="capsWarn" aria-live="polite">
                                                <Icon name="i-warn" /><span>Caps Lock is on</span>
                                            </p>
                                        </div>

                                    </div>

                                    {/* ---------- Captcha ---------- */}
                                    <div className={`field ${errors.captcha ? 'is-invalid' : ''}`}>
                                        <label htmlFor="captcha">Captcha</label>
                                        <div className="captcha">
                                            <div className="captcha__box">
                                                <canvas
                                                    ref={canvasRef}
                                                    width="116"
                                                    height="40"
                                                    role="img"
                                                    aria-label="Captcha image. Use refresh for a new one."
                                                />
                                                <button
                                                    className={`captcha__refresh ${refreshSpin ? 'is-spinning' : ''}`}
                                                    type="button"
                                                    aria-label="Get a new captcha"
                                                    onClick={refreshCaptcha}
                                                >
                                                    <Icon name="i-refresh" />
                                                </button>
                                            </div>
                                            <div className="field__control">
                                                <input
                                                    ref={captchaInputRef}
                                                    className="input"
                                                    type="text"
                                                    id="captcha"
                                                    name="captcha"
                                                    placeholder="Enter captcha"
                                                    autoComplete="off"
                                                    autoCapitalize="characters"
                                                    spellCheck={false}
                                                    maxLength={6}
                                                    required
                                                    aria-describedby="captchaError"
                                                    aria-invalid={errors.captcha}
                                                    value={captcha}
                                                    onChange={(e) => { setCaptcha(e.target.value); clearError('captcha', e.target.value); }}
                                                />
                                                <Icon name="i-shield" className="field__icon" />
                                            </div>
                                        </div>
                                        <p className="field__error" id="captchaError">
                                            <Icon name="i-alert" /><span>{captchaError}</span>
                                        </p>
                                    </div>

                                    {/* ---------- Login button ---------- */}
                                    <button
                                        type="submit"
                                        className={`btn btn--primary btn--block ${loading ? 'is-loading' : ''}`}
                                        disabled={disableLogin}
                                        aria-busy={loading}
                                    >
                                        <span className="spinner" aria-hidden="true" />
                                        <Icon name="i-login" className="btn__icon" />
                                        <span className="btn__label">{loading ? 'Logging in…' : 'Login'}</span>
                                    </button>

                                    {/* ---------- Sign up ---------- */}
                                    <div className="signup">
                                        <p><strong>New candidate?</strong> Not registered yet? Sign up to apply.</p>
                                        <a className="btn btn--secondary btn--sm" href="/slrc/register">
                                            <Icon name="i-user-plus" />Sign Up
                                        </a>
                                    </div>
                                </form>
                            </section>

                            {/* ===================== RIGHT: HELP PANEL ===================== */}
                            <aside className="login-aside" aria-label="How to log in">
                                <h2>How to log in</h2>
                                <ol>
                                    <li>Enter your Application No</li>
                                    <li>Enter your Password and the captcha</li>
                                    <li>Click Login to continue</li>
                                </ol>
                                <div className="login-aside__help">
                                    <p>Need help?</p>
                                    <a href="/instructions"><Icon name="i-book" />Instructions<Icon name="i-chev-right" /></a>
                                    <a href="/faq"><Icon name="i-help" />Frequently Asked Questions<Icon name="i-chev-right" /></a>
                                    <a href="/contact"><Icon name="i-phone" />Contact Us<Icon name="i-chev-right" /></a>
                                </div>
                            </aside>
                        </div>

                        <p className="secure-note">
                            <Icon name="i-shield" />Never share your password with anyone.
                        </p>
                    </div>
                </main>
            </div>
            {showAlert && loginError && (
                <div className={`custom-alert custom-alert--${alertType}`} role="alert">

                    <div className="custom-alert__icon">
                        <Icon name={alertType === 'success' ? 'i-check-circle' : 'i-alert'} />
                    </div>

                    <div className="custom-alert__content">
                        <strong>
                            {alertType === 'success' ? 'Success!' : 'Login Failed!'}
                        </strong>

                        <span>{loginError}</span>
                    </div>

                    <button
                        type="button"
                        className="custom-alert__close"
                        onClick={() => {
                            setShowAlert(false);
                            setLoginError('');
                            setAlertType('');
                        }}
                        aria-label="Close alert"
                    >
                        <Icon name="i-x" />
                    </button>

                </div>
            )}
            <Footer />
        </>
    );
}

export default Login;
