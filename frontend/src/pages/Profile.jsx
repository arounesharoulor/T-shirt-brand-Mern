import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Lock, Save, ArrowLeft, LogOut, 
  ShoppingBag, Settings, CreditCard, MapPin, Camera, 
  ShieldCheck, Package
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('personal');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchProfileData = async () => {
        try {
          const token = localStorage.getItem('token');
          const headers = {
            'Authorization': `Bearer ${token}`
          };
          
          // Fetch Orders
          const ordersRes = await fetch('https://t-shirt-brand-mern.onrender.com/api/orders/myorders', { headers });
          const ordersData = await ordersRes.json();
          if (ordersData.success) {
            setOrders(ordersData.data);
          }
          setLoadingOrders(false);

          // Fetch User Addresses
          const userRes = await fetch('https://t-shirt-brand-mern.onrender.com/api/auth/me', { headers });
          const userData = await userRes.json();
          if (userData.success && userData.data.addresses) {
            setAddresses(userData.data.addresses);
          }
          setLoadingAddresses(false);
        } catch (error) {
          console.error("Error fetching profile data:", error);
          setLoadingOrders(false);
          setLoadingAddresses(false);
        }
      };

      fetchProfileData();
    }
  }, [user]);

  const groupedOrders = useMemo(() => {
    // Ensure orders are sorted newest first
    const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const groups = [];
    sortedOrders.forEach(order => {
      const date = new Date(order.createdAt);
      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      let group = groups.find(g => g.name === monthYear);
      if (!group) {
        group = { name: monthYear, items: [] };
        groups.push(group);
      }
      group.items.push(order);
    });
    return groups;
  }, [orders]);

  const handleProfileChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const saveProfile = (e) => {
    e.preventDefault();
    login(formData);
    toast.success('Profile updated successfully!');
  };

  const savePassword = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    toast.success('Password updated successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center bg-white p-10 rounded-3xl border border-slate-100 shadow-sm max-w-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Access Denied</h2>
          <p className="text-slate-500 mb-8">Please sign in to view your profile and order history.</p>
          <button onClick={() => navigate('/login')} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // Helper to get initials
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const tabs = [
    { id: 'personal', label: 'Account Details', icon: User },
    { id: 'orders', label: 'Order History', icon: ShoppingBag },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] pb-24">
      
      {/* Banner / Header section */}
      <div className="h-72 bg-slate-900 relative overflow-hidden -mt-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative h-full flex items-start pt-28">
          <button onClick={() => navigate(-1)} className="flex items-center text-sm font-bold text-white/70 hover:text-white transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        
        {/* User Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-4xl font-display font-extrabold shrink-0">
                {getInitials(user.name)}
              </div>
              <button className="absolute bottom-2 right-2 w-8 h-8 bg-white text-slate-900 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform opacity-0 group-hover:opacity-100">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center sm:text-left pb-2">
              <h1 className="text-3xl font-display font-extrabold text-slate-900">{user.name || 'User'}</h1>
              <p className="text-slate-500 font-medium mt-1 flex items-center justify-center sm:justify-start gap-1">
                <ShieldCheck className="w-4 h-4 text-green-500" /> Premium Member
              </p>
            </div>
          </div>
          
          <div className="pb-2">
            <button onClick={handleLogout} className="flex items-center text-sm font-bold text-slate-500 bg-slate-50 border border-slate-200 px-5 py-2.5 rounded-xl hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Nav */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 sticky top-28">
              <nav className="flex flex-col space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (tab.id === 'orders') {
                        navigate('/my-orders');
                      } else {
                        setActiveTab(tab.id);
                      }
                    }}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                      activeTab === tab.id 
                        ? 'bg-slate-900 text-white shadow-md' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`} />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              
              {/* PERSONAL DETAILS */}
              {activeTab === 'personal' && (
                <motion.div
                  key="personal"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100"
                >
                  <div className="mb-8 border-b border-slate-100 pb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Account Details</h2>
                    <p className="text-slate-500 mt-2">Manage your personal information and contact details.</p>
                  </div>

                  <form onSubmit={saveProfile} className="max-w-2xl space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Full Legal Name</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-slate-400" />
                          </div>
                          <input type="text" name="name" value={formData.name} onChange={handleProfileChange} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900" required />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-400" />
                          </div>
                          <input type="email" name="email" value={formData.email} onChange={handleProfileChange} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900" required />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Phone Number</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-slate-400" />
                          </div>
                          <input type="tel" name="phone" value={formData.phone} onChange={handleProfileChange} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900" required />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6">
                      <button type="submit" className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 hover:-translate-y-0.5">
                        <Save className="w-4 h-4" /> Save Changes
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* SECURITY */}
              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100"
                >
                  <div className="mb-8 border-b border-slate-100 pb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Security</h2>
                    <p className="text-slate-500 mt-2">Update your password and secure your account.</p>
                  </div>

                  <form onSubmit={savePassword} className="max-w-xl space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Current Password</label>
                      <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900" required placeholder="••••••••" />
                    </div>
                    
                    <div className="pt-4 border-t border-slate-100">
                      <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">New Password</label>
                      <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900" required placeholder="••••••••" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Confirm New Password</label>
                      <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900" required placeholder="••••••••" />
                    </div>

                    <div className="pt-6">
                      <button type="submit" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 hover:-translate-y-0.5">
                        Update Password
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}



              {/* ADDRESSES TAB */}
              {activeTab === 'addresses' && (
                <motion.div
                  key="addresses"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100"
                >
                  <div className="mb-8 border-b border-slate-100 pb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Saved Addresses</h2>
                    <p className="text-slate-500 mt-2">Manage your shipping addresses for faster checkout.</p>
                  </div>
                  
                  {loadingAddresses ? (
                    <div className="flex justify-center items-center h-48">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-12">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                        <MapPin className="w-10 h-10 text-slate-300" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">No saved addresses</h3>
                      <p className="text-slate-500 max-w-md">Save your shipping addresses here for a faster checkout experience.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {addresses.map((addr, idx) => (
                        <div key={idx} className="border border-slate-200 rounded-2xl p-6 relative group hover:border-slate-300 transition-colors">
                          {addr.isDefault && (
                            <span className="absolute top-4 right-4 bg-slate-900 text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded">Default</span>
                          )}
                          <div className="flex items-start gap-3 mb-3">
                            <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                            <div>
                              <p className="font-bold text-slate-900">{user.name}</p>
                              <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                                {addr.street}<br />
                                {addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.zipCode}<br />
                                {addr.country}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
