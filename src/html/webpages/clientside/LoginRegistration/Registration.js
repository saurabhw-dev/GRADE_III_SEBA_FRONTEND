import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FiPhone, FiLock, FiEdit } from "react-icons/fi";
import Header from '../HeaderFooter/Header';
import Footer from '../HeaderFooter/Footer';
import './Register.css';

import API_BASE_URL from '../../../../apiConfig';

function formatDob(value) {
    const v = String(value || "").trim();

    if (/^\d{8}$/.test(v)) {
        return v.slice(0, 2) + "-" + v.slice(2, 4) + "-" + v.slice(4);
    }

    return v;
}

function formatGender(value) {
    const v = String(value || "").trim();

    return {
        M: "Male",
        F: "Female",
        T: "Transgender"
    }[v.toUpperCase()] || v;
}

function Register() {
	
	const [alertBox, setAlertBox] = useState({
	    show: false,
	    type: "",
	    message: ""
	});
	
	
	const navigate = useNavigate();
    const [digilockerLoading, setDigilockerLoading] = useState(false);
    const [digilockerProfile, setDigilockerProfile] = useState(null);
    const [digilockerError, setDigilockerError] = useState("");

    const [drivingData, setDrivingData] = useState(null);
    const [panData, setPanData] = useState(null);

    const callbackProcessed = useRef(false);

    // Email and password states
    const [email, setEmail] = useState("");
    const [emailTouched, setEmailTouched] = useState(false);

    const [mobile, setMobile] = useState("");
    const [mobileTouched, setMobileTouched] = useState(false);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [passwordTouched, setPasswordTouched] = useState(false);
    const [confirmTouched, setConfirmTouched] = useState(false);

    
	const [academicYear, setAcademicYear] = useState("2027-28");
    // Continue with DigiLocker
    const continueWithDigiLocker = () => {
        setDigilockerLoading(true);
        window.location.href = API_BASE_URL + "/api/digilocker/authorize";
    };

    // Existing DigiLocker callback and API flow
    useEffect(() => {

        const params = new URLSearchParams(window.location.search);

        const code = params.get("code");
        const state = params.get("state");
        const error = params.get("error");

        if (error) {
            setDigilockerError("DigiLocker authentication was unsuccessful.");
            return;
        }

        if (!code || !state || callbackProcessed.current) {
            return;
        }

        callbackProcessed.current = true;

        const exchangeCode = async () => {

            try {

                setDigilockerLoading(true);
                setDigilockerError("");

                const response = await fetch(
                    API_BASE_URL + "/api/digilocker/exchange",
                    {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            code: code,
                            state: state
                        })
                    }
                );

                if (!response.ok) {
                    throw new Error("Unable to verify DigiLocker authentication.");
                }

                const data = await response.json();

                setDigilockerProfile(data);

                // Retrieve Driving Licence
                const drivingResponse = await fetch(
                    API_BASE_URL + "/api/digilocker/driving-license",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                if (!drivingResponse.ok) {
                    throw new Error("Unable to retrieve Driving Licence details.");
                }

                const drivingResult = await drivingResponse.json();

                setDrivingData(drivingResult);

                console.log("Driving Licence Documents:", drivingResult);

                // Retrieve PAN Card
                const panResponse = await fetch(
                    API_BASE_URL + "/api/digilocker/pan-card",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                const panResult = await panResponse.json();

                if (!panResponse.ok) {
                    throw new Error(
                        panResult.message || "Unable to retrieve PAN Card XML."
                    );
                }

                setPanData(panResult);

                console.log("PAN Card XML:", panResult.xml);
                console.log("DigiLocker Profile:", data);

				
				
                // Remove code and state from URL
                window.history.replaceState(
                    {},
                    document.title,
                    window.location.pathname
                );

            } catch (err) {

                setDigilockerError(err.message);
                callbackProcessed.current = false;

            } finally {

                setDigilockerLoading(false);

            }

        };

        exchangeCode();

    }, []);

    // Extract PAN details from XML
    const getPanDetails = () => {

        if (!panData || !panData.xml) {
            return {};
        }

        try {

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(panData.xml, "text/xml");

            if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
                return {};
            }

            const person = xmlDoc.getElementsByTagName("Person")[0];
            const pan = xmlDoc.getElementsByTagName("PAN")[0];

            return {
                name: person ? person.getAttribute("name") : "",
                dob: person ? person.getAttribute("dob") : "",
                gender: person ? person.getAttribute("gender") : "",
                number: pan ? pan.getAttribute("num") : ""
            };

        } catch (error) {

            console.error("PAN XML parsing error:", error);
            return {};

        }
    };

    const panDetails = getPanDetails();

    // Email & mobile validation
    const mobileError = !mobile.trim()
        ? "Please enter your mobile number."
        : !/^[6-9]\d{9}$/.test(mobile)
            ? "Please enter a valid 10-digit mobile number."
            : "";

    const [mobileChecking, setMobileChecking] = useState(false);
    const [mobileExists, setMobileExists] = useState(false);

    const checkMobileNoExist = async (mobileNo) => {
        try {
            setMobileChecking(true);
            setMobileExists(false);

            const response = await fetch(
                `${API_BASE_URL}/api/registrationlogin/checkMobileNoExist?mobileNo=${encodeURIComponent(mobileNo)}`,
                {
                    method: "POST"
                }
            );

            const data = await response.json();

            if (data.exists === true) {
                setMobileExists(true);
            }

        } catch (error) {
            console.error("Mobile number check failed:", error);
        } finally {
            setMobileChecking(false);
        }
    };
	
	

	const [panChecking, setPanChecking] = useState(false);
	const [panExists, setPanExists] = useState(false);
	
	const checkPanCardExist = async (panNo) => {
	    try {
	        setPanChecking(true);
	        setPanExists(false);

	        const response = await fetch(
	            `${API_BASE_URL}/api/registrationlogin/checkPanCardExist?pancard=${encodeURIComponent(panNo)}`,
	            {
	                method: "POST"
	            }
	        );

	        const data = await response.json();

	        if (data.exists === true) {
	            setPanExists(true);
	        }

	    } catch (error) {
	        console.error("PAN card check failed:", error);
	    } finally {
	        setPanChecking(false);
	    }
	};
	
	useEffect(() => {
	    if (panDetails.number) {
	        checkPanCardExist(panDetails.number.trim().toUpperCase());
	    }
	}, [panDetails.number]);


	const [aadhaarChecking, setAadhaarChecking] = useState(false);
	const [aadhaarExists, setAadhaarExists] = useState(false);
	const [aadhaarMessage, setAadhaarMessage] = useState("");
	
	
	const checkAadhaarCardExist = async (aadhaarNo) => {
	    try {
	        setAadhaarChecking(true);
	        setAadhaarExists(false);
	        setAadhaarMessage("");

	        const response = await fetch(
	            `${API_BASE_URL}/api/registrationlogin/checkAadhaarCardExist?adharcard=${encodeURIComponent(aadhaarNo)}`,
	            {
	                method: "POST"
	            }
	        );

	        const data = await response.json();

	        console.log("Aadhaar API Response:", data);

	        if (data.exists === true) {
	            setAadhaarExists(true);
	            setAadhaarMessage(data.message || "This Aadhaar Card number is already registered.");
	        }

	    } catch (error) {
	        console.error("Aadhaar card check failed:", error);
	    } finally {
	        setAadhaarChecking(false);
	    }
	};
	
	useEffect(() => {
	    if (panDetails.number) {
	        checkAadhaarCardExist(panDetails.number);
	    }
	}, [panDetails.number]);
	
    const emailError = !email.trim()
        ? "Please enter your email address."
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
            ? "Please enter a valid email address."
            : "";

    // Password validation rules
    const passwordRules = {
        length: password.length >= 8 && password.length <= 20,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        digit: /\d/.test(password),
        special: /[^A-Za-z0-9\s]/.test(password)
    };

    const passwordValid = Object.values(passwordRules).every(Boolean);

    const passwordError = !password
        ? "Please create a password."
        : !passwordValid
            ? "Password does not meet all the requirements."
            : "";

    const confirmError = !confirmPassword
        ? "Please re-enter your password."
        : confirmPassword !== password
            ? "Passwords do not match."
            : "";

    /*const isFormValid =
        !!digilockerProfile &&
        !!panDetails.name &&
        !!panDetails.number &&
        !!panDetails.dob &&
        !!panDetails.gender &&
        !emailError &&
        !mobileError &&
        !mobileExists &&
        !mobileChecking &&
        passwordValid &&
        password === confirmPassword &&
        !!confirmPassword; */

    const isFormValid =
        !!digilockerProfile &&
        !!panDetails.name &&
        !!panDetails.number &&
        !!panDetails.dob &&
        !!panDetails.gender &&
		!panExists && 
		!panChecking &&
        !mobileError &&
        !mobileExists &&
        !mobileChecking &&
        passwordValid &&
        password === confirmPassword &&
        !!confirmPassword;

    // Register button
	const [registerLoading, setRegisterLoading] = useState(false);
	const [registerMessage, setRegisterMessage] = useState("");
	const handleRegister = async (e) => {
	    e.preventDefault();
		
	    setEmailTouched(true);
	    setPasswordTouched(true);
	    setConfirmTouched(true);
	    setRegisterMessage("");

	    if (!digilockerProfile) {
	        setRegisterMessage("Please complete DigiLocker verification first.");
	        return;
	    }

	    /*if (emailError) {
	        return;
	    }*/

	    if (!passwordValid) {
	        return;
	    }

	    if (password !== confirmPassword) {
	        return;
	    }

	    if (!isFormValid) {
	        return;
	    }
	    try {
	        setRegisterLoading(true);

	        const registrationData = {
	            academicyear: academicYear,
	            name: panDetails.name || "",
	            dob: panDetails.dob || "",
	            gender: panDetails.gender || "",
	            mobileno: mobile,
	            aadhaarcard: panDetails.number || "",
	            pancard: panDetails.number || "",
	            password: password,
	            confirmpassword: confirmPassword
	        };

	        console.log("Registration Data:", registrationData);

	        const response = await fetch(
	            `${API_BASE_URL}/api/registrationlogin/register`,
	            {
	                method: "POST",
	                headers: {
	                    "Content-Type": "application/json"
	                },
	                body: JSON.stringify(registrationData)
	            }
	        );

	        const data = await response.json();

	        console.log("Registration Response:", data);

			if (response.ok && data.success === true) {

			    setAlertBox({
			        show: true,
			        type: "success",
			        message: data.message || "Registration completed successfully!"
			    });

			    setTimeout(() => {
			        navigate("/slrc/login");
			    }, 5000);

			} else {

			    setAlertBox({
			        show: true,
			        type: "error",
			        message: data.message || "Registration failed. Please try again."
			    });

			    setTimeout(() => {
			        setAlertBox({
			            show: false,
			            type: "",
			            message: ""
			        });
			    }, 5000);
			}

	    } catch (error) {
	        console.error("Registration Error:", error);
	        setRegisterMessage("Unable to complete registration. Please try again.");
	    } finally {
	        setRegisterLoading(false);
	    }
	};

	
	
    return (

        <div className="register-page">

            <Header />

            <main className="dls">

                <div className="dls-wrap">

                    <div className="dls-intro">
                        <h2>Candidate Registration</h2>
                        <p>Verify your details and complete registration</p>
                    </div>

                    {/* DigiLocker Login */}
                    {!digilockerProfile && (

                        <div className="dls-login-card">

                            <div className="dls-login-icon">
                                <i className="fa fa-id-card"></i>
                            </div>

                            <h3>Continue with DigiLocker</h3>

                            <p>
                                Fetch your verified PAN Card details securely
                                from your DigiLocker account.
                            </p>

                            <button
                                type="button"
                                className="dls-login-btn"
                                onClick={continueWithDigiLocker}
                                disabled={digilockerLoading}
                            >
                                {digilockerLoading
                                    ? "Please wait..."
                                    : "Continue with DigiLocker"}
                            </button>

                            {digilockerError && (
                                <p className="dls-error">
                                    {digilockerError}
                                </p>
                            )}

                        </div>

                    )}

                    {/* Registration Section */}
                    {digilockerProfile && (

                        <div className="dls-card">

                            {/* Success Banner */}
                            <div className="dls-status">

                                <span className="dls-status-icon">✓</span>

                                <div>
                                    <strong>Verification Successful</strong>
                                    <p>
                                        DigiLocker verification completed successfully
                                    </p>
                                </div>

                            </div>

                            <form className="dls-form" onSubmit={handleRegister}>

                                {/* PAN Card Details */}
                                <section className="dls-panel">

                                    <div className="dls-panel-head">
                                        <h3>Personal Details</h3>

                                        <span className="dls-tag">
                                            <FiLock className="dls-input-icon" />
                                            Verified through DigiLocker
                                        </span>
                                    </div>

                                    <div className="dls-details dls-details-4">


                                        <div className="dls-detail">
                                            <label>Academic Year</label>
											<input
											    type="text"
											    value={academicYear}
											    disabled
											/>
                                        </div>
                                        <div className="dls-detail">
                                            <label>Candidate Name</label>
                                            <input
                                                type="text"
                                                value={panDetails.name || "Not Available"}
                                                readOnly
                                            />
                                        </div>

                                        <div className="dls-detail">
                                            <label>Date of Birth</label>
                                            <input
                                                type="text"
                                                value={formatDob(panDetails.dob) || "Not Available"}
                                                readOnly
                                            />
                                        </div>





                                        <div className="dls-detail">
                                            <label>Gender</label>
                                            <input
                                                type="text"
                                                value={formatGender(panDetails.gender) || "Not Available"}
                                                readOnly
                                            />
                                        </div>

										<div className="dls-detail">
										    <label>Candidate PAN Number</label>

											<input
											    type="text"
											    value={panDetails.number || "Not Available"}
											    readOnly
											    onClick={() => {
											        if (panDetails.number) {
											            checkPanCardExist(panDetails.number);
											        }
											    }}
											/>

										    {panChecking && (
										        <p className="dls-field-error">Checking PAN number...</p>
										    )}

										    {!panChecking && panExists && (
										        <p className="dls-field-error">
										            PAN Card number is already registered.
										        </p>
										    )}
										</div>
										
										<div className="dls-detail">
										    <label>Candidate Aadhaar Number</label>

											<input
											      type="text"
											      value={panDetails.number || ""}
											      placeholder="Aadhaar Number"
											      readOnly
											      onClick={() => {
											          if (panDetails.number) {
											              checkAadhaarCardExist(panDetails.number);
											          }
											      }}
											  />

										    {aadhaarChecking && (
										        <p className="dls-field-error">
										            Checking Aadhaar number...
										        </p>
										    )}

										    {!aadhaarChecking && aadhaarExists && (
										        <p className="dls-field-error">
										            {aadhaarMessage}
										        </p>
										    )}
										</div>

                                    </div>

                                </section>

                                {/* Contact Details */}

                                <section className="dls-panel">

                                    <div className="dls-panel-head">
                                        <h3>Contact Details</h3>

                                        <span className="dls-tag">
                                            <FiEdit />
                                            Enter manually
                                        </span>
                                    </div>

                                    <div className="dls-contact-details">

                                        <div className="dls-field">

                                            <label>
                                                Mobile Number <span>*</span>
                                            </label>

                                            <div className="dls-input-wrap">
                                                <FiPhone className="dls-input-icon" />

                                                <input
                                                    type="tel"
                                                    value={mobile}
                                                    maxLength="10"
                                                    placeholder="Enter 10-digit mobile number"
                                                    autoComplete="tel"
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                                                        setMobile(value);
                                                        setMobileExists(false);
                                                        setRegisterMessage("");
                                                    }}
                                                    onBlur={() => {
                                                        setMobileTouched(true);
                                                        if (/^[6-9]\d{9}$/.test(mobile)) {
                                                            checkMobileNoExist(mobile);
                                                        }
                                                    }}
                                                />
                                            </div>

                                            {mobileTouched && mobileError && (
                                                <p className="dls-field-error">{mobileError}</p>
                                            )}

                                            {mobileTouched && !mobileError && mobileChecking && (
                                                <p className="dls-field-error">Checking mobile number...</p>
                                            )}

                                            {mobileTouched && !mobileError && !mobileChecking && mobileExists && (
                                                <p className="dls-field-error">
                                                     mobile number is already registered.
                                                </p>
                                            )}

                                        </div>

                                        {/*<div className="dls-field">

                                            <label>
                                                Email Address <span>*</span>
                                            </label>

                                            <div className="dls-input-wrap">
                                                <i className="fa fa-envelope"></i>

                                                <input
                                                    type="email"
                                                    value={email}
                                                    placeholder="Enter your email address"
                                                    autoComplete="email"
                                                    onChange={(e) => {
                                                        setEmail(e.target.value);
                                                        setRegisterMessage("");
                                                    }}
                                                    onBlur={() => setEmailTouched(true)}
                                                />
                                            </div>

                                            {emailTouched && emailError && (
                                                <p className="dls-field-error">{emailError}</p>
                                            )}

                                        </div>*/}

                                    </div>

                                </section>

                                {/* Password Section */}
                                <section className="dls-panel">

                                    <div className="dls-panel-head">
                                        <h3>Create Login Password</h3>
                                    </div>

                                    <div className="dls-password-section">

                                        <h4>
                                            Create a password to log in to the portal
                                        </h4>

                                        <div className="dls-password-grid">

                                            {/* Password */}
                                            <div className="dls-field">

                                                <label>
                                                    Password <span>*</span>
                                                </label>

                                                <div className="dls-input-wrap">

                                                    <FiLock className="dls-input-icon" />

                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        value={password}
                                                        maxLength="20"
                                                        placeholder="Create a password"
                                                        autoComplete="new-password"
                                                        onChange={(e) => {
                                                            setPassword(e.target.value);
                                                            setRegisterMessage("");
                                                        }}
                                                        onBlur={() => setPasswordTouched(true)}
                                                    />

                                                    <button
                                                        type="button"
                                                        className="dls-eye"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                                    >
                                                        {showPassword ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19"
                                                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M3 3l18 18" />
                                                                <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
                                                                <path d="M9.88 5.09A10.94 10.94 0 0 1 12 4.9c5 0 9 4.5 10 7.1a11.8 11.8 0 0 1-3.1 4.3" />
                                                                <path d="M6.6 6.6A12.5 12.5 0 0 0 2 12c1 2.6 5 7.1 10 7.1a10.8 10.8 0 0 0 4-.8" />
                                                            </svg>
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19"
                                                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                                                                <circle cx="12" cy="12" r="3" />
                                                            </svg>
                                                        )}
                                                    </button>

                                                </div>

                                                {passwordTouched && passwordError && (
                                                    <p className="dls-field-error">
                                                        {passwordError}
                                                    </p>
                                                )}

                                            </div>

                                            {/* Confirm Password */}
                                            <div className="dls-field">

                                                <label>
                                                    Confirm Password <span>*</span>
                                                </label>

                                                <div className="dls-input-wrap">

                                                    <FiLock className="dls-input-icon" />

                                                    <input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        value={confirmPassword}
                                                        maxLength="20"
                                                        placeholder="Re-enter the password"
                                                        autoComplete="new-password"
                                                        onChange={(e) => {
                                                            setConfirmPassword(e.target.value);
                                                            setRegisterMessage("");
                                                        }}
                                                        onBlur={() => setConfirmTouched(true)}
                                                    />

                                                    <button
                                                        type="button"
                                                        className="dls-eye"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                                    >
                                                        {showConfirmPassword ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19"
                                                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M3 3l18 18" />
                                                                <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
                                                                <path d="M9.88 5.09A10.94 10.94 0 0 1 12 4.9c5 0 9 4.5 10 7.1a11.8 11.8 0 0 1-3.1 4.3" />
                                                                <path d="M6.6 6.6A12.5 12.5 0 0 0 2 12c1 2.6 5 7.1 10 7.1a10.8 10.8 0 0 0 4-.8" />
                                                            </svg>
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19"
                                                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                                                                <circle cx="12" cy="12" r="3" />
                                                            </svg>
                                                        )}
                                                    </button>

                                                </div>

                                                {confirmTouched && confirmError && (
                                                    <p className="dls-field-error">
                                                        {confirmError}
                                                    </p>
                                                )}

                                            </div>

                                        </div>

                                        {/* Password Rules */}
                                        <ul className="dls-password-rules">

                                            <li className={passwordRules.length ? "met" : ""}>
                                                ✓ 8–20 characters
                                            </li>

                                            <li className={passwordRules.upper ? "met" : ""}>
                                                ✓ One capital letter
                                            </li>

                                            <li className={passwordRules.lower ? "met" : ""}>
                                                ✓ One small letter
                                            </li>

                                            <li className={passwordRules.digit ? "met" : ""}>
                                                ✓ One number
                                            </li>

                                            <li className={passwordRules.special ? "met" : ""}>
                                                ✓ One special character (@ # $)
                                            </li>

                                        </ul>

                                    </div>

                                </section>

                                {/* Registration Message */}
                                {registerMessage && (
                                    <div className="dls-message">
                                        {registerMessage}
                                    </div>
                                )}

                                {/* Register Button */}
                                <div className="dls-action">

                                    <p>
                                        Please check your details above.
                                        Click <strong>Register</strong> to complete your registration.
                                    </p>

									<button
									    type="submit"
									    className="dls-register-btn"
									    disabled={!isFormValid || registerLoading}
									>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="10" cy="7" r="4" />
                                            <line x1="19" y1="8" x2="19" y2="14" />
                                            <line x1="22" y1="11" x2="16" y2="11" />
                                        </svg>
                                        Register
                                    </button>

                                </div>

                            </form>
							
							{alertBox.show && (
							    <div className="dls-alert-overlay">
							        <div className={`dls-alert-popup ${alertBox.type}`}>

							            <div className="dls-alert-icon">
							                {alertBox.type === "success" ? "✓" : "!"}
							            </div>

							            <h3>
							                {alertBox.type === "success" ? "Success!" : "Alert!"}
							            </h3>

							            <p>{alertBox.message}</p>

							            <div className="dls-alert-progress">
							                <div></div>
							            </div>

							        </div>
							    </div>
							)}

                        </div>
						
						

                    )}

                </div>

            </main>

            <Footer />

        </div>

    );

}

export default Register;
