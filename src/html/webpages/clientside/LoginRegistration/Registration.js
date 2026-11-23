
import React, { useEffect, useRef, useState } from 'react';
import Header from '../HeaderFooter/Header';
import Footer from '../HeaderFooter/Footer';
import './Register.css';
import API_BASE_URL from '../../../../apiConfig';

//const API_BASE_URL = "http://localhost";

function Register() {

    const [digilockerLoading, setDigilockerLoading] = useState(false);
    const [digilockerProfile, setDigilockerProfile] = useState(null);
    const [digilockerError, setDigilockerError] = useState("");

    const [drivingData, setDrivingData] = useState(null);
    const [panData, setPanData] = useState(null);

    const callbackProcessed = useRef(false);

    const [formData, setFormData] = useState({
        name: "",
        dob: "",
        gender: "",
        mobile: "",
        email: "",
        address: "",
        pan: "",
        aadhaar: ""
    });

    // Continue with DigiLocker - ORIGINAL LOGIC
    const continueWithDigiLocker = () => {
        setDigilockerLoading(true);
        window.location.href = API_BASE_URL + "/api/digilocker/authorize";
    };

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle DigiLocker redirect back to React
    // ORIGINAL API FLOW PRESERVED
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

                // Remove code and state from browser URL
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


    return (
        <div className="register-page">

            <Header />

            <div className="register-container">

                <div className="register-heading">
                    <h2>Candidate Registration</h2>
                    <p>Verify your details and complete registration</p>
                </div>

                {!digilockerProfile && (
                    <div className="digilocker-card">
                        <div className="digilocker-icon">
                            <i className="fa fa-id-card"></i>
                        </div>

                        <h3>Continue with DigiLocker</h3>

                        <p>
                            Fetch your verified personal details securely
                            from your DigiLocker account.
                        </p>

                        <button
                            type="button"
                            className="digilocker-btn"
                            onClick={continueWithDigiLocker}
                            disabled={digilockerLoading}
                        >
                            {digilockerLoading
                                ? "Please wait..."
                                : "Continue with DigiLocker"}
                        </button>

                        {digilockerError && (
                            <p className="error-message">
                                {digilockerError}
                            </p>
                        )}
                    </div>
                )}

                {digilockerProfile && (
                    <div className="registration-card">

                        <div className="success-banner">
                            <span>✓</span>
                            <div>
                                <strong>Verification Successful</strong>
                                <p>DigiLocker details retrieved successfully</p>
                            </div>
                        </div>

                        <div className="details-section">
                            <h3>DigiLocker Personal Details</h3>

                            <div className="details-grid">

                                <div className="detail-item">
                                    <label>Full Name</label>
                                    <p>{digilockerProfile.name || "Not Available"}</p>
                                </div>

                                <div className="detail-item">
                                    <label>Date of Birth</label>
                                    <p>{digilockerProfile.dob || "Not Available"}</p>
                                </div>

                                <div className="detail-item">
                                    <label>Gender</label>
                                    <p>{digilockerProfile.gender || "Not Available"}</p>
                                </div>

                            </div>
                        </div>

                        {panData && panData.xml && (() => {
                            const parser = new DOMParser();
                            const xmlDoc = parser.parseFromString(panData.xml, "text/xml");

                            const person = xmlDoc.getElementsByTagName("Person")[0];
                            const pan = xmlDoc.getElementsByTagName("PAN")[0];

                            const panName = person?.getAttribute("name");
                            const panDob = person?.getAttribute("dob");
                            const panNumber = pan?.getAttribute("num");
							const panGender = person?.getAttribute("gender");

                            return (
                                <div className="details-section">
                                    <h3>PAN Card Details</h3>

                                    <div className="details-grid">
                                        <div className="detail-item">
                                            <label>PAN Holder Name</label>
                                            <p>{panName || "Not Available"}</p>
                                        </div>

                                        <div className="detail-item">
                                            <label>PAN Number</label>
                                            <p>{panNumber || "Not Available"}</p>
                                        </div>

                                        <div className="detail-item">
                                            <label>Date of Birth</label>
                                            <p>{panDob || "Not Available"}</p>
                                        </div>

                                        <div className="detail-item">
                                            <label>Gender</label>
                                            <p>{panGender || "Not Available"}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                    </div>
                )}

            </div>

            <Footer />

        </div>
    );


}

export default Register;
