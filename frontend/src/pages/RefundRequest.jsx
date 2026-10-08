import { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, CheckCircle, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const RefundRequest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const passedOrderInfo = location.state || {};

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    orderNumber: passedOrderInfo.orderId || '',
    email: passedOrderInfo.email || '',
    reason: 'damage',
    description: ''
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.orderNumber) {
      toast.error('Order number is missing');
      return;
    }

    try {
      let base64Image = '';
      if (file) {
        const reader = new FileReader();
        base64Image = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      }

      const token = localStorage.getItem('token');
      const res = await fetch(`https://t-shirt-brand-mern.onrender.com/api/orders/${formData.orderNumber}/refund-request`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: formData.reason,
          description: formData.description,
          image: base64Image
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        toast.error(data.error || 'Failed to submit request');
      }
    } catch (error) {
      toast.error('An error occurred while submitting.');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Request Submitted</h2>
          <p className="text-slate-600 mb-8">We have received your return/refund request and your uploaded photos. Our quality team will review it and get back to you within 24 hours.</p>
          <button onClick={() => navigate(-1)} className="block w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">
            Return to Shop
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        
        <button onClick={() => navigate(-1)} className="flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>

        <div className="mb-10 text-center">
          <ShieldAlert className="w-12 h-12 text-slate-900 mx-auto mb-4" />
          <h1 className="text-4xl font-display font-extrabold text-slate-900 mb-3">Returns & Refunds</h1>
          <p className="text-slate-600 text-lg">If you received a damaged product or the wrong color, upload a photo below and we will issue a replacement or refund immediately.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 sm:p-10 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Order Number</label>
              <input type="text" name="orderNumber" required value={formData.orderNumber} onChange={handleChange} placeholder="#CT-123456" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none" />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">Reason for Return</label>
            <select name="reason" value={formData.reason} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none font-medium text-slate-700">
              <option value="damage">Product is damaged / torn</option>
              <option value="mismatch">Wrong color / size received</option>
              <option value="print">Custom print quality issue</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
            <textarea name="description" required value={formData.description} onChange={handleChange} rows="4" placeholder="Please describe the issue..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-900 outline-none resize-none" />
          </div>

          <div className="mb-10">
            <label className="block text-sm font-bold text-slate-700 mb-2">Upload Photo Evidence (Required)</label>
            <div className="relative border-2 border-dashed border-slate-300 rounded-2xl p-8 hover:bg-slate-50 transition-colors text-center group cursor-pointer">
              <input type="file" required onChange={handleFileChange} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div className="flex flex-col items-center pointer-events-none">
                {file ? (
                  <div className="text-green-600 font-bold flex items-center gap-2">
                    <CheckCircle className="w-6 h-6" /> {file.name}
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-blue-500 mb-3 transition-colors" />
                    <span className="font-bold text-slate-700">Click to upload or drag and drop</span>
                    <span className="text-sm text-slate-500 mt-1">PNG, JPG up to 10MB</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button type="submit" className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg rounded-2xl shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-1">
            Submit Request
          </button>
        </form>

      </div>
    </div>
  );
};

export default RefundRequest;
