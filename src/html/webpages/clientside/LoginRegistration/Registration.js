
import React, { useEffect, useRef, useState } from 'react';
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

    const [digilockerLoading, setDigilockerLoading] = useState(false);
    const [digilockerProfile, setDigilockerProfile] = useState(null);
    const [digilockerError, setDigilockerError] = useState("");

    const [drivingData, setDrivingData] = useState(null);
    const [panData, setPanData] = useState(null);

    const callbackProcessed = useRef(false);

    // Password states
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [passwordTouched, setPasswordTouched] = useState(false);
    const [confirmTouched, setConfirmTouched] = useState(false);

    const [registerMessage, setRegisterMessage] = useState("");

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

                const drivingData = await drivingResponse.json();

                setDrivingData(drivingData);

                console.log("Driving Licence Documents:", drivingData);

                // Retrieve PAN Card
                const panResponse = await fetch(
                    API_BASE_URL + "/api/digilocker/pan-card",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                const panData = await panResponse.json();

                if (!panResponse.ok) {
                    throw new Error(
                        panData.message || "Unable to retrieve PAN Card XML."
                    );
                }

                setPanData(panData);

                console.log("PAN Card XML:", panData.xml);
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

    // Register button
    const handleRegister = (e) => {

        e.preventDefault();

        setPasswordTouched(true);
        setConfirmTouched(true);
        setRegisterMessage("");

        if (!digilockerProfile) {
            setRegisterMessage("Please complete DigiLocker verification first.");
            return;
        }

        if (!passwordValid) {
            return;
        }

        if (password !== confirmPassword) {
            return;
        }

        // Registration API is not connected yet.
        setRegisterMessage(
            "Details verified successfully. Please connect the registration API to complete account creation."
        );

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
                                Fetch your verified personal details securely
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
                                        DigiLocker details retrieved successfully
                                    </p>
                                </div>

                            </div>

                            <form className="dls-form" onSubmit={handleRegister}>

                                {/* Personal Details */}
                                <section className="dls-panel">

                                    <div className="dls-panel-head">

                                        <h3>Personal Details</h3>

                                        <span className="dls-tag">
                                            <i className="fa fa-lock"></i>
                                            Auto-filled from DigiLocker
                                        </span>

                                    </div>

                                    <div className="dls-details dls-details-3">

                                        <div className="dls-detail dls-detail-wide">
                                            <label>Full Name</label>
                                            <div>{digilockerProfile.name || "Not Available"}</div>
                                        </div>

                                        <div className="dls-detail">
                                            <label>Date of Birth</label>
                                            <div>{formatDob(digilockerProfile.dob) || "Not Available"}</div>
                                        </div>

                                        <div className="dls-detail">
                                            <label>Gender</label>
                                            <div>{formatGender(digilockerProfile.gender) || "Not Available"}</div>
                                        </div>

                                    </div>

                                </section>

                                {/* PAN Details */}
                                <section className="dls-panel">

                                    <div className="dls-panel-head">

                                        <h3>PAN Card Details</h3>

                                        <span className="dls-tag">
                                            <i className="fa fa-lock"></i>
                                            Auto-filled from DigiLocker
                                        </span>

                                    </div>

                                    {panData && panData.xml && (

                                        <div className="dls-details dls-details-4">

                                            <div className="dls-detail dls-detail-wide">
                                                <label>PAN Holder Name</label>
                                                <div>{panDetails.name || "Not Available"}</div>
                                            </div>

                                            <div className="dls-detail">
                                                <label>PAN Number</label>
                                                <div>{panDetails.number || "Not Available"}</div>
                                            </div>

                                            <div className="dls-detail">
                                                <label>Date of Birth</label>
                                                <div>{formatDob(panDetails.dob) || "Not Available"}</div>
                                            </div>

                                            <div className="dls-detail">
                                                <label>Gender</label>
                                                <div>{formatGender(panDetails.gender) || "Not Available"}</div>
                                            </div>

                                        </div>

                                    )}

                                    {/* Password Section */}
                                    <div className="dls-password-section">

                                        <h4>Create a password to log in to the portal</h4>

                                        <div className="dls-password-grid">

                                            {/* Password */}
                                            <div className="dls-field">

                                                <label>Password <span>*</span></label>

                                                <div className="dls-input-wrap">

                                                    <i className="fa fa-lock"></i>

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
                                                        <i className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"}></i>
                                                    </button>

                                                </div>

                                                {passwordTouched && passwordError && (
                                                    <p className="dls-field-error">{passwordError}</p>
                                                )}

                                            </div>

                                            {/* Confirm Password */}
                                            <div className="dls-field">

                                                <label>Confirm Password <span>*</span></label>

                                                <div className="dls-input-wrap">

                                                    <i className="fa fa-lock"></i>

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
                                                        <i className={showConfirmPassword ? "fa fa-eye-slash" : "fa fa-eye"}></i>
                                                    </button>

                                                </div>

                                                {confirmTouched && confirmError && (
                                                    <p className="dls-field-error">{confirmError}</p>
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
                                        Please check the details above.
                                        Click <strong>Register</strong> to complete your registration.
                                    </p>

									<button
									    type="submit"
									    className="dls-register-btn"
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

                        </div>

                    )}

                </div>

            </main>

            <Footer />

        </div>
    );

}

export default Register;
