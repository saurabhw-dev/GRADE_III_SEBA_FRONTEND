import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../HeaderFooter/HeaderDashboard';
import Footer from '../HeaderFooter/Footer';
import Instructions from './Instructions';
import Application from './Application';

function Dashboard() {
    const navigate = useNavigate();
    const [showApplication, setShowApplication] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            navigate('/slrc/Login', {
                replace: true,
                state: {
                    alertType: 'error',
                    message: 'Please login first. Your session is missing or expired.'
                }
            });
        }
    }, [navigate]);

    if (!sessionStorage.getItem("token")) {
        return null;
    }

    return (
        <>
            <Header />

            <main className="dashboard-main">
                <div className="dashboard-container">

                    {!showApplication ? (
                        <>
                            <Instructions
                                onStart={() => setShowApplication(true)}
                            />
                        </>
                    ) : (
                        <Application />
                    )}

                </div>
            </main>

             <Footer /> 
        </>
    );
}

export default Dashboard;