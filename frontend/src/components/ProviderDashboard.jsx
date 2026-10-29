import React, { useState, useEffect } from 'react';
import api from '../lib/axios';

const ProviderDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loadingProfile, setLoadingProfile] = useState(false);

    useEffect(() => {
        setupProfile();
        fetchRequests();
        const interval = setInterval(fetchRequests, 3000); // poll every 3s
        return () => clearInterval(interval);
    }, []);

    const setupProfile = async () => {
        setLoadingProfile(true);
        try {
            // Setup a dummy profile if none exists so they appear in 'Nearby'
            await api.post('/api/services/providers/', {
                service_type: 'MECHANIC',
                latitude: 0.0,
                longitude: 0.0,
                is_available: true
            });
        } catch (err) {
            // Already exists or other error, ignore setup
        } finally {
            setLoadingProfile(false);
        }
    };

    const fetchRequests = async () => {
        try {
            const res = await api.get('/api/services/requests/');
            setRequests(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAccept = async (id) => {
        try {
            await api.post(`/api/services/requests/${id}/accept/`);
            fetchRequests();
        } catch (err) {
            console.error(err);
        }
    };

    const handleComplete = async (id) => {
        try {
            await api.post(`/api/services/requests/${id}/complete/`);
            fetchRequests();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm mt-2">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Incoming Service Requests</h2>
                <span className="flex items-center text-sm font-medium text-green-600">
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    Live Feed
                </span>
            </div>
            
            <div className="space-y-4">
                {requests.length > 0 ? requests.map((req) => (
                    <div key={req.id} className={`p-5 rounded-lg border-l-4 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${
                        req.status === 'PENDING' ? 'border-yellow-400 bg-yellow-50/30' :
                        req.status === 'ACCEPTED' ? 'border-blue-400 bg-blue-50/30' :
                        'border-green-400 bg-gray-50 opacity-70'
                    }`}>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                                    req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                    req.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800' :
                                    'bg-green-100 text-green-800'
                                }`}>{req.status}</span>
                                <span className="text-sm font-bold text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200">{req.service_type}</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Client: {req.user_details?.username}</h3>
                            <p className="text-sm text-gray-500 mt-1 flex items-center">
                                <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                Est. Location: ({req.latitude}, {req.longitude})
                            </p>
                            <p className="text-xs text-gray-400 mt-2">Requested at: {new Date(req.created_at).toLocaleString()}</p>
                        </div>
                        
                        <div className="flex md:flex-col gap-3 shrink-0">
                            {req.status === 'PENDING' && (
                                <button onClick={() => handleAccept(req.id)} className="w-full px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors">
                                    Accept Job
                                </button>
                            )}
                            {req.status === 'ACCEPTED' && (
                                <button onClick={() => handleComplete(req.id)} className="w-full px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors">
                                    Mark as Completed
                                </button>
                            )}
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                        <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p className="text-gray-500 font-medium">No service requests assigned to you yet.</p>
                        <p className="text-gray-400 text-sm mt-1">We'll automatically fetch new requests every 3 seconds.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProviderDashboard;
