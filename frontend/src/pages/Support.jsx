import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
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
      toast.success('Your message has been received.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-32 font-sans text-gray-900">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Contact Us
          </h1>
          <p className="text-lg text-gray-500">
            Have a question or need assistance? Fill out the form below and our team will get back to you within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Contact Information */}
          <div className="order-2 lg:order-1 flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-8">Get in Touch</h2>
            <p className="text-gray-600 mb-12 leading-relaxed">
              Whether you have a question about our products, shipping, or returns, we are here to help. You can reach us via email, phone, or by visiting our headquarters.
            </p>

            <div className="space-y-8">
              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-gray-900 mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Headquarters</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    17th Cross, HSR Layout<br/>
                    Bengaluru, Karnataka 560102<br/>
                    India
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="w-6 h-6 text-gray-900 mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                  <a href="mailto:support@customtees.com" className="text-gray-500 text-sm hover:text-gray-900 transition-colors">
                    support@customtees.com
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="w-6 h-6 text-gray-900 mt-1 mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Phone Support</h3>
                  <a href="tel:+9118001234567" className="text-gray-500 text-sm hover:text-gray-900 transition-colors">
                    +91 1800 123 4567
                  </a>
                  <p className="text-xs text-gray-400 mt-1">Monday - Friday, 9:00 AM - 6:00 PM (IST)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="order-1 lg:order-2">
            <div className="bg-gray-50 p-8 sm:p-12 rounded-2xl border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">First Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Inquiry Type</label>
                  <select 
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm appearance-none"
                  >
                    <option value="" disabled>Select an option</option>
                    <option value="Order Tracking">Order Status</option>
                    <option value="Returns/Exchanges">Returns & Exchanges</option>
                    <option value="Product Information">Product Information</option>
                    <option value="Other">Other Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Message</label>
                  <textarea 
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm resize-none"
                    placeholder="Please describe how we can assist you..."
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-black transition-colors disabled:opacity-70 mt-4"
                >
                  {isSubmitting ? 'Submitting...' : 'Send Message'}
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
