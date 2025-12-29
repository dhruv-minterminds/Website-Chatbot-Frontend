import { FaRobot } from 'react-icons/fa';

const TypingIndicator = () => {
    return (
        <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-sky-500 flex items-center justify-center">
                <FaRobot className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col items-start">
                <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-gradient-to-r from-blue-50 to-white text-gray-800 border border-blue-100">
                    <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TypingIndicator;