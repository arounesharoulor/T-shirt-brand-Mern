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

  const updateStatus = async (orderId, status, refundProof = null) => {
    setActionLoading(orderId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://t-shirt-brand-mern.onrender.com/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, refundProof })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Order marked as ${status}`);
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
                  <th className="p-4 font-bold text-slate-500 text-sm uppercase tracking-wider">Status</th>
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
                      {order.status === 'Delivered' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                          <Check className="w-3 h-3" /> Delivered
                        </span>
                      )}
                      {order.status === 'In Transit' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                          <Truck className="w-3 h-3" /> In Transit
                        </span>
                      )}
                      {order.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                          <Loader2 className="w-3 h-3" /> Pending
                        </span>
                      )}
                      {(order.status === 'Cancelled' || order.status === 'Returned') && (
                        <span className="inline-flex flex-col gap-1 px-2.5 py-1 rounded-xl bg-red-100 text-red-700 text-xs font-bold">
                          <div className="flex items-center gap-1"><X className="w-3 h-3" /> {order.status}</div>
                          {order.refundProof && <div className="text-[10px] font-normal break-all">Proof: {order.refundProof}</div>}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <select 
                        value={order.status}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          let proof = null;
                          if (newStatus === 'Cancelled' || newStatus === 'Returned') {
                            proof = window.prompt("Please enter the refund transaction ID or proof (optional):");
                          }
                          updateStatus(order._id, newStatus, proof);
                        }}
                        disabled={actionLoading === order._id}
                        className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-slate-900 disabled:opacity-50"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Returned">Returned</option>
                      </select>
                      {actionLoading === order._id && <Loader2 className="w-4 h-4 animate-spin ml-2 inline" />}
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
