import { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { Camera, User, Mail, Shield, BookMarked, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfileSettings() {
  const { user, login } = useContext(AuthContext); // Reusing login to update context user state
  const [loading, setLoading] = useState(false);
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`,
        },
      };

      const { data } = await axios.post('/api/auth/profile/image', formData, config);
      login(data); // Update global user state with new image
      toast.success('Profile image updated successfully');
    } catch (err) {
      toast.error('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-light">Profile Settings</h1>
        <p className="text-brand-light/60 mt-1">Manage your account and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="glass-card p-8 flex flex-col items-center text-center">
            <div className="relative mb-6 group cursor-pointer">
              {loading ? (
                <div className="w-32 h-32 rounded-full border-4 border-brand-accent/30 flex items-center justify-center bg-brand-primary/20">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-accent" />
                </div>
              ) : (
                <>
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-brand-accent/50 group-hover:border-brand-accent transition-colors" />
                  ) : (
                    <div className="w-32 h-32 rounded-full border-4 border-brand-accent/50 group-hover:border-brand-accent flex items-center justify-center bg-brand-accent/20 text-brand-secondary text-4xl font-bold transition-colors">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <label htmlFor="profile-upload" className="absolute bottom-0 right-0 w-10 h-10 bg-brand-accent rounded-full flex items-center justify-center text-brand-dark cursor-pointer hover:bg-opacity-90 shadow-lg">
                    <Camera className="w-5 h-5" />
                  </label>
                  <input id="profile-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={loading} />
                </>
              )}
            </div>
            <h2 className="text-2xl font-bold text-brand-light mb-1">{user.name}</h2>
            <p className="text-brand-light/60 flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" /> {user.email}
            </p>
            {user.isAdmin && (
              <span className="mt-4 flex items-center gap-1 bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-bold border border-red-500/30">
                <Shield className="w-4 h-4" /> Administrator
              </span>
            )}
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          <div className="glass-card p-8">
            <h3 className="text-xl font-bold text-brand-light mb-6">Personal Information</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-brand-light/70 text-sm font-medium mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-light/40" />
                  <input type="text" disabled value={user.name} className="w-full bg-brand-primary/10 border border-brand-accent/20 rounded-xl py-3 pl-12 pr-4 text-brand-light/70 cursor-not-allowed" />
                </div>
              </div>
              <div>
                <label className="block text-brand-light/70 text-sm font-medium mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-light/40" />
                  <input type="email" disabled value={user.email} className="w-full bg-brand-primary/10 border border-brand-accent/20 rounded-xl py-3 pl-12 pr-4 text-brand-light/70 cursor-not-allowed" />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <BookMarked className="w-6 h-6 text-brand-accent" />
              <h3 className="text-xl font-bold text-brand-light">Bookmarked Questions</h3>
            </div>
            <div className="border-2 border-dashed border-brand-accent/20 rounded-xl p-12 text-center">
              <p className="text-brand-light/50">You haven't bookmarked any questions yet.</p>
              <p className="text-sm text-brand-light/40 mt-2">Bookmarked questions during assessments will appear here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
