
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './html/webpages/clientside/HomePage';
import LoginPage from './html/webpages/clientside/LoginRegistration/Login';
import RegistrationPage from './html/webpages/clientside/LoginRegistration/Registration';
import DashboardPage from "./html/webpages/clientside/Dashboard/Dashboard";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/slrc" element={<Homepage />} />
                <Route path="/" element={<Navigate to="/slrc" replace />} />
				<Route path="/slrc/Login" element={<LoginPage />} />
				<Route path="/slrc/register" element={<RegistrationPage />} />
				<Route path="/slrc/dashboard" element={<DashboardPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
