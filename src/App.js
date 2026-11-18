
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Homepage from './html/webpages/clientside/HomePage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/seba" element={<Homepage />} />
                <Route path="/" element={<Navigate to="/seba" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
