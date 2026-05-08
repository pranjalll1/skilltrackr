import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar as CalendarIcon, CheckCircle, Circle, Trash2, Plus, Edit2, Loader2 } from 'lucide-react';
import { format, isToday, isPast } from 'date-fns';
import toast from 'react-hot-toast';

export default function StudyPlanner() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: format(new Date(), 'yyyy-MM-dd')
  });

  const fetchTasks = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}` } };
      const { data } = await axios.get('/api/tasks', config);
      setTasks(data);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}` } };
      
      if (editingTask) {
        await axios.put(`/api/tasks/${editingTask._id}`, formData, config);
        toast.success('Task updated');
      } else {
        await axios.post('/api/tasks', formData, config);
        toast.success('Task added');
      }
      
      setShowModal(false);
      setEditingTask(null);
      setFormData({ title: '', description: '', dueDate: format(new Date(), 'yyyy-MM-dd') });
      fetchTasks();
    } catch (err) {
      toast.error('Failed to save task');
    }
  };

  const toggleTask = async (task) => {
    try {
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}` } };
      await axios.put(`/api/tasks/${task._id}`, { completed: !task.completed }, config);
      fetchTasks();
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}` } };
      await axios.delete(`/api/tasks/${id}`, config);
      toast.success('Task deleted');
      fetchTasks();
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      dueDate: format(new Date(task.dueDate), 'yyyy-MM-dd')
    });
    setShowModal(true);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand-accent animate-spin" /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-brand-light">Weekly Study Planner</h1>
          <p className="text-brand-light/60 mt-1">Organize your goals and track your progress.</p>
        </div>
        <button 
          onClick={() => { setEditingTask(null); setFormData({ title: '', description: '', dueDate: format(new Date(), 'yyyy-MM-dd') }); setShowModal(true); }}
          className="flex items-center gap-2 bg-brand-accent text-brand-dark px-6 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-[0_0_15px_rgba(255,133,187,0.3)]"
        >
          <Plus className="w-5 h-5" /> Add Task
        </button>
      </div>

      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-brand-light font-medium">Overall Progress</span>
          <span className="text-brand-accent font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full bg-brand-primary/30 rounded-full h-3">
          <div className="bg-brand-accent h-3 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map(task => (
          <div key={task._id} className={`glass-card p-6 border ${task.completed ? 'border-green-500/30 bg-green-500/5' : 'border-brand-accent/20'} relative group`}>
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEditModal(task)} className="p-1 text-brand-light/50 hover:text-brand-secondary"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => deleteTask(task._id)} className="p-1 text-brand-light/50 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
            </div>

            <div className="flex items-start gap-4">
              <button onClick={() => toggleTask(task)} className="mt-1 flex-shrink-0">
                {task.completed ? <CheckCircle className="w-6 h-6 text-green-400" /> : <Circle className="w-6 h-6 text-brand-light/40 hover:text-brand-accent transition-colors" />}
              </button>
              <div>
                <h3 className={`text-lg font-bold ${task.completed ? 'line-through text-brand-light/50' : 'text-brand-light'}`}>{task.title}</h3>
                {task.description && <p className="text-brand-light/60 text-sm mt-2">{task.description}</p>}
                
                <div className="flex items-center gap-2 mt-4 text-xs font-medium">
                  <CalendarIcon className="w-4 h-4 text-brand-secondary" />
                  <span className={`${isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && !task.completed ? 'text-red-400' : 'text-brand-light/70'}`}>
                    {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="col-span-full py-12 text-center text-brand-light/50 border-2 border-dashed border-brand-accent/20 rounded-2xl">
            No tasks found. Create one to get started!
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md p-6 border border-brand-accent/30 shadow-2xl shadow-brand-accent/20">
            <h2 className="text-2xl font-bold text-brand-light mb-6">{editingTask ? 'Edit Task' : 'New Task'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-brand-light/70 text-sm mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-brand-primary/20 border border-brand-accent/30 rounded-lg p-3 text-brand-light focus:outline-none focus:border-brand-accent" />
              </div>
              <div>
                <label className="block text-brand-light/70 text-sm mb-1">Description (Optional)</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-brand-primary/20 border border-brand-accent/30 rounded-lg p-3 text-brand-light focus:outline-none focus:border-brand-accent min-h-[100px]" />
              </div>
              <div>
                <label className="block text-brand-light/70 text-sm mb-1">Due Date</label>
                <input required type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="w-full bg-brand-primary/20 border border-brand-accent/30 rounded-lg p-3 text-brand-light focus:outline-none focus:border-brand-accent" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-lg border border-brand-light/20 text-brand-light hover:bg-brand-primary/30 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-lg bg-brand-accent text-brand-dark font-bold hover:bg-opacity-90 transition-colors">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
