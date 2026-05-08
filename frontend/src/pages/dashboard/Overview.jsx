import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { Activity, Users, BookOpen, PlusCircle, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Overview() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalTests: 0,
    avgScore: 0,
    recentAssessments: [],
    chartData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`,
          },
        };
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

  const statCards = [
    { name: 'Tests Completed', value: stats.totalTests, icon: BookOpen },
    { name: 'Average Score', value: `${stats.avgScore}%`, icon: Activity },
    { name: 'Global Rank', value: 'Top 15%', icon: Users }, // Mock global stat
  ];

  if (loading) {
     return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-brand-light">Welcome back, {user?.name.split(' ')[0]}</h1>
          <p className="text-brand-light/60 mt-1">Here's an overview of your recent assessment performance.</p>
        </div>
        <Link to="/dashboard/assessments/new" className="hidden md:flex items-center gap-2 bg-brand-accent text-brand-dark px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-[0_0_15px_rgba(255,133,187,0.3)]">
          <PlusCircle className="w-5 h-5" /> New Assessment
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="glass-card p-6 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-brand-primary/40 border border-brand-accent/20">
              <stat.icon className="w-6 h-6 text-brand-secondary" />
            </div>
            <div>
              <p className="text-brand-light/60 text-sm font-medium">{stat.name}</p>
              <p className="text-2xl font-bold text-brand-light mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glass-card p-8 lg:col-span-2">
          <h2 className="text-xl font-bold text-brand-light mb-6">Performance Trend</h2>
          <div className="h-[300px] w-full">
            {stats.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF85BB" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#FF85BB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 133, 187, 0.1)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(245, 245, 245, 0.5)" tick={{fill: 'rgba(245, 245, 245, 0.5)'}} />
                  <YAxis stroke="rgba(245, 245, 245, 0.5)" tick={{fill: 'rgba(245, 245, 245, 0.5)'}} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(2, 26, 84, 0.9)', borderColor: 'rgba(255, 133, 187, 0.3)', borderRadius: '0.5rem', color: '#F5F5F5' }}
                    itemStyle={{ color: '#FFCEE3' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#FF85BB" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-brand-primary/30 rounded-xl">
                <p className="text-brand-light/50 mb-4">Complete an assessment to see your trend.</p>
                <Link to="/dashboard/assessments/new" className="text-brand-secondary hover:text-brand-accent font-medium">Get Started</Link>
              </div>
            )}
          </div>
        </div>

        <div className="glass-card p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-brand-light">Recent Tests</h2>
            <Link to="/dashboard/history" className="text-sm text-brand-secondary hover:text-brand-accent transition-colors flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentAssessments.length > 0 ? (
              stats.recentAssessments.map((test) => (
                <div key={test._id} className="bg-brand-primary/20 border border-brand-accent/10 p-4 rounded-xl flex items-center justify-between">
                  <div className="overflow-hidden">
                    <p className="font-medium text-brand-light truncate">{test.topic}</p>
                    <p className="text-xs text-brand-light/50 mt-1">{new Date(test.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className={`font-bold px-3 py-1 rounded-full text-sm ${test.completed ? (test.percentage >= 60 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400') : 'bg-brand-secondary/20 text-brand-secondary'}`}>
                    {test.completed ? `${test.percentage}%` : 'Draft'}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-brand-light/50 text-sm">No recent tests.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
