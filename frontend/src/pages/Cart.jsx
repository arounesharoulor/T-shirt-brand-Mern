import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X, ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  // Calculate subtotal
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 15.00;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-slate-300" />
        </div>
        <h2 className="text-3xl font-display font-extrabold text-slate-900 mb-4">Your bag is empty</h2>
        <p className="text-slate-500 mb-8 max-w-sm text-center">Looks like you haven't added any premium blanks or custom designs to your bag yet.</p>
        <button 
          onClick={() => navigate(-1)}
          className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-1"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-4xl font-display font-extrabold text-slate-900 tracking-tight">Your Bag</h1>
            <p className="text-slate-500 mt-1 font-medium">{cartItems.length} items</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column: Cart Items */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    key={`${item.product._id}-${item.size}`} 
                    className="flex flex-col sm:flex-row gap-6 py-6 border-b border-slate-100 last:border-0"
                  >
                    {/* Item Image */}
                    <div className="w-24 sm:w-32 aspect-[4/5] bg-slate-100 rounded-2xl overflow-hidden shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 mb-1">
                            <Link to={`/product/${item.product._id}`} className="hover:text-blue-600 transition-colors">
                              {item.product.name}
                            </Link>
                          </h3>
                          <p className="text-slate-500 text-sm font-medium mb-1">Color: {item.product.color}</p>
                          <p className="text-slate-500 text-sm font-medium">Size: {item.size}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.product._id, item.size)}
                          className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Selector */}
                        <div className="flex items-center gap-4 bg-slate-50 px-2 py-1 rounded-xl border border-slate-200">
                          <button 
                            onClick={() => updateQuantity(item.product._id, item.size, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-4 text-center font-bold text-slate-900">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product._id, item.size, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <span className="text-xl font-bold text-slate-900">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 sticky top-28">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 text-slate-600 font-medium mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-slate-900">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="text-slate-900">Calculated at checkout</span>
                </div>
              </div>

              <div className="h-px bg-slate-100 mb-6" />

              <div className="flex justify-between items-end mb-8">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-3xl font-display font-extrabold text-slate-900">{formatPrice(total)}</span>
              </div>

              <Link to="/checkout" className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg rounded-2xl shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2 transition-all hover:-translate-y-1">
                Checkout Securely <ArrowRight className="w-5 h-5" />
              </Link>
              
              <p className="text-xs text-center text-slate-400 mt-4 font-medium flex items-center justify-center gap-1">
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
