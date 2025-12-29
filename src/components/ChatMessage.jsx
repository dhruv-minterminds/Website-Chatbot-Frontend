// components/ChatMessage.jsx - Updated for floating chat
import React from 'react';
import { FaUser, FaRobot, FaExclamationCircle } from 'react-icons/fa';

const ChatMessage = ({ message }) => {
    const isUser = message.sender === 'user';
    const isError = message.isError;
    const isSuccess = message.isSuccess;

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-sky-500 to-sky-600'
                }`}>
                {isUser ? (
                    <FaUser className="w-4 h-4 text-white" />
                ) : (
                    <FaRobot className="w-4 h-4 text-white" />
                )}
            </div>

            <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
                <div className={`rounded-xl px-4 py-3 ${isUser
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                    : 'bg-gradient-to-r from-gray-50 to-white text-gray-800 border border-gray-200'
                    } ${isError ? 'bg-red-50 border-red-200' : ''} ${isSuccess ? 'bg-green-50 border-green-200' : ''}`}>

                    {isError && (
                        <div className="flex items-center gap-2 mb-2">
                            <FaExclamationCircle className="text-red-500 w-4 h-4" />
                            <span className="text-sm font-medium text-red-700">Error</span>
                        </div>
                    )}

                    <p className={`whitespace-pre-wrap text-sm ${isError ? 'text-red-800' : isSuccess ? 'text-green-800' : ''
                        }`}>
                        {message.text}
                    </p>
                </div>

                <div className={`mt-1 text-xs text-gray-500 ${isUser ? 'text-right' : 'text-left'}`}>
                    {formatTime(message.timestamp)}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;