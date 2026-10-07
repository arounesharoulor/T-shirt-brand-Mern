import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    category: 'LOGISTICS // SHIPPING',
    questions: [
      { q: "HOW LONG DOES IT TAKE?", a: "STANDARD DROPS TAKE 3-5 BUSINESS DAYS. EXPRESS IS 1-2. CUSTOM PRINTS REQUIRE 48H EXTRA. NO EXCEPTIONS." },
      { q: "WORLDWIDE SHIPPING?", a: "YES. WE SHIP GLOBALLY. 7-14 DAYS FOR INTERNATIONAL." },
      { q: "WHERE IS MY ORDER?", a: "TRACKING LINK IS SENT VIA EMAIL ONCE SHIPPED. ALSO AVAILABLE IN YOUR DASHBOARD." }
    ]
  },
  {
    category: 'RETURNS // REFUNDS',
    questions: [
      { q: "RETURN POLICY?", a: "30 DAYS. MUST BE UNWASHED/UNWORN. CUSTOM PIECES ARE FINAL SALE UNLESS DEFECTIVE." },
      { q: "HOW TO INITIATE?", a: "USE THE RETURN PORTAL OR CONTACT SUPPORT DIRECTLY. HAVE YOUR ORDER ID READY." }
    ]
  }
];

const Help = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-white pt-24 pb-32 text-black font-sans selection:bg-black selection:text-[#E4FE49]">
      
      {/* BRUTALIST HEADER */}
      <div className="px-4 sm:px-6 lg:px-12 mb-16 border-b-4 border-black pb-12 relative overflow-hidden">
        {/* Warning Tape Background Element */}
        <div className="absolute top-0 right-0 rotate-12 translate-x-1/4 -translate-y-1/2 bg-[#E4FE49] text-black font-black uppercase text-4xl whitespace-nowrap px-8 py-2 border-y-4 border-black pointer-events-none opacity-50">
          FAQ // FAQ // FAQ // FAQ // FAQ // FAQ // 
        </div>

        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="inline-block bg-black text-white px-4 py-1 font-bold text-sm tracking-widest uppercase mb-8">
            SYS.OP.HELP
          </div>
          <h1 className="text-[5rem] md:text-[8rem] font-black uppercase leading-[0.8] tracking-tighter mb-12">
            KNOWLEDGE<br/>BASE.
          </h1>
          
          <div className="max-w-2xl relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-black" />
            <input 
              type="text" 
              placeholder="SEARCH PROTOCOLS..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-6 bg-[#f4f4f4] border-4 border-black text-black font-black uppercase text-xl placeholder:text-gray-400 focus:outline-none focus:bg-[#E4FE49] transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* QUICK LINKS (TICKET STYLE) */}
        <div className="lg:col-span-4 space-y-6">
          <Link to="/my-orders" className="block border-4 border-black p-8 relative group hover:bg-black hover:text-white transition-colors duration-300">
            <div className="absolute top-0 right-0 bg-black text-white text-xs font-bold px-2 py-1 group-hover:bg-white group-hover:text-black transition-colors">01</div>
            <h3 className="text-3xl font-black uppercase tracking-tight mb-4">Track<br/>Order</h3>
            <p className="font-bold text-sm uppercase mb-8 opacity-70">Monitor shipments.</p>
            <div className="flex items-center font-bold tracking-widest uppercase">
              PROCEED <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </Link>
          
          <Link to="/refund" className="block border-4 border-black p-8 relative group hover:bg-[#E4FE49] hover:text-black transition-colors duration-300">
            <div className="absolute top-0 right-0 bg-black text-white text-xs font-bold px-2 py-1">02</div>
            <h3 className="text-3xl font-black uppercase tracking-tight mb-4">Returns<br/>Portal</h3>
            <p className="font-bold text-sm uppercase mb-8 opacity-70">Initiate process.</p>
            <div className="flex items-center font-bold tracking-widest uppercase">
              PROCEED <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </Link>

          <Link to="/support" className="block border-4 border-black p-8 relative group hover:bg-black hover:text-white transition-colors duration-300">
            <div className="absolute top-0 right-0 bg-black text-white text-xs font-bold px-2 py-1 group-hover:bg-white group-hover:text-black transition-colors">03</div>
            <h3 className="text-3xl font-black uppercase tracking-tight mb-4">System<br/>Support</h3>
            <p className="font-bold text-sm uppercase mb-8 opacity-70">Contact humans.</p>
            <div className="flex items-center font-bold tracking-widest uppercase">
              PROCEED <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </Link>
        </div>

        {/* ACCORDION FAQ */}
        <div className="lg:col-span-8">
          {faqs.map((category, cIdx) => (
            <div key={cIdx} className="mb-16 last:mb-0">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-1 flex-1 bg-black"></div>
                <h2 className="text-2xl font-black tracking-widest uppercase">{category.category}</h2>
                <div className="h-1 flex-1 bg-black"></div>
              </div>
              
              <div className="border-4 border-black divide-y-4 divide-black">
                {category.questions.map((faq, fIdx) => {
                  const id = `${cIdx}-${fIdx}`;
                  const isOpen = openFaq === id;
                  
                  if (searchQuery && !faq.q.toLowerCase().includes(searchQuery.toLowerCase()) && !faq.a.toLowerCase().includes(searchQuery.toLowerCase())) {
                    return null;
                  }

                  return (
                    <div key={id} className={`group ${isOpen ? 'bg-black text-white' : 'bg-white text-black hover:bg-[#f4f4f4]'} transition-colors duration-300`}>
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : id)}
                        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                      >
                        <span className="font-black text-xl md:text-2xl uppercase tracking-tighter pr-8">{faq.q}</span>
                        <div className="flex-shrink-0">
                          {isOpen ? <Minus className="w-8 h-8" /> : <Plus className="w-8 h-8" />}
                        </div>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 text-lg font-bold uppercase leading-relaxed text-[#E4FE49]">
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
