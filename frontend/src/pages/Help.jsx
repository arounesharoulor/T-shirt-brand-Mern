import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, HelpCircle, Package, Truck, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 pt-10 pb-24">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <HelpCircle className="w-12 h-12 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight mb-4">
            How can we help?
          </h1>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Search our knowledge base or browse frequently asked questions below.
          </p>
          
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search for answers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-primary/20 transition-shadow text-lg"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          <Link to="/my-orders" className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all group">
            <Package className="w-8 h-8 text-slate-900 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-slate-900 mb-2">Track Order</h3>
            <p className="text-sm text-slate-500 flex items-center">View order status <ArrowRight className="w-4 h-4 ml-1" /></p>
          </Link>
          <Link to="/refund" className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all group">
            <Truck className="w-8 h-8 text-slate-900 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-slate-900 mb-2">Returns</h3>
            <p className="text-sm text-slate-500 flex items-center">Start a return <ArrowRight className="w-4 h-4 ml-1" /></p>
          </Link>
          <Link to="/support" className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all group">
            <HelpCircle className="w-8 h-8 text-slate-900 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-slate-900 mb-2">Contact Support</h3>
            <p className="text-sm text-slate-500 flex items-center">Get in touch <ArrowRight className="w-4 h-4 ml-1" /></p>
          </Link>
        </div>

        {/* FAQs */}
        <div className="space-y-12">
          {faqs.map((category, cIdx) => (
            <div key={cIdx}>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">{category.category}</h2>
              <div className="space-y-4">
                {category.questions.map((faq, fIdx) => {
                  const id = `${cIdx}-${fIdx}`;
                  const isOpen = openFaq === id;
                  
                  if (searchQuery && !faq.q.toLowerCase().includes(searchQuery.toLowerCase()) && !faq.a.toLowerCase().includes(searchQuery.toLowerCase())) {
                    return null;
                  }

                  return (
                    <div key={id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : id)}
                        className="w-full flex items-center justify-between p-6 text-left focus:outline-none hover:bg-slate-50 transition-colors"
                      >
                        <span className="font-bold text-slate-900">{faq.q}</span>
                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-100">
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
      </div>
    </div>
  );
};

export default Help;
