import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Your message has been sent! We will get back to you within 24 hours.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <MessageSquare className="w-12 h-12 text-slate-900 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-900 uppercase tracking-tight mb-4">
            Contact Support
          </h1>
          <p className="text-slate-500 text-lg">
            Need help with an order, a custom design, or just have a general question? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* Contact Info */}
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Get in Touch</h2>
              <p className="text-slate-600 leading-relaxed">
                Our support team is available Monday through Friday, 9:00 AM to 6:00 PM (IST). We aim to respond to all inquiries within 24 business hours.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="bg-white p-3 rounded-xl shadow-sm">
                  <Mail className="w-6 h-6 text-slate-900" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Email Us</h3>
                  <a href="mailto:support@customtees.com" className="text-primary hover:underline">support@customtees.com</a>
                  <p className="text-sm text-slate-500 mt-1">For general inquiries and order support</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="bg-white p-3 rounded-xl shadow-sm">
                  <Phone className="w-6 h-6 text-slate-900" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Call Us</h3>
                  <a href="tel:+9118001234567" className="text-slate-600 hover:text-slate-900 font-medium">+91 1800 123 4567</a>
                  <p className="text-sm text-slate-500 mt-1">Mon-Fri, 9am-6pm IST</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="bg-white p-3 rounded-xl shadow-sm">
                  <MapPin className="w-6 h-6 text-slate-900" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Headquarters</h3>
                  <p className="text-slate-600">17th Cross, HSR Layout<br/>Bengaluru, Karnataka 560102<br/>India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Send a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/20 transition-all font-medium text-slate-900"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/20 transition-all font-medium text-slate-900"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
                <select 
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/20 transition-all font-medium text-slate-900 appearance-none"
                >
                  <option value="" disabled>Select a topic...</option>
                  <option value="Order Tracking">Order Tracking</option>
                  <option value="Returns/Exchanges">Returns & Exchanges</option>
                  <option value="Custom Order Inquiry">Custom Order Inquiry</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                <textarea 
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/20 transition-all font-medium text-slate-900 resize-none"
                  placeholder="How can we help you today?"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">Sending...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send Message
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Support;
