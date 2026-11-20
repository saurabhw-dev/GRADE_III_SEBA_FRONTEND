
import React, { useEffect, useRef, useState } from 'react';

const API_BASE_URL = "http://localhost";

function Register() {

    const [digilockerLoading, setDigilockerLoading] = useState(false);
    const [digilockerProfile, setDigilockerProfile] = useState(null);
    const [digilockerError, setDigilockerError] = useState("");

    const callbackProcessed = useRef(false);

    // Continue with DigiLocker
    const continueWithDigiLocker = () => {
        setDigilockerLoading(true);
        window.location.href = API_BASE_URL + "/api/digilocker/authorize";
    };

    // Handle DigiLocker redirect back to React
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

				// Now retrieve e-Aadhaar
				/*const aadhaarResponse = await fetch(
				    API_BASE_URL + "/api/digilocker/eaadhaar",
				    {
				        method: "GET",
				        credentials: "include"
				    }
				);

				if (!aadhaarResponse.ok) {
				    throw new Error("Unable to retrieve e-Aadhaar document.");
				}

				const aadhaarData = await aadhaarResponse.json();

				console.log("DigiLocker Profile:", data);
				console.log("e-Aadhaar Response:", aadhaarData);*/
				
				// Retrieve Driving Licence issued documents
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

				console.log("DigiLocker Profile:", data);
				console.log("Driving Licence Documents:", drivingData);
				
				
				/*const drivingXmlResponse = await fetch(
				    API_BASE_URL + "/api/digilocker/driving-license-xml",
				    {
				        method: "GET",
				        credentials: "include"
				    }
				);

				const drivingXmlData = await drivingXmlResponse.json();

				if (!drivingXmlResponse.ok) {
				    throw new Error(
				        drivingXmlData.message || "Unable to retrieve Driving Licence XML."
				    );
				}

				console.log("Driving Licence XML:", drivingXmlData.xml);
				*/
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

				console.log("PAN Card XML:", panData.xml);
                // Remove code and state from browser URL
                window.history.replaceState(
                    {},
                    document.title,
                    window.location.pathname
                );

                console.log("DigiLocker Profile:", data);

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
        <div>

            <button
                type="button"
                onClick={continueWithDigiLocker}
                disabled={digilockerLoading}
            >
                {digilockerLoading
                    ? "Please wait..."
                    : "Continue with DigiLocker"}
            </button>

            {digilockerError && (
                <p style={{ color: "red" }}>
                    {digilockerError}
                </p>
            )}

            {digilockerProfile && (
                <div>
                    <h3>DigiLocker Verification Successful</h3>
                    <pre>
                        {JSON.stringify(digilockerProfile, null, 2)}
                    </pre>
                </div>
            )}

        </div>
    );
}

export default Register;
