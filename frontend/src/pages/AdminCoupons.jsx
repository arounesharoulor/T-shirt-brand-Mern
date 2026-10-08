import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trash2, Loader2, Plus, Percent } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminCoupons = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ code: '', discountPercent: '' });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchCoupons();
  }, [user, navigate]);

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://t-shirt-brand-mern.onrender.com/api/coupons', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setCoupons(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const createCoupon = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://t-shirt-brand-mern.onrender.com/api/coupons', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Coupon created successfully');
        setForm({ code: '', discountPercent: '' });
        setModalOpen(false);
        fetchCoupons();
      } else {
        toast.error(data.error || 'Failed to create coupon');
      }
    } catch (error) {
      toast.error('Error creating coupon');
    }
  };

  const deleteCoupon = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`https://t-shirt-brand-mern.onrender.com/api/coupons/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Coupon deleted');
        fetchCoupons();
      } else {
        toast.error('Failed to delete coupon');
      }
    } catch (error) {
      toast.error('Error deleting coupon');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-black text-slate-900 uppercase">Manage Coupons</h1>
            <p className="text-slate-500 mt-2">Create and manage discount codes.</p>
          </div>
          <button 
            onClick={() => setModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-5 h-5" /> Add Coupon
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 text-sm font-bold text-slate-700">CODE</th>
                  <th className="p-4 text-sm font-bold text-slate-700">DISCOUNT</th>
                  <th className="p-4 text-sm font-bold text-slate-700">STATUS</th>
                  <th className="p-4 text-sm font-bold text-slate-700 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {coupons.map(c => (
                  <tr key={c._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-black text-slate-900 tracking-wider">{c.code}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 font-bold text-green-600">
                        {c.discountPercent}<Percent className="w-4 h-4" /> OFF
                      </div>
                    </td>
                    <td className="p-4">
                      {c.isActive ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase rounded-full">Active</span>
                      ) : (
                        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold uppercase rounded-full">Inactive</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => deleteCoupon(c._id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-sm font-bold rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {coupons.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-slate-500">No coupons found. Create one above.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 relative">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Create New Coupon</h2>
            <form onSubmit={createCoupon} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Coupon Code</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. SUMMER20"
                  value={form.code}
                  onChange={(e) => setForm({...form, code: e.target.value.toUpperCase()})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 uppercase font-black"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Discount Percentage</label>
                <input 
                  type="number"
                  required
                  min="1"
                  max="100"
                  placeholder="e.g. 20"
                  value={form.discountPercent}
                  onChange={(e) => setForm({...form, discountPercent: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 font-bold"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
