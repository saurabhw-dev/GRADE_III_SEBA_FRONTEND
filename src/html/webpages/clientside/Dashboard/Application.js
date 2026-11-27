import React, { useState, useEffect } from 'react';

function Application() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isPresentAddressDifferent, setIsPresentAddressDifferent] = useState(false);

    //personal information
    const [fullName, setFullName] = useState('');
    const [fullNameError, setFullNameError] = useState('');
    const [dob, setDob] = useState('');
    const [dobError, setDobError] = useState('');
    const [gender, setGender] = useState('');
    const [genderError, setGenderError] = useState('');
    const [fatherGuardianName, setFatherGuardianName] = useState('');
    const [fatherGuardianError, setFatherGuardianError] = useState('');
    const [motherName, setMotherName] = useState('');
    const [motherNameError, setMotherNameError] = useState('');
    const [category, setCategory] = useState('');
    const [categoryError, setCategoryError] = useState('');
    const [nationality, setNationality] = useState('Indian');
    const [nationalityError, setNationalityError] = useState('');
    const [religion, setReligion] = useState('');
    const [religionError, setReligionError] = useState('');
    const [employmentExchangeNumber, setEmploymentExchangeNumber] = useState('');
    const [employmentExchangeError, setEmploymentExchangeError] = useState('');
    const [divyang, setDivyang] = useState('');
    const [divyangError, setDivyangError] = useState('');
    const [exServiceman, setExServiceman] = useState('');
    const [exServicemanError, setExServicemanError] = useState('');
    const [martyrFamily, setMartyrFamily] = useState('');
    const [martyrFamilyError, setMartyrFamilyError] = useState('');
    //address info
    const [permanentAddress1, setPermanentAddress1] = useState('');
    const [permanentAddress1Error, setPermanentAddress1Error] = useState('');
    const [permanentAddress2, setPermanentAddress2] = useState('');
    const [permanentAddress2Error, setPermanentAddress2Error] = useState('');
    const [permanentAddress3, setPermanentAddress3] = useState('');
    const [permanentAddress3Error, setPermanentAddress3Error] = useState('');
    const [permanentCity, setPermanentCity] = useState('');
    const [permanentCityError, setPermanentCityError] = useState('');
    const [permanentPoliceStation, setPermanentPoliceStation] = useState('');
    const [permanentPoliceStationError, setPermanentPoliceStationError] = useState('');
    const [permanentPin, setPermanentPin] = useState('');
    const [permanentPinError, setPermanentPinError] = useState('');
    const [permanentDistrict, setPermanentDistrict] = useState('');
    const [permanentDistrictError, setPermanentDistrictError] = useState('');
    const [presentAddress1, setPresentAddress1] = useState('');
    const [presentAddress1Error, setPresentAddress1Error] = useState('');
    const [presentAddress2, setPresentAddress2] = useState('');
    const [presentAddress2Error, setPresentAddress2Error] = useState('');
    const [presentAddress3, setPresentAddress3] = useState('');
    const [presentAddress3Error, setPresentAddress3Error] = useState('');
    const [presentCity, setPresentCity] = useState('');
    const [presentCityError, setPresentCityError] = useState('');
    const [presentPoliceStation, setPresentPoliceStation] = useState('');
    const [presentPoliceStationError, setPresentPoliceStationError] = useState('');
    const [presentDistrict, setPresentDistrict] = useState('');
    const [presentDistrictError, setPresentDistrictError] = useState('');
   
	//contact info
	const [mobileNumber, setMobileNumber] = useState('');
	const [mobileNumberError, setMobileNumberError] = useState('');
    const [presentPin, setPresentPin] = useState('');
    const [presentPinError, setPresentPinError] = useState('');
	const [email, setEmail] = useState('');
	const [emailError, setEmailError] = useState('');

    const steps = [
        { number: 1, title: 'Personal Information', subtitle: 'Candidate details' },
        { number: 2, title: 'Post & Education Qualification', subtitle: 'Exam details' },
        { number: 3, title: 'Upload & Declaration', subtitle: 'Final submission' }
    ];

    const handleNext = () => {

        if (currentStep === 1) {

            let isValid = true;

            if (!fullName.trim()) {
                setFullNameError('Please enter Applicant Full Name.');
                isValid = false;
            } else {
                setFullNameError('');
            }

            if (!dob) {
                setDobError('Please select Date of Birth.');
                isValid = false;
            } else {
                setDobError('');
            }

            if (!gender) {
                setGenderError('Please select Gender.');
                isValid = false;
            } else {
                setGenderError('');
            }

            if (!fatherGuardianName.trim()) {
                setFatherGuardianError('Please enter Name of Father/ Guardian.');
                isValid = false;
            } else {
                setFatherGuardianError('');
            }

            if (!motherName.trim()) {
                setMotherNameError('Please enter Name of Mother of the Applicant.');
                isValid = false;
            } else {
                setMotherNameError('');
            }

            if (!category) {
                setCategoryError('Please select Category.');
                isValid = false;
            } else {
                setCategoryError('');
            }

            if (!nationality) {
                setNationalityError('Please select Nationality.');
                isValid = false;
            }

            if (!religion) {
                setReligionError('Please select Religion.');
                isValid = false;
            }

            if (!employmentExchangeNumber.trim()) {
                setEmploymentExchangeError('Please enter Employment Exchange Registration Number.');
                isValid = false;
            }

            if (!divyang) {
                setDivyangError('Please select Yes or No for Divyang.');
                isValid = false;
            }

            if (!exServiceman) {
                setExServicemanError('Please select Ex-Serviceman status.');
                isValid = false;
            }
            if (!martyrFamily) {
                setMartyrFamilyError('Please select YES or NO.');
                isValid = false;
            }

            if (!permanentAddress1.trim()) {
                setPermanentAddress1Error('Please enter Permanent Address 1.');
                isValid = false;
            }

            if (!permanentAddress2.trim()) {
                setPermanentAddress2Error('Please enter Permanent Address 2.');
                isValid = false;
            }

            if (!permanentAddress3.trim()) {
                setPermanentAddress3Error('Please enter Permanent Address 3.');
                isValid = false;
            }

            if (!permanentCity.trim()) {
                setPermanentCityError('Please enter City / Village.');
                isValid = false;
            }

            if (!permanentPoliceStation.trim()) {
                setPermanentPoliceStationError('Please enter Police Station.');
                isValid = false;
            }

            if (!/^[0-9]{6}$/.test(permanentPin)) {
                setPermanentPinError('Please enter a valid 6-digit PIN.');
                isValid = false;
            }

            if (!permanentDistrict) {
                setPermanentDistrictError('Please select District.');
                isValid = false;
            }

            if (isPresentAddressDifferent) {

                if (!presentAddress2.trim()) {
                    setPresentAddress2Error('Please enter Present Address 2.');
                    isValid = false;
                }

                if (!presentAddress3.trim()) {
                    setPresentAddress3Error('Please enter Present Address 3.');
                    isValid = false;
                }

                if (!presentCity.trim()) {
                    setPresentCityError('Please enter Present City / Village.');
                    isValid = false;
                }

                if (!presentPoliceStation.trim()) {
                    setPresentPoliceStationError('Please enter Present Police Station.');
                    isValid = false;
                }

                if (!/^[0-9]{6}$/.test(presentPin)) {
                    setPresentPinError('Please enter a valid 6-digit PIN.');
                    isValid = false;
                }

                if (!presentDistrict.trim()) {
                    setPresentDistrictError('Please select Present District.');
                    isValid = false;
                }

            }
			
			if (!/^[6-9][0-9]{9}$/.test(mobileNumber)) {
			    setMobileNumberError('Please enter a valid 10-digit mobile number.');
			    isValid = false;
			}
			if (!email.trim()) {
			    setEmailError('Please enter Email Id.');
			    isValid = false;
			} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			    setEmailError('Please enter a valid Email Id.');
			    isValid = false;
			}
            if (!isValid) {
                return;
            }
        }

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
				/* ================= MARTYR'S FAMILY INFORMATION ================= */

				.application-container .reg-panel:has(.reg-tag) .reg-panel__body {
				    width: 100%;
				}

				/* Information Tag */
				.application-container .reg-panel:has(.reg-tag) .reg-tag {
				    display: inline-block;
				    margin: 0 0 18px;
				    padding: 6px 11px;
				    color: #17365d;
				    background: #edf3fb;
				    border-radius: 20px;
				    font-size: 12px;
				    font-weight: 500;
				}

				/* Question */
				.application-container .reg-panel:has(.reg-tag) .reg-field {
				    width: 100%;
				    margin: 0;
				}

				.application-container .reg-panel:has(.reg-tag) .reg-field > label {
				    display: block;
				    margin-bottom: 10px;
				    color: #17365d;
				    font-size: 14px;
				    font-weight: 500;
				}

				/* Required Star */
				.application-container .reg-panel:has(.reg-tag) .reg-req {
				    color: #dc3545;
				    margin-left: 3px;
				}

				/* YES / NO Container */
				.application-container .reg-panel:has(.reg-tag) .reg-choices {
				    display: flex;
				    align-items: center;
				    gap: 12px;
				    flex-wrap: wrap;
				}

				/* Radio Cards */
				.application-container .reg-panel:has(.reg-tag) .reg-choice {
				    display: flex;
				    align-items: center;
				    gap: 9px;
				    width: 130px;
				    height: 46px;
				    padding: 0 15px;
				    border: 1px solid #b9c9dd;
				    border-radius: 9px;
				    background: #ffffff;
				    box-sizing: border-box;
				    cursor: pointer;
				    transition: all 0.2s ease;
				}

				.application-container .reg-panel:has(.reg-tag) .reg-choice:hover {
				    border-color: #1b4d82;
				    background: #f5f8fc;
				}

				/* Radio Button */
				.application-container .reg-panel:has(.reg-tag) .reg-choice input[type="radio"] {
				    width: 18px;
				    height: 18px;
				    margin: 0;
				    accent-color: #173f70;
				    cursor: pointer;
				}

				/* YES / NO Text */
				.application-container .reg-panel:has(.reg-tag) .reg-choice span {
				    color: #17365d;
				    font-size: 14px;
				    font-weight: 500;
				}

				/* Selected Card */
				.application-container .reg-panel:has(.reg-tag) .reg-choice:has(input:checked) {
				    border-color: #173f70;
				    background: #f0f5fc;
				}

				/* Mobile */
				@media (max-width: 576px) {
				    .application-container .reg-panel:has(.reg-tag) .reg-choice {
				        width: 115px;
				    }
				}
				/* ================= ADDRESS CHECKBOX ================= */

				.application-container .reg-address-toggle {
				    width: 100%;
				    margin-top: 16px;
				    padding: 14px 16px;
				    border: 1px dashed #b9c9dd;
				    border-radius: 9px;
				    background: #f8fafc;
				    box-sizing: border-box;
				    transition: all 0.2s ease;
				}

				.application-container .reg-address-toggle label {
				    display: flex;
				    align-items: center;
				    gap: 12px;
				    margin: 0;
				    cursor: pointer;
				    color: #17365d;
				    font-size: 14px;
				    font-weight: 600;
				}

				.application-container .reg-address-toggle input[type="checkbox"] {
				    width: 18px;
				    height: 18px;
				    margin: 0;
				    accent-color: #173f70;
				    cursor: pointer;
				    flex-shrink: 0;
				}

				.application-container .reg-address-toggle:has(input:checked) {
				    background: #edf3fb;
				    border: 1px solid #173f70;
				}

				/* ================= PRESENT ADDRESS PANEL ================= */

				.application-container .reg-present-address {
				    margin-top: 20px;
				    padding: 20px 18px;
				    border: 1px solid #dce3ed;
				    border-radius: 9px;
				    background: #ffffff;
				    animation: addressSlideDown 0.25s ease;
				}

				.application-container .reg-present-address h4 {
				    margin: -20px 0 20px;
				    padding: 0 8px;
				    display: table;
				    position: relative;
				    top: -11px;
				    background: #ffffff;
				    color: #17365d;
				    font-size: 15px;
				    font-weight: 700;
				}

				@keyframes addressSlideDown {
				    from {
				        opacity: 0;
				        transform: translateY(-8px);
				    }

				    to {
				        opacity: 1;
				        transform: translateY(0);
				    }
				}

				/* ================= MOBILE ================= */

				@media (max-width: 576px) {
				    .application-container .reg-address-toggle {
				        padding: 12px;
				    }

				    .application-container .reg-present-address {
				        padding: 16px 12px;
				    }
				}
				/* ================= CONTACT INFORMATION ================= */

				.application-container .reg-mobile-input {
				    display: flex;
				    align-items: stretch;
				    width: 100%;
				}

				.application-container .reg-mobile-prefix {
				    display: flex;
				    align-items: center;
				    justify-content: center;
				    min-width: 50px;
				    padding: 0 10px;
				    background: #f5f7fa;
				    border: 1px solid #b9c9dd;
				    border-right: 0;
				    border-radius: 8px 0 0 8px;
				    color: #17365d;
				    font-size: 14px;
				}

				.application-container .reg-mobile-input .reg-input {
				    flex: 1;
				    min-width: 0;
				    border-radius: 0 8px 8px 0;
				}

				.application-container .reg-field-hint {
				    display: block;
				    margin-top: 8px;
				    color: #64748b;
				    font-size: 12px;
				    line-height: 18px;
				}

				.application-container .reg-optional {
				    color: #64748b;
				    font-size: 13px;
				    font-weight: 400;
				}
				/* Validation Error */

				.application-container .reg-input--error {
				    border: 1px solid #dc3545 !important;
				}

				.application-container .reg-error-msg {
				    display: block;
				    margin-top: 6px;
				    color: #dc3545;
				    font-size: 12px;
				    font-weight: 500;
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
                                            Applicant Full Name <span className="reg-req">*</span>
                                        </label>

                                        <input
                                            type="text"
                                            className={`reg-input ${fullNameError ? 'reg-input--error' : ''}`}
                                            name="fullName"
                                            placeholder="Enter full name"
                                            autoComplete="new-password"
                                            value={fullName}
                                            onChange={(e) => {
                                                setFullName(e.target.value);
                                                setFullNameError('');
                                            }}
                                        />

                                        {fullNameError && (
                                            <small className="reg-error-msg">
                                                {fullNameError}
                                            </small>
                                        )}

                                    </div>
                                    <div className="reg-field">

                                        <label>
                                            Date of Birth <span className="reg-req">*</span>
                                        </label>

                                        <input
                                            type="date"
                                            className={`reg-input ${dobError ? 'reg-input--error' : ''}`}
                                            name="dob"
                                            value={dob}
                                            max={new Date().toISOString().split('T')[0]}
                                            onChange={(e) => {
                                                setDob(e.target.value);
                                                setDobError('');
                                            }}
                                        />

                                        {dobError && (
                                            <small className="reg-error-msg">
                                                {dobError}
                                            </small>
                                        )}

                                    </div>

                                    <div className="reg-field">

                                        <label>
                                            Gender <span className="reg-req">*</span>
                                        </label>

                                        <select
                                            className={`reg-input ${genderError ? 'reg-input--error' : ''}`}
                                            name="gender"
                                            value={gender}
                                            onChange={(e) => {
                                                setGender(e.target.value);
                                                setGenderError('');
                                            }}
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>

                                        {genderError && (
                                            <small className="reg-error-msg">
                                                {genderError}
                                            </small>
                                        )}

                                    </div>

                                    <div className="reg-field">

                                        <label>
                                            Name of Father/ Guardian of the Applicant
                                            <span className="reg-req">*</span>
                                        </label>

                                        <input
                                            type="text"
                                            className={`reg-input ${fatherGuardianError ? 'reg-input--error' : ''}`}
                                            name="fatherguardianname"
                                            placeholder="Enter Father/ Guardian name"
                                            autoComplete="new-password"
                                            value={fatherGuardianName}
                                            onChange={(e) => {
                                                setFatherGuardianName(e.target.value);
                                                setFatherGuardianError('');
                                            }}
                                        />

                                        {fatherGuardianError && (
                                            <small className="reg-error-msg">
                                                {fatherGuardianError}
                                            </small>
                                        )}

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
                                            autoComplete="new-password"
                                        />
                                    </div>

                                    <div className="reg-field">
                                        <label>
                                            Name of Mother of the Applicant <span className="reg-req">*</span>
                                        </label>

                                        <input
                                            type="text"
                                            className={`reg-input ${motherNameError ? 'reg-input--error' : ''}`}
                                            name="mothername"
                                            placeholder="Enter Mother name"
                                            autoComplete="new-password"
                                            value={motherName}
                                            onChange={(e) => {
                                                setMotherName(e.target.value);
                                                setMotherNameError('');
                                            }}
                                        />

                                        {motherNameError && (
                                            <small className="reg-error-msg">{motherNameError}</small>
                                        )}
                                    </div>

                                    <div className="reg-field">
                                        <label>
                                            Category <span className="reg-req">*</span>
                                        </label>

                                        <select
                                            className={`reg-input ${categoryError ? 'reg-input--error' : ''}`}
                                            name="category"
                                            value={category}
                                            onChange={(e) => {
                                                setCategory(e.target.value);
                                                setCategoryError('');
                                            }}
                                        >
                                            <option value="">Select Category</option>
                                            <option value="General">General</option>
                                            <option value="SC">SC</option>
                                            <option value="STP">STP</option>
                                            <option value="STH">STH</option>
                                            <option value="OBC/MOBC">OBC/MOBC</option>
                                        </select>

                                        {categoryError && (
                                            <small className="reg-error-msg">{categoryError}</small>
                                        )}
                                    </div>

                                    <div className="reg-field">
                                        <label>
                                            Nationality <span className="reg-req">*</span>
                                        </label>

                                        <select
                                            className={`reg-input ${nationalityError ? 'reg-input--error' : ''}`}
                                            name="nationality"
                                            value={nationality}
                                            onChange={(e) => {
                                                setNationality(e.target.value);
                                                setNationalityError('');
                                            }}
                                        >
                                            <option value="Indian">Indian</option>
                                            <option value="Other">Other</option>
                                        </select>

                                        {nationalityError && (
                                            <small className="reg-error-msg">{nationalityError}</small>
                                        )}
                                    </div>

                                    <div className="reg-field">
                                        <label>
                                            Religion <span className="reg-req">*</span>
                                        </label>

                                        <select
                                            className={`reg-input ${religionError ? 'reg-input--error' : ''}`}
                                            name="religion"
                                            value={religion}
                                            onChange={(e) => {
                                                setReligion(e.target.value);
                                                setReligionError('');
                                            }}
                                        >
                                            <option value="">Select Religion</option>
                                            <option value="Hindu">Hindu</option>
                                            <option value="Muslim">Muslim</option>
                                            <option value="Sikh">Sikh</option>
                                            <option value="Christian">Christian</option>
                                            <option value="Jain">Jain</option>
                                            <option value="Others">Others</option>
                                        </select>

                                        {religionError && (
                                            <small className="reg-error-msg">{religionError}</small>
                                        )}
                                    </div>



                                </div>





                            </div>


                        </section>
                        <br />
                        <section className="reg-panel">

                            <div className="reg-panel__head">
                                <h3>Additional Applicant Information</h3>
                            </div>

                            <div className="reg-panel__body">

                                <div className="reg-grid">

                                    <div className="reg-field">
                                        <label>
                                            Registration Number of Employment Exchange of Assam
                                            <span className="reg-req">*</span>
                                        </label>

                                        <input
                                            type="text"
                                            className={`reg-input ${employmentExchangeError ? 'reg-input--error' : ''}`}
                                            name="employmentExchangeNumber"
                                            placeholder="Enter Registration Number"
                                            autoComplete="new-password"
                                            value={employmentExchangeNumber}
                                            onChange={(e) => {
                                                setEmploymentExchangeNumber(e.target.value);
                                                setEmploymentExchangeError('');
                                            }}
                                        />

                                        {employmentExchangeError && (
                                            <small className="reg-error-msg">{employmentExchangeError}</small>
                                        )}
                                    </div>

                                    {/* Divyang */}
                                    <div className="reg-field">
                                        <label>
                                            Are You Divyang (Persons with Disability)?
                                            <span className="reg-req">*</span>
                                        </label>

                                        <select
                                            className={`reg-input ${divyangError ? 'reg-input--error' : ''}`}
                                            name="divyang"
                                            value={divyang}
                                            onChange={(e) => {
                                                setDivyang(e.target.value);
                                                setDivyangError('');
                                            }}
                                        >
                                            <option value="">Select</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>

                                        {divyangError && (
                                            <small className="reg-error-msg">{divyangError}</small>
                                        )}
                                    </div>

                                    {/* Ex-Serviceman */}
                                    <div className="reg-field">
                                        <label>
                                            Ex-Serviceman
                                            <span className="reg-req">*</span>
                                        </label>

                                        <select
                                            className={`reg-input ${exServicemanError ? 'reg-input--error' : ''}`}
                                            name="exServiceman"
                                            value={exServiceman}
                                            onChange={(e) => {
                                                setExServiceman(e.target.value);
                                                setExServicemanError('');
                                            }}
                                        >
                                            <option value="">Select</option>
                                            <option value="Yes">Yes</option>
                                            <option value="No">No</option>
                                        </select>

                                        {exServicemanError && (
                                            <small className="reg-error-msg">{exServicemanError}</small>
                                        )}
                                    </div>




                                </div>





                            </div>


                        </section>

                        {/* ==================== MARTYR'S FAMILY INFORMATION ==================== */}
                        <br />
                        <section className="reg-panel">

                            <div className="reg-panel__head">
                                <h3>Martyr's Family Information</h3>
                            </div>

                            <div className="reg-panel__body">

                                <p className="reg-tag">
                                    Assam Public Service (Preferential Appointment) Rules, 1999
                                </p>

                                <div
                                    className="reg-field"
                                    role="radiogroup"
                                    aria-required="true"
                                    aria-label="Are you a family member of martyr?"
                                >
                                    <label>
                                        Are you a family member of martyr?
                                        <span className="reg-req">*</span>
                                    </label>

                                    <div className="reg-choices">
                                        <label className="reg-choice">
                                            <input
                                                type="radio"
                                                name="martyr_family"
                                                value="YES"
                                                checked={martyrFamily === 'YES'}
                                                onChange={(e) => {
                                                    setMartyrFamily(e.target.value);
                                                    setMartyrFamilyError('');
                                                }}
                                            />
                                            <span>YES</span>
                                        </label>

                                        <label className="reg-choice">
                                            <input
                                                type="radio"
                                                name="martyr_family"
                                                value="NO"
                                                checked={martyrFamily === 'NO'}
                                                onChange={(e) => {
                                                    setMartyrFamily(e.target.value);
                                                    setMartyrFamilyError('');
                                                }}
                                            />
                                            <span>NO</span>
                                        </label>
                                    </div>

                                    {martyrFamilyError && (
                                        <small className="reg-error-msg">{martyrFamilyError}</small>
                                    )}
                                </div>
                            </div>

                        </section>

                        <br />

                        {/* ==================== PERMANENT ADDRESS INFORMATION ==================== */}

                        <section className="reg-panel">

                            <div className="reg-panel__head">
                                <h3>Permanent Address Information</h3>
                            </div>

                            <div className="reg-panel__body">

                                {/* Permanent Address Fields */}
                                <div className="reg-grid">

                                    <div className="reg-field">
                                        <label>
                                            Address 1 <span className="reg-req">*</span>
                                        </label>

                                        <input
                                            type="text"
                                            className={`reg-input ${permanentAddress1Error ? 'reg-input--error' : ''}`}
                                            name="permanentAddress1"
                                            placeholder="House no. / Building"
                                            autoComplete="new-password"
                                            value={permanentAddress1}
                                            onChange={(e) => {
                                                setPermanentAddress1(e.target.value);
                                                setPermanentAddress1Error('');
                                            }}
                                        />

                                        {permanentAddress1Error && (
                                            <small className="reg-error-msg">{permanentAddress1Error}</small>
                                        )}
                                    </div>

                                    <div className="reg-field">
                                        <label>
                                            Address 2 <span className="reg-req">*</span>
                                        </label>

                                        <input
                                            type="text"
                                            className={`reg-input ${permanentAddress2Error ? 'reg-input--error' : ''}`}
                                            name="permanentAddress2"
                                            placeholder="Street / Locality"
                                            aautoComplete="new-password"
                                            value={permanentAddress2}
                                            onChange={(e) => {
                                                setPermanentAddress2(e.target.value);
                                                setPermanentAddress2Error('');
                                            }}
                                        />

                                        {permanentAddress2Error && (
                                            <small className="reg-error-msg">{permanentAddress2Error}</small>
                                        )}
                                    </div>

                                    <div className="reg-field">
                                        <label>
                                            Address 3 <span className="reg-req">*</span>
                                        </label>

                                        <input
                                            type="text"
                                            className={`reg-input ${permanentAddress3Error ? 'reg-input--error' : ''}`}
                                            name="permanentAddress3"
                                            placeholder="Landmark / Area"
                                            autoComplete="new-password"
                                            value={permanentAddress3}
                                            onChange={(e) => {
                                                setPermanentAddress3(e.target.value);
                                                setPermanentAddress3Error('');
                                            }}
                                        />

                                        {permanentAddress3Error && (
                                            <small className="reg-error-msg">{permanentAddress3Error}</small>
                                        )}
                                    </div>

                                    <div className="reg-field">
                                        <label>
                                            City / Village <span className="reg-req">*</span>
                                        </label>

                                        <input
                                            type="text"
                                            className={`reg-input ${permanentCityError ? 'reg-input--error' : ''}`}
                                            name="permanentCity"
                                            placeholder="Enter City / Village"
                                            autoComplete="new-password"
                                            value={permanentCity}
                                            onChange={(e) => {
                                                setPermanentCity(e.target.value);
                                                setPermanentCityError('');
                                            }}
                                        />

                                        {permanentCityError && (
                                            <small className="reg-error-msg">{permanentCityError}</small>
                                        )}
                                    </div>

                                    <div className="reg-field">
                                        <label>
                                            Police Station <span className="reg-req">*</span>
                                        </label>

                                        <input
                                            type="text"
                                            className={`reg-input ${permanentPoliceStationError ? 'reg-input--error' : ''}`}
                                            name="permanentPoliceStation"
                                            placeholder="Enter Police Station"
                                            autoComplete="new-password"
                                            value={permanentPoliceStation}
                                            onChange={(e) => {
                                                setPermanentPoliceStation(e.target.value);
                                                setPermanentPoliceStationError('');
                                            }}
                                        />

                                        {permanentPoliceStationError && (
                                            <small className="reg-error-msg">{permanentPoliceStationError}</small>
                                        )}
                                    </div>

                                    <div className="reg-field">
                                        <label>
                                            Pin <span className="reg-req">*</span>
                                        </label>

                                        <input
                                            type="text"
                                            className={`reg-input ${permanentPinError ? 'reg-input--error' : ''}`}
                                            name="permanentPin"
                                            placeholder="6-digit PIN"
                                            maxLength="6"
                                            inputMode="numeric"
                                            autoComplete="new-password"
                                            value={permanentPin}
                                            onChange={(e) => {
                                                setPermanentPin(e.target.value.replace(/\D/g, ''));
                                                setPermanentPinError('');
                                            }}
                                        />

                                        {permanentPinError && (
                                            <small className="reg-error-msg">{permanentPinError}</small>
                                        )}
                                    </div>

                                    <div className="reg-field">
                                        <label>
                                            District <span className="reg-req">*</span>
                                        </label>

                                        <select
                                            className={`reg-input ${permanentDistrictError ? 'reg-input--error' : ''}`}
                                            name="permanentDistrict"
                                            value={permanentDistrict}
                                            onChange={(e) => {
                                                setPermanentDistrict(e.target.value);
                                                setPermanentDistrictError('');
                                            }}
                                        >
                                            <option value="">SELECT</option>
                                            <option value="Bajali">Bajali</option>
                                            <option value="Baksa">Baksa</option>
                                            <option value="Barpeta">Barpeta</option>
                                            <option value="Biswanath">Biswanath</option>
                                            <option value="Bongaigaon">Bongaigaon</option>
                                            <option value="Cachar">Cachar</option>
                                            <option value="Charaideo">Charaideo</option>
                                            <option value="Chirang">Chirang</option>
                                            <option value="Darrang">Darrang</option>
                                            <option value="Dhemaji">Dhemaji</option>
                                            <option value="Dhubri">Dhubri</option>
                                            <option value="Dibrugarh">Dibrugarh</option>
                                            <option value="Dima Hasao">Dima Hasao</option>
                                            <option value="Goalpara">Goalpara</option>
                                            <option value="Golaghat">Golaghat</option>
                                            <option value="Hailakandi">Hailakandi</option>
                                            <option value="Hojai">Hojai</option>
                                            <option value="Jorhat">Jorhat</option>
                                            <option value="Kamrup">Kamrup</option>
                                            <option value="Kamrup Metropolitan">Kamrup Metropolitan</option>
                                            <option value="Karbi Anglong">Karbi Anglong</option>
                                            <option value="Karimganj">Karimganj</option>
                                            <option value="Kokrajhar">Kokrajhar</option>
                                            <option value="Lakhimpur">Lakhimpur</option>
                                            <option value="Majuli">Majuli</option>
                                            <option value="Morigaon">Morigaon</option>
                                            <option value="Nagaon">Nagaon</option>
                                            <option value="Nalbari">Nalbari</option>
                                            <option value="Sivasagar">Sivasagar</option>
                                            <option value="Sonitpur">Sonitpur</option>
                                            <option value="South Salmara-Mancachar">South Salmara-Mancachar</option>
                                            <option value="Tamulpur">Tamulpur</option>
                                            <option value="Tinsukia">Tinsukia</option>
                                            <option value="Udalguri">Udalguri</option>
                                            <option value="West Karbi Anglong">West Karbi Anglong</option>
                                        </select>

                                        {permanentDistrictError && (
                                            <small className="reg-error-msg">{permanentDistrictError}</small>
                                        )}
                                    </div>

                                </div>

                                {/* Present Address Checkbox */}
                                <div className="reg-address-toggle">

                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={isPresentAddressDifferent}
                                            onChange={(e) => setIsPresentAddressDifferent(e.target.checked)}
                                        />
                                        <span>Present Address Not Same With Permanent Address</span>
                                    </label>

                                </div>

                                {/* Present Address - Conditional Display */}
                                {isPresentAddressDifferent && (

                                    <div className="reg-present-address">

                                        <h4>Present Address Information</h4>

                                        <div className="reg-grid">

                                            <div className="reg-field">
                                                <label>
                                                    Address 1 <span className="reg-req">*</span>
                                                </label>

                                                <input
                                                    type="text"
                                                    className={`reg-input ${presentAddress1Error ? 'reg-input--error' : ''}`}
                                                    name="presentAddress1"
                                                    placeholder="House no. / Building"
                                                    autoComplete="new-password"
                                                    value={presentAddress1}
                                                    onChange={(e) => {
                                                        setPresentAddress1(e.target.value);
                                                        setPresentAddress1Error('');
                                                    }}
                                                />

                                                {presentAddress1Error && (
                                                    <small className="reg-error-msg">{presentAddress1Error}</small>
                                                )}
                                            </div>

                                            <div className="reg-field">
                                                <label>
                                                    Address 2 <span className="reg-req">*</span>
                                                </label>

                                                <input
                                                    type="text"
                                                    className={`reg-input ${presentAddress2Error ? 'reg-input--error' : ''}`}
                                                    name="presentAddress2"
                                                    placeholder="Street / Locality"
                                                    autoComplete="new-password"
                                                    value={presentAddress2}
                                                    onChange={(e) => {
                                                        setPresentAddress2(e.target.value);
                                                        setPresentAddress2Error('');
                                                    }}
                                                />

                                                {presentAddress2Error && (
                                                    <small className="reg-error-msg">{presentAddress2Error}</small>
                                                )}
                                            </div>

                                            <div className="reg-field">
                                                <label>
                                                    Address 3 <span className="reg-req">*</span>
                                                </label>

                                                <input
                                                    type="text"
                                                    className={`reg-input ${presentAddress3Error ? 'reg-input--error' : ''}`}
                                                    name="presentAddress3"
                                                    placeholder="Landmark / Area"
                                                    autoComplete="new-password"
                                                    value={presentAddress3}
                                                    onChange={(e) => {
                                                        setPresentAddress3(e.target.value);
                                                        setPresentAddress3Error('');
                                                    }}
                                                />

                                                {presentAddress3Error && (
                                                    <small className="reg-error-msg">{presentAddress3Error}</small>
                                                )}
                                            </div>

                                            <div className="reg-field">
                                                <label>
                                                    City / Village <span className="reg-req">*</span>
                                                </label>

                                                <input
                                                    type="text"
                                                    className={`reg-input ${presentCityError ? 'reg-input--error' : ''}`}
                                                    name="presentCity"
                                                    placeholder="Enter City / Village"
                                                    autoComplete="new-password"
                                                    value={presentCity}
                                                    onChange={(e) => {
                                                        setPresentCity(e.target.value);
                                                        setPresentCityError('');
                                                    }}
                                                />

                                                {presentCityError && (
                                                    <small className="reg-error-msg">{presentCityError}</small>
                                                )}
                                            </div>

                                            <div className="reg-field">
                                                <label>
                                                    Police Station <span className="reg-req">*</span>
                                                </label>

                                                <input
                                                    type="text"
                                                    className={`reg-input ${presentPoliceStationError ? 'reg-input--error' : ''}`}
                                                    name="presentPoliceStation"
                                                    placeholder="Enter Police Station"
                                                    autoComplete="new-password"
                                                    value={presentPoliceStation}
                                                    onChange={(e) => {
                                                        setPresentPoliceStation(e.target.value);
                                                        setPresentPoliceStationError('');
                                                    }}
                                                />

                                                {presentPoliceStationError && (
                                                    <small className="reg-error-msg">{presentPoliceStationError}</small>
                                                )}
                                            </div>

                                            <div className="reg-field">
                                                <label>
                                                    Pin <span className="reg-req">*</span>
                                                </label>

                                                <input
                                                    type="text"
                                                    className={`reg-input ${presentPinError ? 'reg-input--error' : ''}`}
                                                    name="presentPin"
                                                    placeholder="6-digit PIN"
                                                    maxLength="6"
                                                    inputMode="numeric"
                                                    autoComplete="new-password"
                                                    value={presentPin}
                                                    onChange={(e) => {
                                                        setPresentPin(e.target.value.replace(/\D/g, ''));
                                                        setPresentPinError('');
                                                    }}
                                                />

                                                {presentPinError && (
                                                    <small className="reg-error-msg">{presentPinError}</small>
                                                )}
                                            </div>

											<div className="reg-field">
											    <label>
											        District <span className="reg-req">*</span>
											    </label>

											    <select
											        className={`reg-input ${presentDistrictError ? 'reg-input--error' : ''}`}
											        name="presentDistrict"
											        value={presentDistrict}
											        onChange={(e) => {
											            setPresentDistrict(e.target.value);
											            setPresentDistrictError('');
											        }}
											    >
											        <option value="">SELECT</option>
											        <option value="Bajali">Bajali</option>
											        <option value="Baksa">Baksa</option>
											        <option value="Barpeta">Barpeta</option>
											        <option value="Biswanath">Biswanath</option>
											        <option value="Bongaigaon">Bongaigaon</option>
											        <option value="Cachar">Cachar</option>
											        <option value="Charaideo">Charaideo</option>
											        <option value="Chirang">Chirang</option>
											        <option value="Darrang">Darrang</option>
											        <option value="Dhemaji">Dhemaji</option>
											        <option value="Dhubri">Dhubri</option>
											        <option value="Dibrugarh">Dibrugarh</option>
											        <option value="Dima Hasao">Dima Hasao</option>
											        <option value="Goalpara">Goalpara</option>
											        <option value="Golaghat">Golaghat</option>
											        <option value="Hailakandi">Hailakandi</option>
											        <option value="Hojai">Hojai</option>
											        <option value="Jorhat">Jorhat</option>
											        <option value="Kamrup">Kamrup</option>
											        <option value="Kamrup Metropolitan">Kamrup Metropolitan</option>
											        <option value="Karbi Anglong">Karbi Anglong</option>
											        <option value="Karimganj">Karimganj</option>
											        <option value="Kokrajhar">Kokrajhar</option>
											        <option value="Lakhimpur">Lakhimpur</option>
											        <option value="Majuli">Majuli</option>
											        <option value="Morigaon">Morigaon</option>
											        <option value="Nagaon">Nagaon</option>
											        <option value="Nalbari">Nalbari</option>
											        <option value="Sivasagar">Sivasagar</option>
											        <option value="Sonitpur">Sonitpur</option>
											        <option value="South Salmara-Mancachar">South Salmara-Mancachar</option>
											        <option value="Tamulpur">Tamulpur</option>
											        <option value="Tinsukia">Tinsukia</option>
											        <option value="Udalguri">Udalguri</option>
											        <option value="West Karbi Anglong">West Karbi Anglong</option>
											    </select>

											    {presentDistrictError && (
											        <small className="reg-error-msg">{presentDistrictError}</small>
											    )}
											</div>
                                        </div>

                                    </div>

                                )}

                            </div>

                        </section>

                        <br />
                        {/* ==================== CONTACT INFORMATION ==================== */}

                        <section className="reg-panel">

                            <div className="reg-panel__head">
                                <h3>Contact Information</h3>
                            </div>

                            <div className="reg-panel__body">

                                <div className="reg-grid">

                                    {/* Mobile Number */}
                                    <div className="reg-field">

                                        <label>
                                            Mobile Number <span className="reg-req">*</span>
                                        </label>

										<div className="reg-mobile-input">
										    <span className="reg-mobile-prefix">+91</span>

										    <input
										        type="tel"
										        className={`reg-input ${mobileNumberError ? 'reg-input--error' : ''}`}
										        name="mobileNumber"
										        placeholder="10-digit number"
										        maxLength="10"
										        inputMode="numeric"
										        autoComplete="new-password"
										        value={mobileNumber}
										        onChange={(e) => {
										            setMobileNumber(e.target.value.replace(/\D/g, ''));
										            setMobileNumberError('');
										        }}
										    />
										</div>

										{mobileNumberError && (
										    <small className="reg-error-msg">{mobileNumberError}</small>
										)}

                                        <small className="reg-field-hint">
                                            Keep this number active. It is used for all communication.
                                        </small>

                                    </div>

                                    {/* Email ID */}
									<div className="reg-field">
									    <label>
									        Email Id <span className="reg-req">*</span>
									    </label>

									    <input
									        type="email"
									        className={`reg-input ${emailError ? 'reg-input--error' : ''}`}
									        name="email"
									        placeholder="name@example.com"
									        autoComplete="new-password"
									        value={email}
									        onChange={(e) => {
									            setEmail(e.target.value);
									            setEmailError('');
									        }}
									    />

									    {emailError && (
									        <small className="reg-error-msg">{emailError}</small>
									    )}
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

                {/* STEP 2: Post & Education Qualification */}

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
