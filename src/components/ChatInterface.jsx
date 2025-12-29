// src/components/ChatInterface.jsx
import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import ChatHeader from './ChatHeader';
import { FaPaperPlane, FaMicrophone, FaImage, FaLightbulb, FaRobot } from 'react-icons/fa';
import { extractSuggestions, getInitialMessage } from '../utils/helpers';

const ChatInterface = ({
    messages,
    isLoading,
    isOnline,
    onSendMessage,
}) => {
    const [inputText, setInputText] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Initial welcome message
    useEffect(() => {
        if (messages.length === 0 && isOnline) {
            const welcomeMessage = {
                id: 'welcome',
                text: getInitialMessage(),
                sender: 'bot',
                timestamp: new Date().toISOString(),
                isWelcome: true,
            };
            // This would be handled by the chat hook
        }
    }, [messages.length, isOnline]);

    // Extract suggestions from last message
    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.sender === 'bot' && !lastMessage.isError) {
                const newSuggestions = extractSuggestions(lastMessage.text);
                setSuggestions(newSuggestions);
            }
        }
    }, [messages]);

    // Auto-scroll to bottom
    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputText.trim() && !isLoading) {
            onSendMessage(inputText);
            setInputText('');
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        onSendMessage(suggestion);
        setSuggestions([]);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const quickReplies = [
        "Hi! 👋",
        "What services do you offer?",
        "Tell me about training",
        "Are you hiring?",
        "Need a quote",
    ];

    return (
        <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <ChatHeader />

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
                {messages.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaRobot className="w-12 h-12 text-primary-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to MinterBot! 🤖</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            I'm here to help you learn about Minterminds' services, careers, and training programs. How can I assist you today?
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg mx-auto">
                            {quickReplies.map((reply, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSuggestionClick(reply)}
                                    className="p-3 bg-white border border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 text-left"
                                >
                                    <div className="flex items-center gap-2">
                                        <FaLightbulb className="w-4 h-4 text-accent-500 flex-shrink-0" />
                                        <span className="text-sm font-medium text-gray-700">{reply}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Messages */}
                <div className="space-y-2">
                    {messages.map((message) => (
                        <ChatMessage key={message.id} message={message} />
                    ))}

                    {isLoading && <TypingIndicator />}
                </div>

                {/* Suggestions */}
                {suggestions.length > 0 && !isLoading && (
                    <div className="mt-4 animate-fade-in">
                        <div className="flex items-center gap-2 mb-2">
                            <FaLightbulb className="w-4 h-4 text-accent-500" />
                            <span className="text-sm font-medium text-gray-700">Suggested questions:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {suggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-full hover:border-primary-400 hover:bg-primary-50 transition-all duration-200 text-sm"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 bg-white">
                {!isOnline && (
                    <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 text-sm">
                            ⚠️ You're currently offline. Messages will be sent when connection is restored.
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex items-end gap-3">
                    <div className="flex-1 relative">
                        <textarea
                            ref={inputRef}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message here..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none min-h-[56px] max-h-[120px]"
                            rows="1"
                            disabled={isLoading || !isOnline}
                        />

                        <div className="absolute right-3 bottom-3 flex items-center gap-2">
                            <button
                                type="button"
                                className="p-1 text-gray-400 hover:text-gray-600"
                                title="Attach file"
                            >
                                <FaImage className="w-5 h-5" />
                            </button>
                            <button
                                type="button"
                                className="p-1 text-gray-400 hover:text-gray-600"
                                title="Voice input"
                            >
                                <FaMicrophone className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!inputText.trim() || isLoading || !isOnline}
                        className={`p-3 rounded-xl flex-shrink-0 ${inputText.trim() && isOnline
                            ? 'bg-primary-600 hover:bg-primary-700 text-white'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            } transition-colors duration-200`}
                    >
                        <FaPaperPlane className="w-5 h-5" />
                    </button>
                </form>

                <div className="mt-3 text-xs text-gray-500 text-center">
                    <p>MinterBot is powered by AI. Responses may vary. Our team reviews conversations periodically.</p>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;