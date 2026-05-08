import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}` } };
        const { data } = await axios.get('/api/chat', config);
        setMessages(data.messages || []);
      } catch (err) {
        toast.error('Failed to load chat history');
      }
    };
    fetchHistory();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}` } };
      const { data } = await axios.post('/api/chat', { message: userMessage }, config);
      setMessages(data.messages);
    } catch (err) {
      toast.error('Failed to send message');
      setMessages(prev => [...prev, { role: 'model', content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-brand-light flex items-center gap-3">
          <Bot className="w-8 h-8 text-brand-accent" /> SavvyBot
        </h1>
        <p className="text-brand-light/60 mt-1">Your personal AI educational assistant.</p>
      </div>

      <div className="flex-1 glass-card overflow-hidden flex flex-col border border-brand-accent/20">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-brand-light/40 space-y-4">
              <Bot className="w-16 h-16 opacity-50" />
              <p>Ask me anything about your studies, assessments, or programming!</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-brand-accent/20 border border-brand-accent/40 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-5 h-5 text-brand-accent" />
                </div>
              )}
              
              <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-brand-accent text-brand-dark rounded-br-none shadow-[0_0_15px_rgba(255,133,187,0.3)]' : 'bg-brand-primary/40 border border-brand-accent/10 text-brand-light rounded-bl-none'}`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-brand-light border border-brand-light flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-5 h-5 text-brand-dark" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-4 justify-start">
               <div className="w-8 h-8 rounded-full bg-brand-accent/20 border border-brand-accent/40 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-5 h-5 text-brand-accent" />
                </div>
                <div className="bg-brand-primary/40 border border-brand-accent/10 text-brand-light rounded-2xl rounded-bl-none p-4 flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-brand-accent" />
                  <span className="text-brand-light/60 text-sm">SavvyBot is typing...</span>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-brand-dark/50 border-t border-brand-accent/20">
          <form onSubmit={handleSend} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message SavvyBot..."
              className="w-full bg-brand-primary/20 border border-brand-accent/30 rounded-xl py-4 pl-4 pr-14 text-brand-light focus:outline-none focus:border-brand-accent transition-colors"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-accent text-brand-dark rounded-lg hover:bg-opacity-90 disabled:opacity-50 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
