import React, { useState , useEffect } from 'react';

function Application() {
    const [currentStep, setCurrentStep] = useState(1);

    const steps = [
        { number: 1, title: 'Personal Information', subtitle: 'Candidate details' },
        { number: 2, title: 'Examination & Qualification', subtitle: 'Exam details' },
        { number: 3, title: 'Upload & Declaration', subtitle: 'Final submission' }
    ];

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
	
	useEffect(() => {

	    const elements = document.querySelectorAll(
	        '.application-container .reg-step__head, .application-container .reg-panel'
	    );

	    const observers = [];

	    elements.forEach((element) => {

	        const isPanel = element.classList.contains('reg-panel');

	        const animationClass = isPanel
	            ? 'reg-panel-animate'
	            : 'reg-step-head-animate';

	        // Initial animation
	        element.classList.remove(animationClass);
	        void element.offsetWidth;
	        element.classList.add(animationClass);

	        let firstCheck = true;
	        let hasLeft = false;

	        const observer = new IntersectionObserver(([entry]) => {

	            if (firstCheck) {
	                firstCheck = false;
	                hasLeft = !entry.isIntersecting;
	                return;
	            }

	            if (!entry.isIntersecting) {
	                hasLeft = true;
	            } else if (hasLeft) {

	                // Replay animation on scroll
	                element.classList.remove(animationClass);
	                void element.offsetWidth;
	                element.classList.add(animationClass);

	                hasLeft = false;
	            }

	        }, {
	            threshold: 0.1
	        });

	        observer.observe(element);
	        observers.push(observer);

	    });

	    return () => {
	        observers.forEach(observer => observer.disconnect());
	    };

	}, [currentStep]);
	    return (
        <>
            <style>{`

                .application-container {
                    width: 90%;
                    margin: 22px auto 35px;
                    color: #26364a;
                    font-family: Arial, sans-serif;
                }

                /* STEP PROGRESS */

                .application-container .reg-stepper {
                    background: #ffffff;
                    border: 1px solid #dce3ec;
                    border-radius: 12px;
                    padding: 17px 20px;
                    margin-bottom: 25px;
                    box-shadow: 0 3px 12px rgba(20, 45, 75, .06);
                }

                .application-container .reg-stepper ol {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 15px;
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .application-container .reg-stepper li {
                    flex: 1;
                    min-width: 0;
                    position: relative;
                }

                .application-container .reg-stepper li button {
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    width: 100%;
                    border: none;
                    background: transparent;
                    padding: 7px;
                    text-align: left;
                    cursor: default;
                    color: #8993a3;
                }

                .application-container .reg-stepper li.is-clickable button {
                    cursor: pointer;
                }

                .application-container .reg-stepper__num {
                    width: 38px;
                    height: 38px;
                    min-width: 38px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    border: 2px solid #cbd5e1;
                    font-size: 14px;
                    font-weight: 700;
                    color: #64748b;
                    background: #ffffff;
                    transition: all .25s ease;
                }

                .application-container .reg-stepper__txt {
                    font-size: 13px;
                    font-weight: 700;
                    color: #667085;
                    line-height: 1.4;
                }

                .application-container .reg-stepper__txt small {
                    display: block;
                    margin-top: 3px;
                    font-size: 11px;
                    font-weight: 400;
                    color: #98a2b3;
                }

                .application-container .reg-stepper li.is-active .reg-stepper__num {
                    background: #173f70;
                    border-color: #173f70;
                    color: #ffffff;
                    box-shadow: 0 0 0 4px rgba(23, 63, 112, .10);
                }

                .application-container .reg-stepper li.is-active .reg-stepper__txt {
                    color: #173f70;
                }

                .application-container .reg-stepper li.is-done .reg-stepper__num {
                    background: #198754;
                    border-color: #198754;
                    color: #ffffff;
                }

                .application-container .reg-stepper li.is-done .reg-stepper__txt {
                    color: #198754;
                }

                .application-container .reg-stepper li.is-clickable .reg-stepper__txt {
                    cursor: pointer;
                }

                /* STEP HEADING */

				@keyframes reg-step-head-fade {
				    from {
				        opacity: 0;
				        transform: translateY(6px);
				    }
				    to {
				        opacity: 1;
				        transform: translateY(0);
				    }
				}

				.application-container .reg-step__head {
				    margin: 20px 0 17px;
				}

				.application-container .reg-step__head.reg-step-head-animate {
				    animation: reg-step-head-fade .6s ease-out both;
				}

				@media (prefers-reduced-motion: reduce) {
				    .application-container .reg-step__head {
				        animation: none !important;
				    }
				}
				
				@keyframes regStepHeadAnimation {
				    from {
				        opacity: 0;
				        transform: translateY(10px);
				    }
				    to {
				        opacity: 1;
				        transform: translateY(0);
				    }
				}

				.application-container .reg-step__head.reg-step-head-animate {
				    animation: regStepHeadAnimation 0.6s ease-out forwards;
				}
				
				@keyframes reg-panel-fade {
				    from {
				        opacity: 0;
				        transform: translateY(8px);
				    }
				    to {
				        opacity: 1;
				        transform: translateY(0);
				    }
				}

				.reg-panel.reg-panel-animate {
				    animation: reg-panel-fade 0.6s ease-out both;
				}

				@media (prefers-reduced-motion: reduce) {
				    .reg-panel {
				        animation: none !important;
				    }
				}

                .application-container .reg-step__count {
                    color: #198754;
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin: 0 0 7px;
                }

                .application-container .reg-step__head h2 {
                    color: #17365d;
                    font-size: 24px;
                    font-weight: 700;
                    margin: 0;
                }

                /* FORM PANEL */

                .application-container .reg-panel {
                    background: #ffffff;
                    border: 1px solid #dce3ec;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 3px 12px rgba(20, 45, 75, .05);
                }

                .application-container .reg-panel__head {
                    background: #f5f8fc;
                    border-bottom: 1px solid #e1e7ef;
                    padding: 15px 20px;
                }

                .application-container .reg-panel__head h3 {
                    margin: 0;
                    color: #17365d;
                    font-size: 16px;
                    font-weight: 700;
                }

                .application-container .reg-panel__body {
                    padding: 23px 20px;
                }

                /* FORM FIELDS */

                .application-container .reg-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 20px;
                }

                .application-container .reg-field {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    min-width: 0;
                }

                .application-container .reg-field label {
                    font-size: 13px;
                    font-weight: 600;
                    color: #344054;
                }

                .application-container .reg-req {
                    color: #dc3545;
                    font-weight: 700;
                }
				.application-container .reg-optional {
				    color: #2878bd;
				    font-size: 11px;
				    font-weight: 600;
				    font-style: normal;
				    margin-left: 6px;
				    white-space: nowrap;
				}
                .application-container .reg-input {
                    width: 100%;
                    box-sizing: border-box;
                    min-height: 42px;
                    padding: 9px 12px;
                    border: 1px solid #cbd5e1;
                    border-radius: 6px;
                    background: #ffffff;
                    color: #26364a;
                    font-size: 14px;
                    outline: none;
                    transition: border-color .2s, box-shadow .2s;
                }

                .application-container .reg-input:focus {
                    border-color: #2878bd;
                    box-shadow: 0 0 0 3px rgba(40, 120, 189, .12);
                }

                /* ALERT */

                .application-container .reg-alert {
                    padding: 14px 16px;
                    border-radius: 7px;
                    font-size: 13px;
                    line-height: 1.5;
                }

                .application-container .reg-alert--ready {
                    background: #eef7ff;
                    border: 1px solid #c9e2fa;
                    color: #24577d;
                }

                /* STEP NAVIGATION */

                .application-container .reg-stepnav {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 15px;
                    margin-top: 20px;
                }

                .application-container .reg-stepnav__note {
                    color: #667085;
                    font-size: 13px;
                    margin: 0;
                }

                .application-container .reg-stepnav__end {
                    margin-left: auto;
                }

                .application-container .reg-btn {
                    min-width: 105px;
                    padding: 10px 19px;
                    border: 1px solid #cbd5e1;
                    border-radius: 6px;
                    background: #ffffff;
                    color: #344054;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all .2s ease;
                }

                .application-container .reg-btn:hover {
                    background: #f1f5f9;
                    border-color: #94a3b8;
                }

                .application-container .reg-btn--primary {
                    background: #173f70;
                    color: #ffffff;
                    border-color: #173f70;
                }

                .application-container .reg-btn--primary:hover {
                    background: #0f2e55;
                    border-color: #0f2e55;
                }

                /* RESPONSIVE */

                @media (max-width: 900px) {
                    .application-container {
                        width: 94%;
                    }

                    .application-container .reg-grid {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }
                }

                @media (max-width: 600px) {
                    .application-container {
                        width: 95%;
                    }

                    .application-container .reg-stepper ol {
                        flex-direction: column;
                        align-items: stretch;
                        gap: 10px;
                    }

                    .application-container .reg-stepper li {
                        width: 100%;
                    }

                    .application-container .reg-grid {
                        grid-template-columns: 1fr;
                    }

                    .application-container .reg-step__head h2 {
                        font-size: 20px;
                    }

                    .application-container .reg-panel__body {
                        padding: 16px;
                    }

                    .application-container .reg-stepnav {
                        flex-wrap: wrap;
                    }
                }
				/* STEP HEADING ANIMATION */

				@keyframes reg-step-head-fade {
				    from {
				        opacity: 0;
				        transform: translateY(8px);
				    }
				    to {
				        opacity: 1;
				        transform: translateY(0);
				    }
				}

				.application-container .reg-step__head {
				    margin: 20px 0 17px;
				}

				.application-container .reg-step__head.reg-step-head-animate {
				    animation: reg-step-head-fade 0.6s ease-out both;
				}


				/* FORM PANEL ANIMATION */

				@keyframes reg-panel-fade {
				    from {
				        opacity: 0;
				        transform: translateY(8px);
				    }
				    to {
				        opacity: 1;
				        transform: translateY(0);
				    }
				}

				.application-container .reg-panel.reg-panel-animate {
				    animation: reg-panel-fade 0.6s ease-out both;
				}


				/* REDUCED MOTION */

				@media (prefers-reduced-motion: reduce) {
				    .application-container .reg-step__head,
				    .application-container .reg-panel {
				        animation: none !important;
				    }
				}

            `}</style>

            <div className="application-container">

                {/* APPLICATION STEPPER */}

                <nav className="reg-stepper" aria-label="Application steps">
                    <ol>
                        {steps.map((step) => (
                            <li
                                key={step.number}
                                className={`
                                    ${currentStep === step.number ? 'is-active' : ''}
                                    ${currentStep > step.number ? 'is-done is-clickable' : ''}
                                `}
                            >
                                <button
                                    type="button"
                                    aria-current={
                                        currentStep === step.number ? 'step' : undefined
                                    }
                                    onClick={() => {
                                        if (step.number < currentStep) {
                                            setCurrentStep(step.number);
                                            window.scrollTo({
                                                top: 0,
                                                behavior: 'smooth'
                                            });
                                        }
                                    }}
                                >
                                    <span className="reg-stepper__num">
                                        {step.number}
                                    </span>

                                    <span className="reg-stepper__txt">
                                        {step.title}
                                        <small>{step.subtitle}</small>
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ol>
                </nav>

                {/* STEP 1: PERSONAL INFORMATION */}

                {currentStep === 1 && (
                    <section className="reg-step">

                        <div className="reg-step__head">
                            <p className="reg-step__count">STEP 01</p>
                            <h2>Personal Information</h2>
                        </div>

                        <section className="reg-panel">

                            <div className="reg-panel__head">
                                <h3>Applicant Details</h3>
                            </div>

                            <div className="reg-panel__body">

                                <div className="reg-grid">

                                    <div className="reg-field">
                                        <label>
                                            Applicant Full Name<span className="reg-req">*</span>
                                        </label>

                                        <input
                                            type="text"
                                            className="reg-input"
                                            name="fullName"
                                            placeholder="Enter full name"
                                            autocomplete="off"
                                        />
                                    </div>

                                    <div className="reg-field">
                                        <label>
                                            Date of Birth <span className="reg-req">*</span>
                                        </label>

                                        <input
                                            type="date"
                                            className="reg-input"
                                            name="dob"
                                        />
                                    </div>

                                    <div className="reg-field">
                                        <label>
                                            Gender <span className="reg-req">*</span>
                                        </label>

                                        <select
                                            className="reg-input"
                                            name="gender"
                                            defaultValue=""
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div className="reg-field">
                                        <label>
                                            Name of Father/ Guardian of the Applicant <span className="reg-req">*</span>
                                        </label>

                                        <input
                                            type="text"
                                            className="reg-input"
                                            name="fatherguardianname"
                                            placeholder="Enter Father/ Guardian name"
                                            autocomplete="off"
                                        />
                                    </div>

                                    <div className="reg-field">
                                        <label>
                                            Name of Spouse of the Applicant <span className="reg-optional">(optional)</span>
                                        </label>

                                        <input
                                            type="text"
                                            className="reg-input"
                                            name="spousename"
                                            placeholder="Enter Spouse name"
                                            autocomplete="off"
                                        />
                                    </div>

                                    <div className="reg-field">
                                        <label>
                                            Name of Mother of the Applicant <span className="reg-req">*</span>
                                        </label>

                                        <input
                                            type="text"
                                            className="reg-input"
                                            name="mothername"
                                            placeholder="Enter Mother name"
                                            autocomplete="off"
                                        />
                                    </div>



                                </div>



                            </div>
                        </section>

                        <div className="reg-stepnav">

                            <p className="reg-stepnav__note">
                                Please provide your personal information.
                            </p>

                            <div className="reg-stepnav__end">
                                <button
                                    type="button"
                                    className="reg-btn reg-btn--primary"
                                    onClick={handleNext}
                                >
                                    Next →
                                </button>
                            </div>

                        </div>

                    </section>
                )}

                {/* STEP 2: EXAMINATION & QUALIFICATION */}

                {currentStep === 2 && (
                    <section className="reg-step">

                        <div className="reg-step__head">
                            <p className="reg-step__count">STEP 02</p>
                            <h2>Examination &amp; Qualification</h2>
                        </div>

                        <section className="reg-panel">

                            <div className="reg-panel__head">
                                <h3>Examination Details</h3>
                            </div>

                            <div className="reg-panel__body">
                                <div className="reg-alert reg-alert--ready">
                                    Examination and qualification fields will be added here.
                                </div>
                            </div>

                        </section>

                        <div className="reg-stepnav">

                            <button
                                type="button"
                                className="reg-btn"
                                onClick={handleBack}
                            >
                                ← Back
                            </button>

                            <div className="reg-stepnav__end">
                                <button
                                    type="button"
                                    className="reg-btn reg-btn--primary"
                                    onClick={handleNext}
                                >
                                    Next →
                                </button>
                            </div>

                        </div>

                    </section>
                )}

                {/* STEP 3: UPLOAD & DECLARATION */}

                {currentStep === 3 && (
                    <section className="reg-step">

                        <div className="reg-step__head">
                            <p className="reg-step__count">STEP 03</p>
                            <h2>Upload Documents &amp; Declaration</h2>
                        </div>

                        <section className="reg-panel">

                            <div className="reg-panel__head">
                                <h3>Documents and Declaration</h3>
                            </div>

                            <div className="reg-panel__body">
                                <div className="reg-alert reg-alert--ready">
                                    Photograph, signature, preview and declaration
                                    fields will be added here.
                                </div>
                            </div>

                        </section>

                        <div className="reg-stepnav">

                            <button
                                type="button"
                                className="reg-btn"
                                onClick={handleBack}
                            >
                                ← Back
                            </button>

                        </div>

                    </section>
                )}

            </div>
        </>
    );
}

export default Application;
