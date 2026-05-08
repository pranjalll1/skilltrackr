import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { Brain, Loader2, Target, BarChart2 } from 'lucide-react';

export default function NewAssessment() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''}`,
        },
      };

      const { data } = await axios.post('/api/assessments/generate', { topic, difficulty }, config);
      navigate(`/dashboard/assessments/${data._id}/take`);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-brand-light mb-4">Generate Assessment</h1>
        <p className="text-brand-light/60">Our AI will create a custom test based on your topic and skill level.</p>
      </div>

      <div className="glass-card p-8 relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
            <Brain className="w-16 h-16 text-brand-accent animate-pulse mb-4" />
            <h3 className="text-xl font-bold text-brand-light mb-2">Generating your test...</h3>
            <p className="text-brand-light/60">Analyzing topic and crafting questions.</p>
            <Loader2 className="w-6 h-6 text-brand-secondary animate-spin mt-6" />
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-lg font-medium text-brand-light mb-3">What do you want to learn about?</label>
            <div className="relative">
              <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-brand-light/40" />
              <input 
                type="text" 
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-brand-primary/20 border border-brand-accent/30 rounded-xl py-4 pl-14 pr-6 text-lg text-brand-light focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors"
                placeholder="e.g., React Hooks, Machine Learning basics, Python..."
              />
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium text-brand-light mb-4">Select Difficulty</label>
            <div className="grid grid-cols-3 gap-4">
              {['Easy', 'Medium', 'Hard'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  className={`py-4 px-6 rounded-xl border transition-all ${
                    difficulty === level 
                      ? 'bg-brand-primary/40 border-brand-accent text-brand-secondary shadow-[0_0_15px_rgba(255,133,187,0.3)]' 
                      : 'bg-brand-primary/10 border-brand-accent/20 text-brand-light/70 hover:border-brand-accent/50'
                  }`}
                >
                  <BarChart2 className={`w-5 h-5 mx-auto mb-2 ${difficulty === level ? 'text-brand-accent' : 'text-brand-light/50'}`} />
                  <span className="font-semibold block text-center">{level}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-brand-accent/10">
            <button 
              type="submit" 
              className="w-full bg-brand-accent hover:bg-opacity-90 text-brand-dark font-bold text-lg py-4 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(255,133,187,0.4)]"
            >
              Generate Test
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
