import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export const chatAPI = {
    // Send message to chatbot
    sendMessage: async (sessionId, message) => {
        const payload = sessionId ? { session_id: sessionId, message } : { message };
        const response = await api.post('/chat', payload);
        return response.data;
    },

    // Capture user data
    captureUser: async (data) => {
        const response = await api.post('/capture', data);
        return response.data;
    },

    // Clear chat session
    clearChat: async (sessionId) => {
        const response = await api.post('/chat/clear', {
            session_id: sessionId,
        });
        return response.data;
    },

    // Check API health
    checkHealth: async () => {
        try {
            const response = await api.get('/health');
            return response.data;
        } catch (error) {
            return { status: 'unhealthy', error: error.message };
        }
    },

    // Get knowledge base stats
    getKnowledgeStats: async () => {
        const response = await api.get('/knowledge/stats');
        return response.data;
    },
};

// For debugging
export const debugAPI = {
    // List active sessions
    listSessions: async () => {
        const response = await api.get('/chat/sessions');
        return response.data;
    },
};

export default api;