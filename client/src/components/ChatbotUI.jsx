import { useState, useRef, useEffect } from 'react';
import { FiMessageCircle, FiX, FiSend, FiMinimize2 } from 'react-icons/fi';
import { aiAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ChatbotUI() {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hey there! 👋 I\'m TravelGenius, your AI travel assistant. Ask me anything about Indian destinations, hotels, itineraries, or trip planning!' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await aiAPI.chat({ message: userMessage });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: isAuthenticated
          ? 'Sorry, I had trouble processing that. Please try again! 🔄'
          : 'Please log in to chat with me! 🔐'
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow hover:scale-110 transition-all animate-float">
        <FiMessageCircle className="text-white text-xl" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] glass-card flex flex-col animate-scale-in overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-primary">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">🧠</div>
          <div>
            <h3 className="font-semibold text-white text-sm">TravelGenius AI</h3>
            <p className="text-white/70 text-xs">Online — Ask me anything</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-all">
            <FiMinimize2 size={16} />
          </button>
          <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-all">
            <FiX size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-primary-600 text-white rounded-br-md'
                : 'bg-surface-700/50 text-surface-200 rounded-bl-md'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-surface-700/50 px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-surface-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-surface-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-surface-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/5">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask about destinations, hotels..."
            className="input-field !py-2.5 !text-sm !rounded-xl flex-1"
          />
          <button onClick={sendMessage} disabled={!input.trim() || loading}
            className="btn-primary !p-2.5 !rounded-xl disabled:opacity-50">
            <FiSend size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
