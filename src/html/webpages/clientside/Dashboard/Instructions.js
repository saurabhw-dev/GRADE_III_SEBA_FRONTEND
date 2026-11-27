import React, { useState , useEffect } from 'react';

function Instructions({ onStart }) {
    const [accepted, setAccepted] = useState(false);
    const [showError, setShowError] = useState(false);

    const handleStart = () => {
        if (!accepted) {
            setShowError(true);
            return;
        }

        setShowError(false);

        if (onStart) {
            onStart();
        }
    };
	useEffect(() => {
	    const heading = document.querySelector('.reg-page-heading');
	    if (!heading) return;

	    let hasLeft = false;

	    const observer = new IntersectionObserver(([entry]) => {
	        if (!entry.isIntersecting) {
	            hasLeft = true;
	        } else if (hasLeft) {
	            heading.classList.remove('reg-heading-visible');
	            void heading.offsetWidth;
	            heading.classList.add('reg-heading-visible');
	            hasLeft = false;
	        }
	    }, {
	        threshold: 0.1
	    });

	    observer.observe(heading);

	    return () => observer.disconnect();
	}, []);
    return (
        <>
            <style>{`
				/* ---------- Online Application Page Heading ---------- */

				.reg-page-heading {
				    width: 90%;
				    margin: 22px auto 16px;
				    display: flex;
				    align-items: flex-end;
				    justify-content: space-between;
				    flex-wrap: wrap;
				    gap: 16px;
				    padding-bottom: 15px;
				    border-bottom: 1px solid #dce3ed;
				}

				.reg-page-heading__content {
				    position: relative;
				    padding-left: 13px;
				}

				.reg-page-heading__content::before {
				    content: "";
				    position: absolute;
				    left: 0;
				    top: 3px;
				    width: 5px;
				    height: 42px;
				    border-radius: 5px;
				    background: linear-gradient(
				        to bottom,
				        #f5a623 0%,
				        #ffffff 50%,
				        #198754 100%
				    );
				}

				.reg-page-heading__content h1 {
				    margin: 0;
				    color: #102d50;
				    font-size: 27px;
				    font-weight: 750;
				    line-height: 1.3;
				    letter-spacing: -.45px;
				}

				.reg-page-heading__content p {
				    margin: 5px 0 0;
				    color: #64748b;
				    font-size: 13.5px;
				    line-height: 1.5;
				}

				.reg-page-heading__content p span {
				    color: #dc3545;
				    font-weight: 700;
				}

				.reg-page-heading__info {
				    display: flex;
				    align-items: center;
				    justify-content: flex-end;
				    flex-wrap: wrap;
				    gap: 8px;
				}

				.reg-page-heading__info span {
				    display: inline-flex;
				    align-items: center;
				    gap: 7px;
				    padding: 8px 13px;
				    border: 1px solid #d8e1ed;
				    border-radius: 30px;
				    background: #ffffff;
				    color: #244b78;
				    font-size: 12px;
				    font-weight: 600;
				    white-space: nowrap;
				    box-shadow: 0 2px 5px rgba(16, 40, 75, .035);
				    transition: all .2s ease;
				}

				.reg-page-heading__info span:hover {
				    border-color: #9eb6d2;
				    background: #f4f8fc;
				    transform: translateY(-2px);
				}

				@media (max-width: 900px) {
				    .reg-page-heading__info {
				        justify-content: flex-start;
				    }
				}

				@media (max-width: 600px) {
				    .reg-page-heading {
				        width: 95%;
				        margin: 18px auto 14px;
				        align-items: flex-start;
				    }

				    .reg-page-heading__content h1 {
				        font-size: 22px;
				    }

				    .reg-page-heading__info {
				        gap: 6px;
				    }

				    .reg-page-heading__info span {
				        padding: 7px 10px;
				        font-size: 11px;
				    }
				}
				@keyframes reg-heading-fade {
				    from {
				        opacity: 0;
				        transform: translateY(6px);
				    }
				    to {
				        opacity: 1;
				        transform: translateY(0);
				    }
				}

				.reg-page-heading {
				    animation: reg-heading-fade .6s ease-out both;
				}

				.reg-page-heading.reg-heading-visible {
				    animation: reg-heading-fade .6s ease-out both;
				}

				@media (prefers-reduced-motion: reduce) {
				    .reg-page-heading {
				        animation: none !important;
				    }
				}
				.reg-instr {
				    --surface: #ffffff;
				    --surface-2: #f7f9fc;
				    --border: #dce2ea;
				    --radius: 9px;
				    --radius-sm: 6px;
				    --shadow-sm: 0 2px 6px rgba(16,24,40,.06);
				    --navy-900: #17365d;
				    --navy-800: #244b78;
				    --navy-700: #315f91;
				    --navy-50: #eaf1f8;
				    --text-2: #667085;
				    --text-3: #7b8492;
				    --saffron-500: #e9a23b;
				    --saffron-50: #fff7e8;
				    --red-50: #fff1f0;
				    --red-600: #c93636;

				    position: relative;
				    width: 90%;
				    margin: 20px auto;
				    background: var(--surface);
				    border: 1px solid var(--border);
				    border-radius: var(--radius);
				    box-shadow: 0 10px 28px -12px rgba(16,24,40,.25), var(--shadow-sm);
				    color: #344054;
				    box-sizing: border-box;

				    animation: instructionsEnter .65s cubic-bezier(.22, 1, .36, 1) both;
				    transform-origin: top center;
				}

				@keyframes instructionsEnter {
				    from {
				        opacity: 0;
				        transform: translateY(25px) scale(.98);
				    }
				    to {
				        opacity: 1;
				        transform: translateY(0) scale(1);
				    }
				}

                .reg-instr *,
                .reg-instr *::before,
                .reg-instr *::after {
                    box-sizing: border-box;
                }

                .reg-instr__head {
                    padding: 18px 24px 14px;
                    border-bottom: 1px solid var(--border);
                }

                .reg-instr__head h2 {
                    margin: 0;
                    font-size: 21px;
                    line-height: 1.3;
                    color: var(--navy-900);
                    font-weight: 700;
                }

                .reg-instr__head h2:focus {
                    outline: none;
                }

                .reg-instr__head p:last-child {
                    margin: 4px 0 0;
                    color: var(--text-2);
                    font-size: 14px;
                }

                .reg-step__count {
                    margin: 0 0 5px;
                    color: #b16b16;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: .07em;
                    text-transform: uppercase;
                }

                .reg-instr__body {
                    padding: 18px 24px 6px;
                }

                .reg-instr__facts {
                    display: grid;
                    grid-template-columns: repeat(4, minmax(0, 1fr));
                    gap: 10px;
                    margin-bottom: 14px;
                }

                .reg-fact {
                    display: flex;
                    gap: 10px;
                    align-items: flex-start;
                    padding: 12px;
                    border: 1px solid var(--border);
                    border-radius: var(--radius-sm);
                    background: var(--surface-2);
                    min-width: 0;
                }

                .reg-fact__icon {
                    display: grid;
                    place-items: center;
                    flex: none;
                    width: 34px;
                    height: 34px;
                    border-radius: 50%;
                    background: var(--navy-50);
                    color: var(--navy-800);
                }

                .reg-fact__icon svg {
                    width: 17px;
                    height: 17px;
                }

                .reg-fact small {
                    display: block;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: .06em;
                    text-transform: uppercase;
                    color: var(--text-3);
                }

                .reg-fact strong {
                    display: block;
                    font-size: 14.5px;
                    color: var(--navy-900);
                    line-height: 1.35;
                }

                .reg-fact strong a {
                    color: inherit;
                    text-decoration: none;
                }

                .reg-fact div span {
                    display: block;
                    font-size: 12.5px;
                    color: var(--text-2);
                }

                .reg-alert {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 13px 15px;
                    border: 1px solid #f0d59c;
                    border-radius: var(--radius-sm);
                    font-size: 13.5px;
                    line-height: 1.6;
                }

                .reg-alert > svg {
                    flex: none;
                    width: 20px;
                    height: 20px;
                    margin-top: 2px;
                }

                .reg-alert--warn {
                    background: var(--saffron-50);
                    color: #674714;
                }

                .reg-alert strong,
                .reg-alert span {
                    display: block;
                }

                .reg-alert strong {
                    margin-bottom: 3px;
                    color: #684512;
                }

                .reg-instr__group {
                    margin-top: 20px;
                }

                .reg-instr__group h3 {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin: 0;
                    font-size: 16px;
                    color: var(--navy-900);
                    font-weight: 700;
                }

                .reg-instr__group h3::before {
                    content: "";
                    flex: none;
                    width: 4px;
                    height: 18px;
                    border-radius: 2px;
                    background: var(--saffron-500);
                }

                .reg-instr__group h3 span {
                    padding: 1px 8px;
                    border-radius: 999px;
                    background: var(--navy-50);
                    color: var(--navy-800);
                    font-size: 12px;
                    font-weight: 600;
                }

                .reg-instr__list {
                    display: grid;
                    gap: 6px;
                    margin: 10px 0 0;
                    padding: 0;
                    list-style: none;
                }

                .reg-instr__list li {
                    display: flex;
                    gap: 12px;
                    align-items: flex-start;
                    padding: 10px 12px;
                    border-radius: var(--radius-sm);
                }

                .reg-instr__list li:nth-child(odd) {
                    background: var(--surface-2);
                }

                .reg-instr__list p {
                    margin: 0;
                    font-size: 14.5px;
                    line-height: 1.65;
                    color: #344054;
                }

                .reg-instr__list a {
                    color: var(--navy-700);
                    text-decoration: underline;
                }

                .reg-instr__num {
                    display: grid;
                    place-items: center;
                    flex: none;
                    width: 26px;
                    height: 26px;
                    margin-top: 1px;
                    border-radius: 50%;
                    background: var(--navy-50);
                    color: var(--navy-800);
                    font-size: 13px;
                    font-weight: 700;
                }

                .reg-instr__list li.reg-instr__key {
                    background: var(--saffron-50);
                }

                .reg-instr__key .reg-instr__num {
                    background: var(--saffron-500);
                    color: #1a1200;
                }

                .reg-instr__key mark {
                    background: #fde7b0;
                    color: inherit;
                    padding: 0 2px;
                }

                .reg-instr__list li.reg-instr__warn {
                    background: var(--red-50);
                }

                .reg-instr__warn .reg-instr__num {
                    background: var(--red-600);
                    color: #fff;
                }

                .reg-instr__accept {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px 20px;
                    margin-top: 18px;
                    padding: 16px 24px;
                    border-top: 1px solid var(--border);
                    background: var(--surface-2);
                    border-radius: 0 0 var(--radius) var(--radius);
                }

                .reg-instr__agree {
                    flex: 1 1 340px;
                }

                .reg-instr__agree .reg-check {
                    display: flex;
                    align-items: flex-start;
                    gap: 9px;
                    padding: 11px 12px;
                    background: #fff;
                    border: 1px solid var(--border);
                    border-radius: var(--radius-sm);
                    cursor: pointer;
                    font-size: 14px;
                    color: #344054;
                }

                .reg-instr__agree .reg-check input {
                    width: 16px;
                    height: 16px;
                    flex: none;
                    margin: 2px 0 0;
                    cursor: pointer;
                    accent-color: #287a43;
                }

                .reg-err {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin: 8px 0 0;
                    color: var(--red-600);
                    font-size: 13px;
                }

                .reg-err svg {
                    width: 16px;
                    height: 16px;
                    flex: none;
                }

                .reg-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 9px;
                    padding: 11px 22px;
                    border: none;
                    border-radius: 5px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background .2s ease, transform .2s ease;
                }

                .reg-btn--primary {
                    background: #287a43;
                    color: #fff;
                }

                .reg-btn--primary:hover {
                    background: #206537;
                }

                .reg-btn--primary:active {
                    transform: translateY(1px);
                }

                .reg-btn svg {
                    width: 17px;
                    height: 17px;
                }

                @media (max-width: 900px) {
                    .reg-instr__facts {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }
                }

                @media (max-width: 600px) {
                    .reg-instr__head,
                    .reg-instr__body {
                        padding-left: 14px;
                        padding-right: 14px;
                    }

                    .reg-instr__accept {
                        padding: 14px;
                    }

                    .reg-instr__accept .reg-btn {
                        width: 100%;
                    }

                    .reg-instr__list li {
                        gap: 8px;
                        padding: 9px 8px;
                    }

                    .reg-instr__list p {
                        font-size: 13.5px;
                    }
                }

                @media (max-width: 420px) {
                    .reg-instr__facts {
                        grid-template-columns: 1fr;
                    }
                }
				
            `}</style>
			
			<section className="reg-page-heading">
			    <div className="reg-page-heading__content">
			        <h1>Online Application Form</h1>
			        <p>Complete the 3 steps below. Fields marked <span>*</span> are mandatory.</p>
			    </div>

			    <div className="reg-page-heading__info">
			        <span>☷ 3 short steps</span>
			        <span>♧ Photo &amp; signature needed</span>
			        <span>▤ Preview before you register</span>
			    </div>
			</section>
            <section className="reg-instr" id="instrScreen" aria-labelledby="instrTitle">
                <div className="reg-instr__head">
                    <p className="reg-step__count">Before you start</p>
                    <h2 id="instrTitle" tabIndex="-1">Instructions to Applicants</h2>
                    <p>Please read all instructions carefully before filling in the Online Application Form.</p>
                </div>

                <div className="reg-instr__body" id="instrHome">
                    <div id="instrContent">

                        <div className="reg-instr__facts">

                            <div className="reg-fact">
                                <span className="reg-fact__icon"><svg aria-hidden="true"><use href="#i-pen" /></svg></span>
                                <div><small>Mode</small><strong>Online only</strong><span>No physical copy needed</span></div>
                            </div>

                            <div className="reg-fact">
                                <span className="reg-fact__icon"><svg aria-hidden="true"><use href="#i-upload" /></svg></span>
                                <div><small>Uploads (JPG/JPEG)</small><strong>Photo ≤ 35 KB</strong><span>Signature ≤ 30 KB</span></div>
                            </div>

                            <div className="reg-fact">
                                <span className="reg-fact__icon"><svg aria-hidden="true"><use href="#i-phone" /></svg></span>
                                <div><small>Technical helpline</small><strong><a href="tel:9582390056">9582390056</a></strong><span>Mon–Sat, 10 am – 5 pm</span></div>
                            </div>

                            <div className="reg-fact">
                                <span className="reg-fact__icon"><svg aria-hidden="true"><use href="#i-check" /></svg></span>
                                <div><small>Best viewed in</small><strong>Chrome or Firefox</strong><span>Use the latest version</span></div>
                            </div>

                        </div>

                        <div className="reg-alert reg-alert--warn" role="note">
                            <svg aria-hidden="true"><use href="#i-warn" /></svg>
                            <div>
                                <strong>Start here: complete the common registration first</strong>
                                <span>Register once in the portal before applying for Class III or Class IV posts. The same Registration ID can be used for Class III, Class IV, or both, as per your eligibility. See instruction 2.</span>
                            </div>
                        </div>

                        <section className="reg-instr__group" aria-labelledby="ig1">
                            <h3 id="ig1">Getting started <span>1–2</span></h3>
                            <ol className="reg-instr__list">
                                <li>
                                    <span className="reg-instr__num">1</span>
                                    <p>The Commission invites applications in online mode only. Candidates are required to log on to <a href="https://www.sebaonline.org" target="_blank" rel="noopener noreferrer">www.sebaonline.org</a> or <a href="https://assam.gov.in" target="_blank" rel="noopener noreferrer">assam.gov.in</a> to access the home page of the "ONLINE APPLICATIONS". Single Online application for each class of posts (i.e. Class-III and Class-IV) can be filled in and submitted in the prescribed web portal within the last date of submission of applications as mentioned in the Advertisement.</p>
                                </li>
                                <li className="reg-instr__key">
                                    <span className="reg-instr__num">2</span>
                                    <p><mark>As First step, a candidate has to do common registration in the portal before proceeding with filling of the online application of Class III posts Or Class IV posts.</mark> Candidate may register from either of the Class III or Class IV Website. For example - If a candidate registers for Class III Post then he/she need not register again for Class IV Post. Candidate may fill the application form with the same registration ID either for Class III posts or for Class IV posts or for both as per eligibility.</p>
                                </li>
                            </ol>
                        </section>

                        <section className="reg-instr__group" aria-labelledby="ig2">
                            <h3 id="ig2">Eligibility &amp; choosing posts <span>3–5</span></h3>
                            <ol className="reg-instr__list">
                                <li><span className="reg-instr__num">3</span><p>Before filling the online application form, an applicant has to identify the category of post/posts for which he/she is eligible. An applicant can submit for multiple category of post/posts as per his/her eligibility through online application form. For example, in respect of Class-III Posts, a candidate with minimum qualification specified in B, C or D can also apply for qualification specified in A, and a candidate with minimum qualification specified in C and D can also apply for qualification specified in A and B. Similarly, a candidate with minimum qualification specified in F can also apply for qualification specified in E.</p></li>
                                <li><span className="reg-instr__num">4</span><p>An applicant has to apply separately for Class III posts and for Class IV posts, if desires.</p></li>
                                <li><span className="reg-instr__num">5</span><p>The applicant has to clearly mention and fill <strong>'Yes'</strong> for the category of post/posts where he/she wants to apply and fill <strong>'No'</strong> against the category of post/posts where he/she does not want to apply or he/she is not eligible to apply.</p></li>
                            </ol>
                        </section>

                        <section className="reg-instr__group" aria-labelledby="ig3">
                            <h3 id="ig3">Filling the application form <span>6–9</span></h3>
                            <ol className="reg-instr__list">
                                <li><span className="reg-instr__num">6</span><p>Applicant must have the same valid mobile number throughout the process of recruitment. Authentication of mobile number by OTP will be done. This may be used for further correspondence too.</p></li>
                                <li><span className="reg-instr__num">7</span><p>The candidates are required to fill the online application form, which consists of personal information, choice of Examination centre, uploading signature and photograph.</p></li>
                                <li><span className="reg-instr__num">8</span><p><strong>Application Number</strong> and the <strong>Password</strong> will have to be used for further Login into the portal.</p></li>
                                <li><span className="reg-instr__num">9</span><p>Upload your scanned photograph and signature (size of photograph and signature should not be more than <strong>35 KB</strong> and <strong>30 KB</strong> respectively in 'jpeg' or 'jpg' format only).</p></li>
                            </ol>
                        </section>

                        <section className="reg-instr__group" aria-labelledby="ig4">
                            <h3 id="ig4">Before &amp; after you submit <span>10–13</span></h3>
                            <ol className="reg-instr__list">
                                <li className="reg-instr__warn"><span className="reg-instr__num">10</span><p>There is no provision to make changes in the application form after clicking 'Submit' button. Applicant has to <strong>Preview Application Form</strong> and <strong>verify</strong> all entries properly before clicking on 'Submit' button.</p></li>
                                <li><span className="reg-instr__num">11</span><p>Applicant need not send any physical copy of application form or any document to the Commission or its authorized agency.</p></li>
                                <li><span className="reg-instr__num">12</span><p>Applicants are advised to go through the detailed instructions given at the time of inviting of online applications by the Commission to ensure that their applications are not rejected.</p></li>
                                <li className="reg-instr__warn"><span className="reg-instr__num">13</span><p>If any inadvertent mistake is made by the applicant while filling the online application form, it cannot be corrected later. The Commission or its authorized agency shall not take any responsibility in such cases.</p></li>
                            </ol>
                        </section>

                        <section className="reg-instr__group" aria-labelledby="ig5">
                            <h3 id="ig5">Help &amp; support <span>14–15</span></h3>
                            <ol className="reg-instr__list">
                                <li><span className="reg-instr__num">14</span><p>Applicant may contact Helpline no. <strong><a href="tel:9582390056">9582390056</a></strong> [Monday to Saturday: 10.00 am to 05.00 pm] only for <strong>technical queries related to online application.</strong></p></li>
                                <li><span className="reg-instr__num">15</span><p>This application module is best viewed in Mozilla Firefox or Google Chrome.</p></li>
                            </ol>
                        </section>

                    </div>
                </div>

                <div className="reg-instr__accept">
                    <div className="reg-decl reg-instr__agree">
                        <label className="reg-check">
                            <input
                                type="checkbox"
                                id="instrAgree"
                                checked={accepted}
                                aria-describedby="instrErr"
                                onChange={(e) => {
                                    setAccepted(e.target.checked);
                                    setShowError(false);
                                }}
                            />
                            <span>
                                <strong>I have read and understood all the instructions</strong> given above.
                            </span>
                        </label>

                        {showError && (
                            <p className="reg-err" id="instrErr" role="alert">
                                <svg aria-hidden="true"><use href="#i-alert" /></svg>
                                Please tick this box to confirm you have read the instructions.
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        className="reg-btn reg-btn--primary"
                        id="instrStart"
                        onClick={handleStart}
                    >
                        Start Application
                        <svg aria-hidden="true"><use href="#i-right" /></svg>
                    </button>
                </div>

            </section>
        </>
    );
}

export default Instructions;
