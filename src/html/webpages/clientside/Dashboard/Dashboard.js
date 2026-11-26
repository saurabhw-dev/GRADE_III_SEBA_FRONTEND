import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../HeaderFooter/Header';
import Footer from '../HeaderFooter/Footer';

function Dashboard() {

    const navigate = useNavigate();

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

    // Prevent dashboard from rendering without token
    if (!sessionStorage.getItem("token")) {
        return null;
    }

    return (
        <>
            {/*<Header /> */}

            <main className="dashboard-main">
                <div className="dashboard-container">
                    <h1>Candidate Dashboard</h1>
                </div>
            </main>

            {/*<Footer /> */}
        </>
    );
}

export default Dashboard;