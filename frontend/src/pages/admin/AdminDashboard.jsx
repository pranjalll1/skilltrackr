import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, FileText, CheckCircle, Trash2, ShieldAlert, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}` } };
      const { data } = await axios.get('/api/admin/stats', config);
      setStats(data);
    } catch (err) {
      toast.error('Failed to load admin stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user and all their data?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}` } };
      await axios.delete(`/api/admin/users/${id}`, config);
      toast.success('User deleted successfully');
      fetchStats(); // Refresh
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading || !stats) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand-accent animate-spin" /></div>;

  const statCards = [
    { name: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-400', border: 'border-l-blue-500' },
    { name: 'Assessments Generated', value: stats.totalAssessments, icon: FileText, color: 'text-purple-400', border: 'border-l-purple-500' },
    { name: 'Assessments Completed', value: stats.completedAssessments, icon: CheckCircle, color: 'text-green-400', border: 'border-l-green-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-8 border-b border-red-500/30 pb-6">
        <div className="p-4 bg-red-500/20 rounded-2xl border border-red-500/40 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-red-100">Admin Control Panel</h1>
          <p className="text-red-200/60 mt-1">Platform-wide statistics and user management.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className={`glass-card p-6 border-l-4 ${stat.border}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-brand-light/70 font-medium">{stat.name}</span>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-4xl font-bold text-brand-light">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-8">
        <h2 className="text-xl font-bold text-brand-light mb-6">Recent Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-accent/20 text-brand-light/50 text-sm uppercase tracking-wider">
                <th className="pb-4 pl-4">Name</th>
                <th className="pb-4">Email</th>
                <th className="pb-4">Role</th>
                <th className="pb-4 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-accent/10">
              {stats.recentUsers.map((user) => (
                <tr key={user._id} className="hover:bg-brand-primary/10 transition-colors">
                  <td className="py-4 pl-4 font-medium text-brand-light">{user.name}</td>
                  <td className="py-4 text-brand-light/70">{user.email}</td>
                  <td className="py-4">
                    {user.isAdmin ? (
                      <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-500/30">Admin</span>
                    ) : (
                      <span className="bg-brand-primary/40 text-brand-secondary px-3 py-1 rounded-full text-xs font-bold border border-brand-accent/30">User</span>
                    )}
                  </td>
                  <td className="py-4 text-right pr-4">
                    {!user.isAdmin && (
                      <button 
                        onClick={() => deleteUser(user._id)}
                        className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
