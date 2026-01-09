import { useState, useEffect, useRef } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaComments, FaTrash } from 'react-icons/fa';
import { SiGoogleforms } from "react-icons/si";
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import CaptureForm from './CaptureForm';
import { useChat } from '../hooks/useChat';

const FloatingChatbot = ({
    messages = [],
    isLoading = false,
    isOnline = true,
    onSendMessage,
    onCaptureSubmit,
    onClearChat,
    triggerCapture = false,
    triggerReason = null,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const { showCaptureForm, setShowCaptureForm } = useChat();
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const chatContainerRef = useRef(null);

    const recentMessages = messages.slice(-4);

    // Show capture form when triggerCapture is true
    useEffect(() => {
        if (triggerCapture && !showCaptureForm) {
            setShowCaptureForm(true);
        }
    }, [triggerCapture]);

    useEffect(() => {
        if (isOpen && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading, isOpen]);

    useEffect(() => {
        if (isOpen && inputRef.current && !showCaptureForm) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen, showCaptureForm]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputText.trim() && !isLoading && isOnline) {
            onSendMessage(inputText);
            setInputText('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleSubmit(e);
        }
    };

    const handleCaptureSubmit = async (formData) => {
        try {
            await onCaptureSubmit(formData);
            setShowCaptureForm(false);
        } catch (error) {
            console.error('Failed to submit form:', error);
        }
    };

    const handleCaptureFormClose = () => {
        setShowCaptureForm(false);
    };

    const handleClearChat = async () => {
        if (onClearChat) {
            try {
                await onClearChat();
                setShowClearConfirm(false);
            } catch (error) {
                console.error('Failed to clear chat:', error);
            }
        }
    };

    const showClearConfirmation = () => {
        setShowClearConfirm(true);
    };

    const cancelClearChat = () => {
        setShowClearConfirm(false);
    };

    const quickReplies = [
        { text: "Services?", emoji: "💼" },
        { text: "Training info", emoji: "🎓" },
        { text: "Hiring?", emoji: "👥" }
    ];

    const handleQuickReply = (text) => {
        onSendMessage(text);
    };

    const openCaptureForm = () => {
        setShowCaptureForm(true);
    };

    return (
        <div className="fixed sm:bottom-2 bottom-0 sm:right-6 right-2 z-50">
            {/* Chat Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="group relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-sky-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer animate-fade-in"
                >
                    <FaRobot className="text-2xl" />

                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>

                    {/* Notification badge for unread messages or pending capture */}
                    {(recentMessages.length > 0 || triggerCapture) && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                            {triggerCapture ? '!' : recentMessages.length}
                        </div>
                    )}

                    {/* Tooltip */}
                    <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        Chat with MinterBot
                    </div>
                </button>
            )}

            {/* Clear Chat Confirmation Modal */}
            {showClearConfirm && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaTrash className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Clear Chat History?</h3>
                            <p className="text-gray-600 text-sm mb-6">
                                Are you sure you want to clear the chat history? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleClearChat}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
                                >
                                    Yes, Clear Chat
                                </button>
                                <button
                                    onClick={cancelClearChat}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg border border-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Capture Form Overlay */}
            {showCaptureForm && (
                <CaptureForm
                    onSubmit={handleCaptureSubmit}
                    onClose={handleCaptureFormClose}
                    triggerReason={triggerReason}
                />
            )}

            {/* Chat Container */}
            {isOpen && !showCaptureForm && (
                <div
                    ref={chatContainerRef}
                    className="absolute bottom-full right-0 mb-4 sm:w-96 w-88 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-slide-up"
                >
                    {/* Chat Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-sky-600 text-white px-6 py-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                        <FaRobot className="text-lg" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">MinterBot Assistant</h3>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* Clear chat button - show when there are messages */}
                                {messages.length > 0 && (
                                    <button
                                        onClick={showClearConfirmation}
                                        className="w-8 h-8 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center cursor-pointer"
                                        title="Clear Chat History"
                                    >
                                        <FaTrash className="w-4 h-4" />
                                    </button>
                                )}
                                {/* Contact form button */}
                                {messages.length > 0 && (
                                    <button
                                        onClick={openCaptureForm}
                                        className="w-8 h-8 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center cursor-pointer"
                                        title="Contact Form"
                                    >
                                        <SiGoogleforms className="w-4 h-4" />
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-8 h-8 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center cursor-pointer"
                                >
                                    <FaTimes className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Replies */}
                    <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-4 border-b border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-sm font-medium text-gray-700">Quick questions:</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {quickReplies.map((reply, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleQuickReply(reply.text)}
                                    disabled={isLoading || !isOnline}
                                    className="px-3 py-1.5 bg-white border border-blue-200 text-blue-700 rounded-full text-sm hover:bg-blue-50 transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <span>{reply.emoji}</span>
                                    <span>{reply.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="h-80 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
                        {recentMessages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-sky-100 rounded-full flex items-center justify-center mb-4">
                                    <FaComments className="w-8 h-8 text-blue-600" />
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">Start a conversation</h4>
                                <p className="text-gray-600 text-sm mb-4">
                                    Ask me about Minterminds' services, training programs, or career opportunities.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={openCaptureForm}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white rounded-lg text-sm transition-colors shadow-sm cursor-pointer"
                                    >
                                        Contact Us
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentMessages.map((message) => (
                                    <ChatMessage key={message.id} message={message} />
                                ))}
                                {isLoading && <TypingIndicator />}
                                <div ref={messagesEndRef} />

                                {/* Prompt for contact form after certain number of messages */}
                                {recentMessages.length >= 3 && !messages.some(m => m.trigger_capture) && (
                                    <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-blue-800 mb-1">Need more information?</p>
                                                <p className="text-xs text-blue-600">Let us contact you with personalized details.</p>
                                            </div>
                                            <button
                                                onClick={openCaptureForm}
                                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors cursor-pointer"
                                            >
                                                Contact Us
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Chat Input */}
                    <div className="border-t border-gray-200 px-4 py-2 bg-white">
                        {!isOnline && (
                            <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-yellow-800 text-sm text-center">
                                    ⚠️ You're currently offline. Messages will be sent when connection is restored.
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex gap-3">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                disabled={isLoading || !isOnline}
                                className="flex-1 px-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
                            />
                            <button
                                type="submit"
                                disabled={!inputText.trim() || isLoading || !isOnline}
                                className={`p-3 rounded-xl transition-all duration-200 flex items-center gap-2 ${inputText.trim() && isOnline && !isLoading
                                    ? 'bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white shadow-md hover:shadow-lg cursor-pointer'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <FaPaperPlane className="w-5 h-5" />
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FloatingChatbot;