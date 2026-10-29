import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserDashboard from '../components/UserDashboard';
import ProviderDashboard from '../components/ProviderDashboard';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (!user) {
        return <div className="p-8 text-center text-gray-500">Please log in to view the dashboard.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
                                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                                FuelFix Dashboard
                            </h1>
                            <p className="text-gray-500 mt-2 font-medium text-sm md:text-base">
                                Welcome back, <span className="text-gray-900 font-bold">{user.username}</span>! 
                                <span className={`ml-3 px-2.5 py-1 rounded-md text-xs font-bold ${user.is_provider ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {user.is_provider ? 'SERVICE PROVIDER' : 'USER ACCOUNT'}
                                </span>
                            </p>
                        </div>
                        <button onClick={handleLogout} className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:text-red-600 transition-colors shadow-sm">
                            Sign Out
                        </button>
                    </div>
                </div>

                {user.is_provider ? <ProviderDashboard /> : <UserDashboard />}
            </div>
        </div>
    );
};

export default Dashboard;
