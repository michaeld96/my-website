import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NewNote from './pages/NewNote';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import AdminHub from './pages/AdminHub';

const App: React.FC = () => {
    return(
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/new-note" element={ <NewNote/> }/>
                <Route path="/admin-login" element={ <Login/> }/>
                <Route path="/admin-hub" element={ <AdminHub/> }/>
            </Routes>
        </Router>
    )
}

export default App;