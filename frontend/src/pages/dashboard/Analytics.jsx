import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Target, TrendingUp, Award, Zap, Loader2 } from 'lucide-react';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}` } };
        const { data } = await axios.get('/api/assessments/stats', config);
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand-accent animate-spin" /></div>;

  // Mock topic performance data based on history
  const topicData = [
    { subject: 'React', A: 90, fullMark: 100 },
    { subject: 'Node.js', A: 65, fullMark: 100 },
    { subject: 'MongoDB', A: 85, fullMark: 100 },
    { subject: 'CSS', A: 95, fullMark: 100 },
    { subject: 'Python', A: 45, fullMark: 100 },
  ];

  // Mock leaderboard
  const leaderboard = [
    { name: 'Alex M.', score: 98, rank: 1 },
    { name: 'Sarah J.', score: 94, rank: 2 },
    { name: 'You', score: stats.avgScore, rank: 3 },
    { name: 'David K.', score: 88, rank: 4 },
    { name: 'Emma W.', score: 82, rank: 5 },
  ];

  const accuracy = stats.avgScore;
  const isImproving = stats.chartData.length >= 2 && stats.chartData[stats.chartData.length - 1]?.score >= stats.chartData[0]?.score;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-light">Analytics Dashboard</h1>
        <p className="text-brand-light/60 mt-1">Deep dive into your learning metrics and performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 border-l-4 border-l-brand-accent">
          <div className="flex items-center justify-between mb-4">
            <span className="text-brand-light/70 font-medium">Global Accuracy</span>
            <Target className="w-6 h-6 text-brand-secondary" />
          </div>
          <p className="text-4xl font-bold text-brand-light">{accuracy}%</p>
        </div>
        
        <div className="glass-card p-6 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between mb-4">
            <span className="text-brand-light/70 font-medium">Performance Trend</span>
            <TrendingUp className={`w-6 h-6 ${isImproving ? 'text-green-400' : 'text-red-400'}`} />
          </div>
          <p className="text-xl font-bold text-brand-light">{isImproving ? 'Improving' : 'Needs Focus'}</p>
        </div>

        <div className="glass-card p-6 border-l-4 border-l-blue-500 md:col-span-2 flex items-center justify-between">
          <div>
            <span className="text-brand-light/70 font-medium block mb-2">Strongest Topic</span>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" />
              <span className="text-2xl font-bold text-brand-light">CSS (95%)</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-brand-light/70 font-medium block mb-2">Weakest Topic</span>
            <div className="flex items-center gap-2 justify-end">
              <span className="text-2xl font-bold text-brand-light">Python (45%)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glass-card p-6 lg:col-span-2">
          <h2 className="text-xl font-bold text-brand-light mb-6">Subject Proficiency Radar</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={topicData}>
                <PolarGrid stroke="rgba(255, 133, 187, 0.2)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#F5F5F5', fontSize: 14 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'rgba(245,245,245,0.5)' }} />
                <Radar name="Score" dataKey="A" stroke="#FF85BB" fill="#FF85BB" fillOpacity={0.5} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(2, 26, 84, 0.9)', borderColor: 'rgba(255, 133, 187, 0.3)', color: '#F5F5F5' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-brand-light">Global Leaderboard</h2>
            <Award className="w-6 h-6 text-brand-accent" />
          </div>
          
          <div className="flex-1 space-y-4">
            {leaderboard.map((user, idx) => (
              <div key={idx} className={`flex items-center justify-between p-4 rounded-xl border ${user.name === 'You' ? 'bg-brand-primary/40 border-brand-accent shadow-[0_0_15px_rgba(255,133,187,0.2)]' : 'bg-brand-primary/10 border-brand-accent/10'}`}>
                <div className="flex items-center gap-4">
                  <span className={`font-bold w-6 text-center ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-amber-600' : 'text-brand-light/50'}`}>
                    #{user.rank}
                  </span>
                  <span className={`font-medium ${user.name === 'You' ? 'text-brand-accent' : 'text-brand-light'}`}>{user.name}</span>
                </div>
                <span className="font-bold text-brand-secondary">{user.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
