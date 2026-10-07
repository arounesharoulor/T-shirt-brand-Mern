import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen bg-[#F4F4F4] pt-24 pb-32">
      
      {/* Editorial Header */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b-2 border-slate-900 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8"
        >
          <div>
            <p className="text-sm font-bold tracking-widest uppercase text-slate-500 mb-4">Client Services</p>
            <h1 className="text-[4rem] md:text-[6rem] font-display font-black text-slate-900 tracking-tighter uppercase leading-[0.9]">
              How Can<br/>We Help?
            </h1>
          </div>
          <div className="w-full md:w-96">
            <div className="relative">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-900 w-6 h-6" />
              <input 
                type="text" 
                placeholder="SEARCH KNOWLEDGE BASE" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-0 py-4 bg-transparent border-b-2 border-slate-900 text-slate-900 font-bold placeholder:text-slate-400 focus:outline-none uppercase tracking-wider text-sm transition-colors"
              />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Quick Links Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <Link to="/my-orders" className="group block border border-slate-200 bg-white p-8 hover:border-slate-900 transition-colors">
            <h3 className="font-display font-black text-2xl text-slate-900 uppercase tracking-tight mb-2">Track Order</h3>
            <p className="text-slate-500 text-sm font-medium mb-6">Monitor your recent purchases.</p>
            <div className="flex items-center text-sm font-bold tracking-widest uppercase text-slate-900 group-hover:pl-2 transition-all">
              View Status <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </Link>
          
          <Link to="/refund" className="group block border border-slate-200 bg-white p-8 hover:border-slate-900 transition-colors">
            <h3 className="font-display font-black text-2xl text-slate-900 uppercase tracking-tight mb-2">Returns</h3>
            <p className="text-slate-500 text-sm font-medium mb-6">Initiate an exchange or refund.</p>
            <div className="flex items-center text-sm font-bold tracking-widest uppercase text-slate-900 group-hover:pl-2 transition-all">
              Start Return <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </Link>

          <Link to="/support" className="group block border border-slate-200 bg-white p-8 hover:border-slate-900 transition-colors">
            <h3 className="font-display font-black text-2xl text-slate-900 uppercase tracking-tight mb-2">Contact</h3>
            <p className="text-slate-500 text-sm font-medium mb-6">Speak with our service team.</p>
            <div className="flex items-center text-sm font-bold tracking-widest uppercase text-slate-900 group-hover:pl-2 transition-all">
              Get in Touch <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </Link>
        </div>

        {/* FAQs */}
        <div className="lg:col-span-8">
          {faqs.map((category, cIdx) => (
            <div key={cIdx} className="mb-16 last:mb-0">
              <h2 className="text-sm font-bold tracking-widest uppercase text-slate-500 mb-6">{category.category}</h2>
              <div className="border-t-2 border-slate-900">
                {category.questions.map((faq, fIdx) => {
                  const id = `${cIdx}-${fIdx}`;
                  const isOpen = openFaq === id;
                  
                  if (searchQuery && !faq.q.toLowerCase().includes(searchQuery.toLowerCase()) && !faq.a.toLowerCase().includes(searchQuery.toLowerCase())) {
                    return null;
                  }

                  return (
                    <div key={id} className="border-b border-slate-200 group">
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : id)}
                        className="w-full flex items-center justify-between py-8 text-left focus:outline-none"
                      >
                        <span className="font-display font-black text-xl md:text-2xl text-slate-900 uppercase tracking-tight pr-8">{faq.q}</span>
                        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="flex-shrink-0 w-8 h-8 rounded-full border border-slate-900 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                          <ChevronDown className="w-4 h-4" />
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
                            <div className="pb-8 text-slate-600 text-lg leading-relaxed max-w-3xl">
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
