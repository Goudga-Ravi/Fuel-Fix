import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(config => {
    // Automatically attach CSRF token if cookie exists
    const token = document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1];
    if (token) {
        config.headers['X-CSRFToken'] = token;
    }
    return config;
});

export default api;
