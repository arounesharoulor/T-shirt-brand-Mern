import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ChevronDown, X, ShoppingBag, Star, Heart, Paintbrush } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ALL_PRODUCTS, CATEGORIES, COLORS } from '../data/products';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Shop = () => {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeColor, setActiveColor] = useState(null);
  const [sortBy, setSortBy] = useState('featured');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    let result = ALL_PRODUCTS;

    if (searchQuery) {
      result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }
    if (activeColor) {
      result = result.filter(p => p.color === activeColor);
    }

    switch (sortBy) {
      case 'price-low':
        return [...result].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...result].sort((a, b) => b.price - a.price);
      case 'newest':
        return [...result].sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
      default: // featured
        return result;
    }
  }, [searchQuery, activeCategory, activeColor, sortBy]);

  return (
    <div className="min-h-screen bg-white">
      
      {/* 1. High-End Shop Banner */}
      <div className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558222218-b7b54eede3f3?q=80&w=2787&auto=format&fit=crop')] bg-cover bg-top opacity-30 mix-blend-overlay grayscale" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
            className="text-5xl md:text-7xl font-display font-black text-white tracking-tight uppercase mb-6"
          >
            Our Catalog
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-300 font-medium max-w-2xl mx-auto"
          >
            Browse our selection of high-quality blank apparel, ready for your custom designs.
          </motion.p>
        </div>
      </div>

      {/* 2. Sticky Filter & Search Bar */}
      <div className="sticky top-[73px] z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
            
            {/* Horizontal Categories */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                    activeCategory === category 
                      ? 'bg-slate-900 text-white shadow-md' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Actions: Search, Filter Toggle */}
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search collection..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-100 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:bg-white transition-all"
                />
              </div>
              
              <button 
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-colors ${
                  isFiltersOpen || activeColor || sortBy !== 'featured' 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters {(activeColor || sortBy !== 'featured') ? '•' : ''}
              </button>
            </div>
          </div>

          {/* Expandable Filter Panel */}
          <AnimatePresence>
            {isFiltersOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-slate-100"
              >
                <div className="py-6 flex flex-col md:flex-row gap-8">
                  {/* Colors */}
                  <div className="flex-1">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Color Palette</h3>
                    <div className="flex flex-wrap gap-4">
                      {COLORS.map(color => (
                        <button
                          key={color.name}
                          onClick={() => setActiveColor(color.name === activeColor ? null : color.name)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                            activeColor === color.name ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full shadow-sm border border-slate-200" style={{ backgroundColor: color.hex }} />
                          <span className="text-sm font-medium text-slate-700">{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort */}
                  <div className="w-full md:w-64">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Sort By</h3>
                    <select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/20 cursor-pointer"
                    >
                      <option value="featured">Featured</option>
                      <option value="newest">New Arrivals</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 3. Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Nothing found</h3>
            <p className="text-slate-500 mb-6">We couldn't find anything matching your current filters.</p>
            <button 
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); setActiveColor(null); setSortBy('featured'); }}
              className="px-6 py-3 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12">
            <AnimatePresence>
              {(user ? filteredProducts : filteredProducts.slice(0, 8)).map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  key={product._id}
                  className="group flex flex-col"
                >
                  {/* Image Container (Minimalist) */}
                  <div className="relative aspect-[3/4] bg-slate-100 rounded-2xl overflow-hidden mb-4 cursor-pointer">
                    
                    {/* Floating Wishlist */}
                    {user && (
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(product);
                        }}
                        className="absolute top-3 right-3 z-20 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white shadow-sm transition-all"
                      >
                        <Heart className={`w-4 h-4 ${isInWishlist(product._id) ? 'text-red-500 fill-red-500' : 'text-slate-600'}`} />
                      </button>
                    )}

                    <Link to={`/product/${product._id}`} className="absolute inset-0 z-0">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-multiply"
                      />
                    </Link>

                    {/* Quick Actions overlay */}
                    {user && (
                      <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10 flex gap-2">
                        <Link 
                          to="/customiser" 
                          state={{ product }}
                          className="flex-1 bg-white/95 backdrop-blur text-slate-900 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:bg-slate-900 hover:text-white transition-colors"
                        >
                          <Paintbrush className="w-3.5 h-3.5" /> Design
                        </Link>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(product, 'L', 1);
                            toast.success(`Added to cart!`, { icon: '🛒' });
                          }}
                          className="w-10 h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center justify-center shadow-sm transition-colors shrink-0"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Clean Typography Info */}
                  <div className="flex flex-col">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                        <Link to={`/product/${product._id}`} className="hover:underline underline-offset-4 decoration-2 decoration-slate-300">
                          {product.name}
                        </Link>
                      </h3>
                      <span className="text-sm sm:text-base font-bold text-slate-900">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1 text-slate-500 text-xs sm:text-sm font-medium">
                      <span>{product.category}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-slate-300 text-slate-300" />
                        {product.rating}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* 4. Guest CTA */}
        {!user && (
          <div className="mt-20 border-t border-slate-200 pt-16">
            <div className="bg-slate-900 rounded-[2rem] p-8 sm:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-5xl font-display font-black text-white mb-6 uppercase tracking-tight">
                  Join Our <br/>Community
                </h2>
                <p className="text-lg text-slate-300 font-medium mb-8">
                  Sign in to view the complete collection, launch the 3D customizer, and order your designs globally.
                </p>
                <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 bg-white text-slate-900 font-bold rounded-full hover:scale-105 transition-all shadow-xl">
                  Create an Account
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default Shop;
