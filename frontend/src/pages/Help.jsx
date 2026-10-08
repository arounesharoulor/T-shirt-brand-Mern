import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Package, Truck, MessageSquare, ArrowUpRight, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const faqs = [
  {
    category: 'Orders & Shipping',
    questions: [
      { q: "How long does delivery take?", a: "Standard delivery takes 3-5 business days. Express delivery takes 1-2 business days. Custom orders may take an additional 48 hours for production." },
      { q: "Do you ship internationally?", a: "Yes, we ship globally! International shipping usually takes 7-14 days depending on the destination." },
      { q: "How can I track my order?", a: "Once your order ships, you'll receive a tracking link via email. You can also track it in your Account Dashboard under Order History." }
    ]
  },
  {
    category: 'Returns & Refunds',
    questions: [
      { q: "What is your return policy?", a: "We offer a 30-day return policy for unwashed and unworn items. Custom printed items are final sale unless there is a manufacturing defect." },
      { q: "How do I start a return?", a: "You can initiate a return through our Support page or by navigating to the Refund Request section." }
    ]
  }
];

const Help = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Contact Form State
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
      toast.success('Message received. We will respond shortly.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  const scrollToContact = (e) => {
    e.preventDefault();
    const element = document.getElementById('contact-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] pt-28 pb-32 text-[#1D1D1F]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Bento Box */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] p-10 md:p-16 mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center relative overflow-hidden"
        >
          {/* Subtle Background Glows */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none rounded-[2.5rem]">
            <div className="absolute -top-1/2 -left-1/4 w-[80%] h-[150%] bg-blue-50/50 rounded-full blur-3xl" />
            <div className="absolute -bottom-1/2 -right-1/4 w-[80%] h-[150%] bg-purple-50/50 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Help & Support Center
            </h1>
            <p className="text-xl text-gray-500 mb-10">
              Find answers quickly or get in touch with our team.
            </p>
            <div className="relative group max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Search for answers..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-gray-50 border-0 rounded-2xl text-lg focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all outline-none text-gray-900 placeholder:text-gray-400 shadow-sm"
              />
            </div>
          </div>
        </motion.div>

        {/* Action Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Link to="/my-orders" className="block h-full bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Package className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Track Order</h3>
              <p className="text-gray-500 mb-8">Check the status of your recent purchases and shipments.</p>
              <div className="flex items-center text-blue-600 font-semibold">
                View Orders <ArrowUpRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Link to="/refund" className="block h-full bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Truck className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Returns</h3>
              <p className="text-gray-500 mb-8">Not quite right? Easily initiate a return or exchange.</p>
              <div className="flex items-center text-purple-600 font-semibold">
                Start Return <ArrowUpRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <button onClick={scrollToContact} className="w-full text-left block h-full bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-orange-50 rounded-full blur-2xl z-0" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Contact Us</h3>
                <p className="text-gray-500 mb-8">Need more help? Our team is available 24/7 to assist you.</p>
                <div className="flex items-center text-orange-600 font-semibold">
                  Get in Touch <ArrowUpRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </button>
          </motion.div>
        </div>

        {/* FAQs Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-12"
        >
          <h2 className="text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
            {faqs.map((category, cIdx) => (
              <div key={cIdx}>
                <h3 className="text-xl font-semibold mb-6 text-gray-400 uppercase tracking-wider text-sm">{category.category}</h3>
                <div className="space-y-4">
                  {category.questions.map((faq, fIdx) => {
                    const id = `${cIdx}-${fIdx}`;
                    const isOpen = openFaq === id;
                    
                    if (searchQuery && !faq.q.toLowerCase().includes(searchQuery.toLowerCase()) && !faq.a.toLowerCase().includes(searchQuery.toLowerCase())) {
                      return null;
                    }

                    return (
                      <div key={id} className="bg-gray-50 rounded-2xl overflow-hidden transition-all duration-300">
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : id)}
                          className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                        >
                          <span className="font-semibold text-gray-900 pr-6 text-lg">{faq.q}</span>
                          <motion.div 
                            animate={{ rotate: isOpen ? 180 : 0 }} 
                            className="flex-shrink-0 w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-500"
                          >
                            <ChevronDown className="w-5 h-5" />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                                {faq.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact Form Section (Combined from Support) */}
        <div id="contact-section" className="scroll-mt-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Contact Details Left Col */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Email Us</h3>
                <p className="text-gray-500 mb-4">Our friendly team is here to help.</p>
                <a href="mailto:support@customtees.com" className="text-blue-600 font-semibold hover:underline">support@customtees.com</a>
              </div>

              <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Visit HQ</h3>
                <p className="text-gray-500 mb-4">Come say hello at our office.</p>
                <p className="text-gray-900 font-semibold">HSR Layout, Bengaluru<br/>Karnataka 560102, IN</p>
              </div>

              <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mb-6">
                  <Phone className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Call Us</h3>
                <p className="text-gray-500 mb-4">Mon-Fri from 9am to 6pm.</p>
                <a href="tel:+9118001234567" className="text-orange-600 font-semibold hover:underline">+91 1800 123 4567</a>
              </div>
            </div>

            {/* Form Right Cols */}
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
              {/* Subtle Gradient Glow in Corner */}
              <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-50/60 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-8">Send us a message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">First name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-5 py-4 bg-[#F5F5F7] border-0 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all outline-none text-gray-900 font-medium placeholder:text-gray-400"
                        placeholder="Jane"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-5 py-4 bg-[#F5F5F7] border-0 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all outline-none text-gray-900 font-medium placeholder:text-gray-400"
                        placeholder="jane@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                    <select 
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-5 py-4 bg-[#F5F5F7] border-0 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all outline-none text-gray-900 font-medium appearance-none"
                    >
                      <option value="" disabled>Select a topic...</option>
                      <option value="Order Tracking">Order Tracking</option>
                      <option value="Returns/Exchanges">Returns & Exchanges</option>
                      <option value="Custom Order Inquiry">Custom Order Inquiry</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                    <textarea 
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-5 py-4 bg-[#F5F5F7] border-0 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all outline-none text-gray-900 font-medium resize-none placeholder:text-gray-400"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-5 bg-[#1D1D1F] text-white text-lg font-bold rounded-2xl hover:bg-black transition-colors disabled:opacity-70 shadow-[0_8px_30px_rgb(0,0,0,0.12)] mt-4"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Help;
