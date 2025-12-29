export const formatTime = (timestamp) => {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (timestamp) => {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    return date.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const getInitialMessage = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
        return "Good morning! Welcome to Minterminds. How can I help you today?";
    } else if (hour < 18) {
        return "Good afternoon! Welcome to Minterminds. How can I assist you?";
    } else {
        return "Good evening! Welcome to Minterminds. How can I help you?";
    }
};

export const extractSuggestions = (message) => {
    // Extract potential questions from message
    const suggestions = [
        "What services do you offer?",
        "Do you provide training programs?",
        "Are you hiring?",
        "Can you build a mobile app?",
        "What's your development process?",
        "How much does it cost?",
        "Can I see your portfolio?",
        "Do you offer UI/UX design?",
    ];

    // Filter based on message context
    if (message.toLowerCase().includes('service')) {
        return ["What services do you offer?", "Can you build a website?", "Do you offer mobile app development?"];
    }

    if (message.toLowerCase().includes('train')) {
        return ["What training programs do you offer?", "How long are the courses?", "Is there certification?"];
    }

    if (message.toLowerCase().includes('job') || message.toLowerCase().includes('career')) {
        return ["Are you hiring?", "What positions are available?", "How do I apply?"];
    }

    return suggestions.slice(0, 3);
};

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validatePhone = (phone) => {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\D/g, ''));
};