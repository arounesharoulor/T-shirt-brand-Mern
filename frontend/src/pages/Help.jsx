import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Package, Truck, MessageSquare, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
              How can we help?
            </h1>
            <div className="relative group max-w-xl mx-auto mt-10">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Search for answers..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-gray-50 border-0 rounded-2xl text-lg focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all outline-none text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>
        </motion.div>

        {/* Action Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            <Link to="/support" className="block h-full bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
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
            </Link>
          </motion.div>
        </div>

        {/* FAQs Bento Box */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
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
        
      </div>
    </div>
  );
};

export default Help;
