import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, Clock, ChevronRight, Loader2 } from 'lucide-react';

export default function History() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('All');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}` } };
        // We can reuse the stats endpoint or create a new history endpoint. 
        // For now, let's assume the stats endpoint returns all recent assessments.
        // Actually, we can fetch all from /api/assessments/stats and use recentAssessments if we didn't limit it, 
        // but wait, in assessmentController we only returned 5. Let's create a quick endpoint if needed, or just use stats.
        // I will just fetch stats and rely on recentAssessments for now, but really we should have a /history route.
        // Since I didn't add a /history route in the backend, I'll fetch /stats and just show what's there.
        // Wait, let's just make a GET /api/assessments return all user assessments.
        const { data } = await axios.get('/api/assessments', config);
        setAssessments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredAssessments = assessments.filter(a => {
    const matchesSearch = a.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'All' || a.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand-accent animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-light">Assessment History</h1>
          <p className="text-brand-light/60 mt-1">Review your past tests and scores.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-light/40" />
            <input 
              type="text" 
              placeholder="Search topics..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-brand-primary/20 border border-brand-accent/30 rounded-xl py-2 pl-10 pr-4 text-brand-light focus:outline-none focus:border-brand-accent w-full sm:w-64"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-light/40" />
            <select 
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="bg-brand-primary/20 border border-brand-accent/30 rounded-xl py-2 pl-10 pr-8 text-brand-light focus:outline-none focus:border-brand-accent appearance-none w-full sm:w-auto"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {filteredAssessments.length > 0 ? (
          <div className="divide-y divide-brand-accent/10">
            {filteredAssessments.map((assessment) => (
              <Link 
                key={assessment._id} 
                to={assessment.completed ? `/dashboard/assessments/${assessment._id}/result` : `/dashboard/assessments/${assessment._id}/take`}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-brand-primary/20 transition-colors"
              >
                <div className="mb-4 sm:mb-0">
                  <h3 className="text-lg font-bold text-brand-light flex items-center gap-2">
                    {assessment.topic}
                    {!assessment.completed && <span className="text-xs bg-brand-secondary/20 text-brand-secondary px-2 py-1 rounded-full">In Progress</span>}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-brand-light/60">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(assessment.createdAt).toLocaleDateString()}</span>
                    <span className="uppercase tracking-wider font-medium text-brand-light/50">{assessment.difficulty}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  {assessment.completed && (
                    <div className="text-right">
                      <p className="text-sm text-brand-light/60 mb-1">Score</p>
                      <p className={`text-xl font-bold ${assessment.percentage >= 60 ? 'text-green-400' : 'text-red-400'}`}>
                        {assessment.percentage}%
                      </p>
                    </div>
                  )}
                  <ChevronRight className="w-6 h-6 text-brand-light/30" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-brand-light/50">
            No assessments found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
