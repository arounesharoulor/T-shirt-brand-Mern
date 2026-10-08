import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Truck, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://t-shirt-brand-mern.onrender.com/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        // Sort by newest first
        setOrders(data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const markAsDelivered = async (orderId) => {
    setActionLoading(orderId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://t-shirt-brand-mern.onrender.com/api/orders/${orderId}/deliver`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Order marked as delivered');
        fetchOrders();
      } else {
        toast.error(data.error || 'Failed to update order');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Manage Orders</h1>
          <p className="text-slate-500">View and update customer order statuses.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 font-bold text-slate-500 text-sm uppercase tracking-wider">ID</th>
                  <th className="p-4 font-bold text-slate-500 text-sm uppercase tracking-wider">Customer</th>
                  <th className="p-4 font-bold text-slate-500 text-sm uppercase tracking-wider">Date</th>
                  <th className="p-4 font-bold text-slate-500 text-sm uppercase tracking-wider">Total</th>
                  <th className="p-4 font-bold text-slate-500 text-sm uppercase tracking-wider">Paid</th>
                  <th className="p-4 font-bold text-slate-500 text-sm uppercase tracking-wider">Delivered</th>
                  <th className="p-4 font-bold text-slate-500 text-sm uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono text-xs text-slate-500">{order._id.substring(0, 8)}...</td>
                    <td className="p-4 font-medium text-slate-900">{order.user?.name || 'Unknown'}</td>
                    <td className="p-4 text-slate-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 font-bold text-slate-900">{formatPrice(order.totalPrice)}</td>
                    <td className="p-4">
                      {order.isPaid ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                          <Check className="w-3 h-3" /> Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                          <X className="w-3 h-3" /> Unpaid
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {order.isDelivered ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                          <Check className="w-3 h-3" /> Delivered
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                          <Truck className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {!order.isDelivered && (
                        <button
                          onClick={() => markAsDelivered(order._id)}
                          disabled={actionLoading === order._id}
                          className="inline-flex items-center justify-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
                        >
                          {actionLoading === order._id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Mark Delivered'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-slate-500">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminOrders;
