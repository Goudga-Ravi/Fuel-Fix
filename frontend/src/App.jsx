import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = React.useContext(AuthContext);
    
    if (loading) return <div className="min-h-screen flex items-center justify-center text-blue-600 font-medium">Loading User Profile...</div>;
    if (!user) return <Navigate to="/login" replace />;
    
    return children;
};

const Landing = () => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center border border-gray-100">
            <h1 className="text-5xl font-black tracking-tighter text-blue-600 mb-3 drop-shadow-sm">FuelFix</h1>
            <p className="text-gray-500 mb-8 font-medium text-lg">On-Demand Mechanic & Fuel Services</p>
            <div className="space-y-4">
                <a href="/login" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-md transition-all shadow-blue-200">
                    Login to your account
                </a>
                <a href="/register" className="block w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3.5 px-4 rounded-xl border-2 border-gray-200 transition-all">
                    Create new account
                </a>
            </div>
        </div>
    </div>
);

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
