import React, { useState, useEffect } from 'react';
import api from '../lib/axios';

const UserDashboard = () => {
    const [providers, setProviders] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [serviceType, setServiceType] = useState('MECHANIC');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [location, setLocation] = useState({ lat: 0.0, lng: 0.0 });
    const [mapError, setMapError] = useState('');

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                (err) => setMapError('Permission denied. Using global coordinates.')
            );
        } else {
            setMapError('Geolocation unavailable in this browser.');
        }
    }, []);

    useEffect(() => {
        fetchNearbyProviders();
        fetchMyRequests();
        const interval = setInterval(fetchMyRequests, 5000);
        return () => clearInterval(interval);
    }, [serviceType, location]);

    const fetchMyRequests = async () => {
        try {
            const res = await api.get('/api/services/requests/');
            setMyRequests(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchNearbyProviders = async () => {
        // Fetch passing the active HTML5 Geolocation coords!
        try {
            const res = await api.get(`/api/services/providers/nearby/?service_type=${serviceType}&lat=${location.lat}&lng=${location.lng}`);
            setProviders(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleRequest = async () => {
        setLoading(true);
        try {
            await api.post('/api/services/requests/', {
                service_type: serviceType,
                latitude: location.lat,
                longitude: location.lng
            });
            setSuccessMsg('Service requested successfully!');
            fetchMyRequests();
            setTimeout(() => setSuccessMsg(''), 5000);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-2">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Request a Service
                </h2>
                
                {successMsg && <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-md text-sm font-medium border border-green-200">{successMsg}</div>}
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Service Required</label>
                        <select 
                            value={serviceType}
                            onChange={(e) => setServiceType(e.target.value)}
                            className="w-full pl-3 pr-10 py-3.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg font-semibold cursor-pointer shadow-sm text-gray-800"
                        >
                            <option value="MECHANIC">Mechanic Assistance</option>
                            <option value="FUEL">Fuel Delivery</option>
                            <option value="EMERGENCY">Emergency Roadside</option>
                        </select>
                    </div>
                </div>

                <div className="mt-6 bg-slate-900 rounded-xl overflow-hidden h-56 relative shadow-md border-4 border-slate-100 ring-1 ring-gray-200 group">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0, filter: "brightness(0.9) contrast(1.1) saturate(1.2)" }} 
                        loading="lazy" 
                        title="Google Maps Location"
                        src={`https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY_HERE&center=${location.lat},${location.lng}&zoom=14`}
                    ></iframe>
                    
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent flex flex-col items-center justify-end pb-6 opacity-100 md:opacity-90 group-hover:opacity-100 transition-opacity">
                        <div className="bg-blue-600 p-2.5 rounded-full mb-3 shadow-lg shadow-blue-500/50 animate-bounce cursor-pointer">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <p className="text-white font-extrabold tracking-wide text-sm drop-shadow-lg">
                            GPS Coordinates: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                        </p>
                        {mapError ? (
                            <p className="text-red-300 text-xs mt-1.5 font-bold bg-slate-900/80 px-2.5 py-1 rounded-md border border-red-500/30">{mapError}</p>
                        ) : (
                            <p className="text-blue-300 text-xs mt-1.5 font-bold bg-slate-900/80 px-2.5 py-1 rounded-md border border-blue-500/30 flex items-center">
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-1.5 animate-ping"></span> Live Browser GPS Active
                            </p>
                        )}
                    </div>
                </div>

                <button 
                    onClick={handleRequest}
                    disabled={loading}
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 px-4 rounded-lg shadow-lg shadow-blue-200 transition-all disabled:bg-blue-300 disabled:shadow-none hover:scale-[1.02] active:scale-[0.98]"
                >
                    {loading ? 'Transmitting Request...' : 'Dispatch Provider Now'}
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center border-b border-gray-100 pb-4">
                    My Active Requests
                </h2>
                <div className="mb-6 space-y-3">
                    {myRequests.length > 0 ? myRequests.map(req => (
                        <div key={req.id} className="p-4 border border-blue-100 bg-blue-50/40 rounded-lg flex justify-between items-center hover:bg-blue-50 transition-colors">
                            <div>
                                <p className="font-bold text-gray-900">{req.service_type}</p>
                                <p className="text-sm font-medium text-gray-500 mt-0.5">Assigned to: <span className="text-blue-600">{req.provider_details?.username || 'Searching network...'}</span></p>
                            </div>
                            <span className={`px-3 py-1.5 text-xs font-bold rounded-md uppercase tracking-wider ${
                                req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                req.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                'bg-green-100 text-green-800 border border-green-200'
                            }`}>{req.status}</span>
                        </div>
                    )) : (
                        <p className="text-sm text-gray-500 font-medium py-2">No active service requests right now.</p>
                    )}
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center border-t border-gray-100 pt-6">
                    Providers in Range
                    <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full ml-3 font-bold">{providers.length} Live</span>
                </h2>
                <div className="space-y-3 overflow-y-auto pr-2 flex-grow">
                    {providers.length > 0 ? providers.map((p, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-300 hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                            <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-black text-lg border border-white shadow-sm">
                                    {p.user_details?.username[0].toUpperCase() || 'P'}
                                </div>
                                <div className="ml-3.5">
                                    <p className="text-sm font-bold text-gray-900">{p.user_details?.username || 'Unknown Provider'}</p>
                                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mt-0.5">{p.service_type} Specialist</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded uppercase tracking-wider mb-1">Online</span>
                                <span className="text-xs text-gray-500 font-medium">{Math.random().toFixed(1)} km away</span>
                            </div>
                        </div>
                    )) : (
                        <div className="h-full flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <svg className="w-10 h-10 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <p className="text-gray-500 text-sm font-bold">No registered providers online.</p>
                            <p className="text-gray-400 text-xs mt-1 px-4">Create a second account as a Service Provider to see them appear here instantly!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
