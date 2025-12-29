import { FaGithub, FaInfoCircle } from 'react-icons/fa';

const ChatHeader = () => {
    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-sky-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">M</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Minterminds AI Chatbot</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <a
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                            <FaGithub className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default ChatHeader;