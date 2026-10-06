import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear the cart when reaching success page
    clearCart();
    
    // Automatically redirect to My Orders after 10 seconds if they don't click anything
    const timer = setTimeout(() => {
      navigate('/my-orders');
    }, 10000);

    return () => clearTimeout(timer);
  }, [clearCart, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl shadow-slate-200/50 max-w-lg w-full text-center border border-slate-100 animate-in fade-in zoom-in duration-500">
        
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-display font-extrabold text-slate-900 mb-4">
          Order Placed Successfully!
        </h1>
        
        <p className="text-slate-600 mb-8 leading-relaxed">
          Thank you for shopping with CustomTees. Your order has been received and is now being processed. We'll send you an email with the tracking details shortly.
        </p>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8 flex items-start gap-4 text-left">
          <Package className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-slate-900 mb-1">Expected Delivery</h4>
            <p className="text-sm text-slate-600">
              Your items will arrive in 3-5 business days. 
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            to="/my-orders" 
            className="flex-1 py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base rounded-xl shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            View My Orders <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            to="/shop" 
            className="flex-1 py-4 px-6 bg-white border-2 border-slate-200 hover:border-slate-900 text-slate-900 font-bold text-base rounded-xl transition-all hover:shadow-md flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default OrderSuccess;
