import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Users, DollarSign, Activity, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    totalUsers: 0,
    loading: true
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const [ordersRes, usersRes] = await Promise.all([
          fetch('https://t-shirt-brand-mern.onrender.com/api/orders', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('https://t-shirt-brand-mern.onrender.com/api/users', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        const ordersData = await ordersRes.json();
        const usersData = await usersRes.json();

        if (ordersData.success) {
          const orders = ordersData.data;
          const totalSales = orders.reduce((acc, curr) => acc + (curr.isPaid ? curr.totalPrice : 0), 0);
          
          setStats({
            totalOrders: orders.length,
            totalSales,
            totalUsers: usersData.success ? usersData.data.length : 0,
            loading: false
          });
        }
      } catch (error) {
        console.error('Failed to fetch admin stats', error);
        setStats(s => ({ ...s, loading: false }));
      }
    };

    fetchStats();
  }, [user, navigate]);

  if (stats.loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500">Welcome back, {user?.name}. Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
              <DollarSign className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Revenue</p>
              <h3 className="text-2xl font-black text-slate-900">{formatPrice(stats.totalSales)}</h3>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
              <Package className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Orders</p>
              <h3 className="text-2xl font-black text-slate-900">{stats.totalOrders}</h3>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-4 bg-purple-50 text-purple-600 rounded-xl">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Customers</p>
              <h3 className="text-2xl font-black text-slate-900">{stats.totalUsers}</h3>
            </div>
          </motion.div>
        </div>

        {/* Quick Links */}
        <h2 className="text-xl font-bold text-slate-900 mb-6">Management Areas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/admin/orders" className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <div className="p-3 bg-slate-900 text-white rounded-lg">
                <Activity className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Manage Orders</h3>
            <p className="text-slate-500 text-sm">View all customer orders, update shipping statuses, and process refunds.</p>
          </Link>
          
          <Link to="/admin/products" className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <div className="p-3 bg-slate-900 text-white rounded-lg">
                <Package className="w-6 h-6" />
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Manage Products</h3>
            <p className="text-slate-500 text-sm">Add or edit T-shirts, manage stock and prices.</p>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
