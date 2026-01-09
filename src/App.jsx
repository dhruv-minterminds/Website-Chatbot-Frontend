import { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import FloatingChatbot from './components/FloatingChatbot';
import { useChat } from './hooks/useChat';
import ChatHeader from './components/ChatHeader';

const addCustomStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background-color: #f3f4f6;
    }
    ::-webkit-scrollbar-thumb {
      background-color: #9ca3af;
      border-radius: 9999px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background-color: #6b7280;
    }
  `;
  document.head.appendChild(style);
};

function App() {
  const {
    messages,
    isLoading,
    isOnline,
    error,
    triggerCapture,
    sendMessage,
    captureUserData,
    checkAPIHealth,
    clearChat
  } = useChat();

  const [showInfo, setShowInfo] = useState(false);
  const [showFullChat, setShowFullChat] = useState(false);

  useEffect(() => {
    addCustomStyles();

    const interval = setInterval(() => {
      checkAPIHealth();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = (message) => {
    sendMessage(message);
  };

  const handleCaptureSubmit = async (userData) => {
    await captureUserData(userData);
  };

  const handleCloseFullChat = () => {
    setShowFullChat(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" style={{ fontFamily: "'Inter', 'system-ui', 'sans-serif'" }}>

      {/* Info Modal - Responsive */}
      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50">
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-8 max-w-md w-full m-2">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h3 className="text-lg md:text-2xl font-bold text-gray-900">About MinterBot</h3>
              <button
                onClick={() => setShowInfo(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 md:space-y-4">
              <p className="text-sm md:text-base text-gray-600">
                MinterBot is an AI-powered assistant for Minterminds, helping you learn about our services,
                careers, and training programs.
              </p>

              <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">Features:</h4>
                <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-600">
                  <li className="flex items-center gap-2">• Instant answers about our services</li>
                  <li className="flex items-center gap-2">• Career and training information</li>
                  <li className="flex items-center gap-2">• Lead capture for personalized assistance</li>
                  <li className="flex items-center gap-2">• 24/7 availability</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Responsive */}
      <main className="max-w-full mx-auto px-2 md:px-4 pt-4 md:pt-8 pb-2 md:pb-4">
        {showFullChat ? (
          <div className="relative">
            <button
              onClick={handleCloseFullChat}
              className="absolute top-2 right-2 md:top-4 md:right-4 z-10 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              ✕
            </button>
            <ChatInterface
              messages={messages}
              isLoading={isLoading}
              isOnline={isOnline}
              onSendMessage={handleSendMessage}
            />
          </div>
        ) : (
          <div className="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-8">
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-blue-100 to-sky-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <span className="text-2xl md:text-4xl">🤖</span>
              </div>
              <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">Welcome to MinterBot</h2>
              <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 px-2">
                Our AI assistant is ready to help you learn about Minterminds' services, careers, and training programs.
                Click the chat button in the bottom right to get started!
              </p>

              {/* Update grid for mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                <div className="p-3 md:p-4 bg-blue-50 rounded-xl">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2 md:mb-3">
                    <span className="text-blue-600 text-lg md:text-xl">💼</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">Services</h3>
                  <p className="text-xs md:text-sm text-gray-600">Learn about our offerings</p>
                </div>
                <div className="p-3 md:p-4 bg-sky-50 rounded-xl">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-sky-100 rounded-lg flex items-center justify-center mx-auto mb-2 md:mb-3">
                    <span className="text-sky-600 text-lg md:text-xl">🎓</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">Training</h3>
                  <p className="text-xs md:text-sm text-gray-600">Discover learning paths</p>
                </div>
                <div className="p-3 md:p-4 bg-green-50 rounded-xl">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2 md:mb-3">
                    <span className="text-green-600 text-lg md:text-xl">👥</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">Careers</h3>
                  <p className="text-xs md:text-sm text-gray-600">Join our team</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error message responsive */}
        {error && (
          <div className="mt-3 md:mt-4 p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm md:text-base">{error}</p>
          </div>
        )}
      </main>

      {/* Floating Chatbot - Make sure it has responsive props */}
      <FloatingChatbot
        messages={messages}
        isLoading={isLoading}
        isOnline={isOnline}
        onSendMessage={sendMessage}
        onClearChat={clearChat}
        triggerCapture={triggerCapture}
      />
    </div>
  );
}

export default App;