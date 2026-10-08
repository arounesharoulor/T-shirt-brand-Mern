import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Truck, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
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
    
    // Auto-refresh orders every 5 seconds to show new orders immediately
    const interval = setInterval(() => {
      fetchOrders(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [user, navigate]);

  async function fetchOrders(isSilent = false) {
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
      if (!isSilent) toast.error('Failed to fetch orders');
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

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [refundProof, setRefundProof] = useState('');

  const openStatusModal = (order, status) => {
    setSelectedOrder(order);
    setNewStatus(status);
    setRefundProof('');
    if (status === 'Cancelled' || status === 'Returned') {
      setStatusModalOpen(true);
    } else {
      updateStatus(order._id, status, null);
    }
  };

  const handleStatusSubmit = (e) => {
    e.preventDefault();
    updateStatus(selectedOrder._id, newStatus, refundProof);
    setStatusModalOpen(false);
  };

  const openReviewModal = (order) => {
    setSelectedOrder(order);
    setReviewModalOpen(true);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <Link to="/admin" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-4 font-bold">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
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
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${order.paymentMethod === 'COD' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                          <X className="w-3 h-3" /> {order.paymentMethod === 'COD' ? 'COD' : 'Unpaid'}
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
                    <td className="p-4 text-right flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <select 
                          value={order.status}
                          onChange={(e) => openStatusModal(order, e.target.value)}
                          disabled={actionLoading === order._id}
                          className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-slate-900 disabled:opacity-50"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Transit">In Transit</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Returned">Returned</option>
                        </select>
                        {actionLoading === order._id && <Loader2 className="w-4 h-4 animate-spin inline" />}
                      </div>
                      {order.refundRequest?.isRequested && (
                        <button 
                          onClick={() => openReviewModal(order)}
                          className="text-xs px-3 py-1.5 bg-amber-100 text-amber-800 font-bold rounded-lg hover:bg-amber-200 transition-colors"
                        >
                          Review Request
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

      {statusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
            <button 
              onClick={() => setStatusModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Update Order Status</h2>
            <p className="text-sm text-slate-500 mb-6">
              You are marking this order as <strong className="text-slate-900">{newStatus}</strong>. Please provide refund proof if applicable.
            </p>
            <form onSubmit={handleStatusSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Refund Proof (Transaction ID / Notes)</label>
                <input 
                  type="text"
                  value={refundProof}
                  onChange={(e) => setRefundProof(e.target.value)}
                  placeholder="Enter transaction ID or refund details..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setStatusModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Confirm {newStatus}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {reviewModalOpen && selectedOrder?.refundRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setReviewModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Refund / Return Request</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <h4 className="text-sm font-bold text-slate-500 uppercase">Reason</h4>
                <p className="text-slate-900 font-medium">{selectedOrder.refundRequest.reason}</p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-500 uppercase">Description</h4>
                <p className="text-slate-900">{selectedOrder.refundRequest.description}</p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-500 uppercase mb-2">Attached Image</h4>
                {selectedOrder.refundRequest.image ? (
                  <div className="flex flex-col gap-2">
                    <img 
                      src={selectedOrder.refundRequest.image} 
                      alt="Refund Proof" 
                      className="w-full max-h-[400px] object-contain rounded-xl border border-slate-200 bg-slate-50" 
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                    />
                    <div style={{ display: 'none' }} className="text-red-500 text-sm">Failed to load image. Invalid format.</div>
                    <a href={selectedOrder.refundRequest.image} download={`refund-proof-${selectedOrder._id}`} className="text-sm text-blue-600 hover:underline inline-block">Download / View Image</a>
                  </div>
                ) : (
                  <p className="text-slate-500 italic">No image provided.</p>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-slate-100">
              <button 
                onClick={() => setReviewModalOpen(false)}
                className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  setReviewModalOpen(false);
                  openStatusModal(selectedOrder, 'Returned');
                }}
                className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors"
              >
                Approve & Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
