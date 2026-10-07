import { useState } from 'react';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
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
    
    setTimeout(() => {
      toast.success('Message received. We will respond within 24 hours.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col lg:flex-row min-h-screen">
        
        {/* Left Side: Editorial Image & Info */}
        <div className="lg:w-5/12 bg-slate-900 text-white relative flex flex-col justify-between p-8 sm:p-16">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop"
              alt="Studio"
              className="w-full h-full object-cover opacity-20 mix-blend-overlay grayscale"
            />
          </div>
          
          <div className="relative z-10 mb-16 pt-16">
            <p className="text-sm font-bold tracking-widest uppercase text-white/50 mb-4">Client Services</p>
            <h1 className="text-[4rem] sm:text-[5rem] font-display font-black tracking-tighter uppercase leading-[0.9]">
              Contact<br/>Studio.
            </h1>
          </div>

          <div className="relative z-10 space-y-12 mt-auto">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <MapPin className="w-5 h-5 text-white/50" />
                <h3 className="font-bold tracking-widest uppercase text-sm">Headquarters</h3>
              </div>
              <p className="text-white/70 font-medium ml-9">17th Cross, HSR Layout<br/>Bengaluru, Karnataka 560102<br/>India</p>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-2">
                <Mail className="w-5 h-5 text-white/50" />
                <h3 className="font-bold tracking-widest uppercase text-sm">Email</h3>
              </div>
              <a href="mailto:support@customtees.com" className="text-white hover:text-white/70 font-medium ml-9 transition-colors">support@customtees.com</a>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-2">
                <Phone className="w-5 h-5 text-white/50" />
                <h3 className="font-bold tracking-widest uppercase text-sm">Phone</h3>
              </div>
              <a href="tel:+9118001234567" className="text-white hover:text-white/70 font-medium ml-9 transition-colors">+91 1800 123 4567</a>
              <p className="text-white/50 text-xs tracking-widest uppercase ml-9 mt-2">Mon-Fri, 9am-6pm IST</p>
            </div>
          </div>
        </div>

        {/* Right Side: Editorial Form */}
        <div className="lg:w-7/12 p-8 sm:p-16 lg:p-24 bg-[#F4F4F4] flex flex-col justify-center">
          <div className="max-w-2xl w-full mx-auto">
            <h2 className="text-3xl font-display font-black text-slate-900 uppercase tracking-tight mb-8 border-b-2 border-slate-900 pb-4">
              Send an Inquiry
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="group">
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2 group-focus-within:text-slate-900 transition-colors">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-0 py-3 bg-transparent border-b border-slate-300 focus:border-slate-900 focus:outline-none transition-colors font-medium text-slate-900 placeholder:text-slate-400"
                    placeholder="JOHN DOE"
                  />
                </div>
                <div className="group">
                  <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2 group-focus-within:text-slate-900 transition-colors">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-0 py-3 bg-transparent border-b border-slate-300 focus:border-slate-900 focus:outline-none transition-colors font-medium text-slate-900 placeholder:text-slate-400"
                    placeholder="JOHN@EXAMPLE.COM"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2 group-focus-within:text-slate-900 transition-colors">Subject</label>
                <select 
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-0 py-3 bg-transparent border-b border-slate-300 focus:border-slate-900 focus:outline-none transition-colors font-medium text-slate-900 appearance-none uppercase"
                >
                  <option value="" disabled>SELECT A TOPIC...</option>
                  <option value="Order Tracking">ORDER TRACKING</option>
                  <option value="Returns/Exchanges">RETURNS & EXCHANGES</option>
                  <option value="Custom Order Inquiry">CUSTOM ORDER INQUIRY</option>
                  <option value="Other">OTHER</option>
                </select>
              </div>

              <div className="group">
                <label className="block text-xs font-bold tracking-widest uppercase text-slate-500 mb-2 group-focus-within:text-slate-900 transition-colors">Message</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-0 py-3 bg-transparent border-b border-slate-300 focus:border-slate-900 focus:outline-none transition-colors font-medium text-slate-900 resize-none placeholder:text-slate-400"
                  placeholder="HOW CAN WE HELP YOU TODAY?"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full group flex items-center justify-between px-8 py-5 bg-slate-900 text-white text-sm tracking-widest uppercase font-bold hover:bg-slate-800 transition-colors disabled:opacity-70 mt-8"
              >
                <span>{isSubmitting ? 'SENDING...' : 'SUBMIT INQUIRY'}</span>
                {!isSubmitting && <ArrowRight className="w-5 h-5 ml-4 group-hover:translate-x-2 transition-transform" />}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Support;
