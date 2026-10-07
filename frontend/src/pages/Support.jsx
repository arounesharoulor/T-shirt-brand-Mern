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
      toast.success('TRANSMISSION SUCCESSFUL.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#E4FE49] selection:text-black pt-24 pb-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* HEADER MARQUEE */}
        <div className="border-y-4 border-white py-4 mb-16 overflow-hidden flex whitespace-nowrap bg-[#E4FE49] text-black">
          <div className="animate-marquee font-black text-4xl uppercase tracking-tighter">
            SUPPORT // TRANSMIT // SYSTEM ONLINE // HUMAN CONTACT // RESOLVE // SUPPORT // TRANSMIT // SYSTEM ONLINE // HUMAN CONTACT // RESOLVE // 
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* INFO COLUMN */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h1 className="text-[5rem] sm:text-[7rem] font-black uppercase leading-[0.8] tracking-tighter mb-8">
                SIGNAL<br/>US.
              </h1>
              <p className="text-xl font-bold uppercase tracking-widest text-[#E4FE49] mb-16">
                Direct comms established.<br/>Response protocol active.
              </p>
            </div>

            <div className="space-y-8 border-t-4 border-white pt-8">
              <div className="group">
                <div className="flex items-center gap-4 mb-2">
                  <MapPin className="w-6 h-6 text-[#E4FE49]" />
                  <h3 className="font-black text-2xl uppercase tracking-tight">BASE CAMP</h3>
                </div>
                <p className="font-bold text-lg uppercase ml-10">17th Cross, HSR Layout<br/>Bengaluru, KA 560102<br/>IN</p>
              </div>

              <div className="group">
                <div className="flex items-center gap-4 mb-2">
                  <Mail className="w-6 h-6 text-[#E4FE49]" />
                  <h3 className="font-black text-2xl uppercase tracking-tight">DIGITAL</h3>
                </div>
                <a href="mailto:support@customtees.com" className="font-bold text-lg uppercase ml-10 hover:text-[#E4FE49] transition-colors">SUPPORT@CUSTOMTEES.COM</a>
              </div>

              <div className="group">
                <div className="flex items-center gap-4 mb-2">
                  <Phone className="w-6 h-6 text-[#E4FE49]" />
                  <h3 className="font-black text-2xl uppercase tracking-tight">VOICE</h3>
                </div>
                <a href="tel:+9118001234567" className="font-bold text-lg uppercase ml-10 hover:text-[#E4FE49] transition-colors">+91 1800 123 4567</a>
                <p className="font-bold text-sm uppercase text-gray-500 ml-10 mt-2">M-F 0900-1800 IST</p>
              </div>
            </div>
          </div>

          {/* FORM COLUMN */}
          <div className="lg:col-span-7">
            <div className="bg-white text-black p-8 sm:p-12 border-4 border-white relative">
              {/* Decorative Barcode */}
              <div className="absolute top-8 right-8 font-barcode text-4xl opacity-20">||| |||| || | |||</div>
              
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-12 border-b-4 border-black pb-4 inline-block">
                INPUT_DATA
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xl font-black uppercase mb-4 tracking-tight">IDENTIFIER</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-6 py-5 bg-[#f4f4f4] border-4 border-black focus:outline-none focus:bg-[#E4FE49] transition-colors font-bold uppercase text-lg placeholder:text-gray-400"
                      placeholder="JOHN DOE"
                    />
                  </div>
                  <div>
                    <label className="block text-xl font-black uppercase mb-4 tracking-tight">COMMS_LINK</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-6 py-5 bg-[#f4f4f4] border-4 border-black focus:outline-none focus:bg-[#E4FE49] transition-colors font-bold uppercase text-lg placeholder:text-gray-400"
                      placeholder="JD@EXAMPLE.COM"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xl font-black uppercase mb-4 tracking-tight">CATEGORY</label>
                  <select 
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-6 py-5 bg-[#f4f4f4] border-4 border-black focus:outline-none focus:bg-[#E4FE49] transition-colors font-bold uppercase text-lg appearance-none"
                  >
                    <option value="" disabled>SELECT PROTOCOL</option>
                    <option value="Order Tracking">ORDER TRACKING</option>
                    <option value="Returns/Exchanges">RETURNS // EXCHANGES</option>
                    <option value="Custom Order Inquiry">CUSTOM ORDERS</option>
                    <option value="Other">OTHER</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xl font-black uppercase mb-4 tracking-tight">PAYLOAD</label>
                  <textarea 
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-6 py-5 bg-[#f4f4f4] border-4 border-black focus:outline-none focus:bg-[#E4FE49] transition-colors font-bold uppercase text-lg resize-none placeholder:text-gray-400"
                    placeholder="ENTER TRANSMISSION DATA..."
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full group flex items-center justify-between px-8 py-6 bg-black text-white hover:bg-[#E4FE49] hover:text-black transition-colors disabled:opacity-70 border-4 border-black mt-8"
                >
                  <span className="text-2xl font-black uppercase tracking-tighter">
                    {isSubmitting ? 'TRANSMITTING...' : 'EXECUTE'}
                  </span>
                  {!isSubmitting && <ArrowRight className="w-8 h-8 group-hover:translate-x-4 transition-transform" />}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Support;
