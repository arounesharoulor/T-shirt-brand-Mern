import { useState } from 'react';
import { Plus, Minus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    category: 'Orders & Shipping',
    questions: [
      { q: "How long does standard delivery take?", a: "Standard delivery typically takes 3-5 business days. Express shipping options are available at checkout for 1-2 business day delivery. Custom orders require an additional 48 hours for production." },
      { q: "Do you ship internationally?", a: "Yes, we ship worldwide. International shipping usually takes 7-14 days depending on the destination country. Customs duties and taxes may apply." },
      { q: "How can I track my order?", a: "Once your order has been dispatched, you will receive a tracking link via email. You can also monitor your order status in your Account Dashboard." }
    ]
  },
  {
    category: 'Returns & Exchanges',
    questions: [
      { q: "What is your return policy?", a: "We offer a 30-day return policy for items in their original, unwashed, and unworn condition. Please note that custom printed items are final sale unless there is a manufacturing defect." },
      { q: "How do I initiate a return?", a: "You can start a return process through our Returns Portal or by contacting our support team with your order number." }
    ]
  }
];

const Help = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(faqs[0].category);

  return (
    <div className="min-h-screen bg-white pt-32 pb-32 text-gray-900 font-sans">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-20 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Help Center
          </h1>
          <div className="relative mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search for answers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition-shadow"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-32">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Categories</h3>
              <nav className="space-y-2">
                {faqs.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveCategory(cat.category)}
                    className={`w-full text-left px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeCategory === cat.category ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                  >
                    {cat.category}
                  </button>
                ))}
              </nav>

              <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-2">Need more help?</h4>
                <p className="text-sm text-gray-500 mb-4">Our support team is available to assist you with any inquiries.</p>
                <Link to="/support" className="inline-block text-sm font-semibold text-gray-900 underline hover:text-gray-600">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:w-2/3">
            {faqs.filter(c => c.category === activeCategory).map((category, cIdx) => (
              <div key={cIdx}>
                <h2 className="text-2xl font-bold mb-8 pb-4 border-b border-gray-200">{category.category}</h2>
                <div className="space-y-6">
                  {category.questions.map((faq, fIdx) => {
                    const id = `${category.category}-${fIdx}`;
                    const isOpen = openFaq === id;
                    
                    if (searchQuery && !faq.q.toLowerCase().includes(searchQuery.toLowerCase()) && !faq.a.toLowerCase().includes(searchQuery.toLowerCase())) {
                      return null;
                    }

                    return (
                      <div key={id} className="border-b border-gray-100 pb-6">
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : id)}
                          className="w-full flex items-start justify-between text-left focus:outline-none group"
                        >
                          <span className="font-semibold text-gray-900 pr-8 group-hover:text-gray-600 transition-colors">{faq.q}</span>
                          <span className="flex-shrink-0 mt-1 text-gray-400">
                            {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                          </span>
                        </button>
                        
                        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                          <p className="text-gray-600 leading-relaxed text-sm">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Help;
