import { useState, useEffect, useCallback } from 'react';
import { chatAPI } from '../services/api';
import { v4 as uuidv4 } from 'uuid';

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCaptureForm, setShowCaptureForm] = useState(false);
  const [triggerReason, setTriggerReason] = useState(null);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [triggerCapture, setTriggerCapture] = useState(false);

  // Initialize or load session
  useEffect(() => {
    const savedSessionId = sessionStorage.getItem('minterminds_session_id');
    const savedMessages = sessionStorage.getItem('minterminds_chat_history');

    if (savedSessionId) {
      setSessionId(savedSessionId);
    } else {
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      sessionStorage.setItem('minterminds_session_id', newSessionId);
    }

    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('Failed to parse saved messages:', e);
      }
    }

    // Check API health on load
    checkAPIHealth();

    // Set up online/offline detection
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  // Save messages to sessionStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('minterminds_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  const handleOnlineStatus = () => {
    setIsOnline(navigator.onLine);
  };

  const checkAPIHealth = async () => {
    try {
      const health = await chatAPI.checkHealth();
      setIsOnline(health.status === 'healthy');
    } catch (error) {
      console.error('Failed to check API health:', error);
      setIsOnline(false);
    }
  };

  const sendMessage = useCallback(async (messageText) => {
    if (!messageText.trim() || isLoading || !isOnline) return;

    // Add user message
    const userMessage = {
      id: uuidv4(),
      text: messageText,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatAPI.sendMessage(sessionId, messageText);

      // Add bot response
      const botMessage = {
        id: uuidv4(),
        text: response.bot_response,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        trigger_capture: response.trigger_capture,
        category: response.category,
        direct_faq: response.direct_faq_used,
      };

      setMessages(prev => [...prev, botMessage]);

      // Show capture form if triggered
      if (response.trigger_capture) {
        setTriggerReason(response.trigger_reason || 'chat_trigger');
        setTriggerCapture(true);
        setShowCaptureForm(true);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');

      // Add error message
      const errorMessage = {
        id: uuidv4(),
        text: 'Sorry, I encountered an error. Please try again or check your connection.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
        isError: true,
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, isLoading, isOnline]);

  const captureUserData = async (userData) => {
    try {
      const data = {
        session_id: sessionId,
        ...userData,
        capture_method: triggerReason || 'chat_trigger',
      };

      const response = await chatAPI.captureUser(data);

      // Add success message
      const successMessage = {
        id: uuidv4(),
        text: response.message || 'Thank you! We will contact you soon.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
        isSuccess: true,
      };

      setMessages(prev => [...prev, successMessage]);
      setShowCaptureForm(false);
      setTriggerCapture(false);
      setTriggerReason(null);

      return response;
    } catch (error) {
      console.error('Error capturing user:', error);
      throw error;
    }
  };

  const clearChat = async () => {
    try {
      if (sessionId) {
        await chatAPI.clearChat(sessionId);
      }

      setMessages([]);
      setTriggerCapture(false);
      setShowCaptureForm(false);
      sessionStorage.removeItem('minterminds_chat_history');

      // Keep session ID but start fresh
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      sessionStorage.setItem('minterminds_session_id', newSessionId);

    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  const dismissCaptureForm = () => {
    setShowCaptureForm(false);
    setTriggerCapture(false);
    setTriggerReason(null);
  };

  return {
    messages,
    sessionId,
    isLoading,
    isOnline,
    error,
    showCaptureForm,
    triggerReason,
    triggerCapture,
    sendMessage,
    captureUserData,
    clearChat,
    dismissCaptureForm,
    checkAPIHealth,
  };
};