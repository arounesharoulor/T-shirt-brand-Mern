import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Truck, ArrowLeft, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

const MyOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch('https://t-shirt-brand-mern.onrender.com/api/orders/myorders', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setOrders(data.data.reverse()); // Show newest first
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const getDeliveryDate = (orderDate) => {
    const date = new Date(orderDate);
    date.setDate(date.getDate() + 4); // Estimated 4 days delivery
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading orders...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 py-12 font-sans selection:bg-indigo-500 selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-5 mb-10">
          <button onClick={() => navigate(-1)} className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md shadow-slate-200/50 border border-slate-100 hover:scale-105 transition-transform">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-4xl font-display font-extrabold text-slate-900 tracking-tight">Order History</h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 shadow-xl shadow-slate-200/40">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">No orders yet</h2>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto text-lg">Your order history is empty. Time to treat yourself to something new!</p>
            <button onClick={() => navigate('/shop')} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-600/20 text-lg">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/30 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* Premium Order Header */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-white">
                  <div className="grid grid-cols-2 sm:flex sm:gap-12 gap-y-6">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Order Placed</p>
                      <p className="text-base font-bold">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Total</p>
                      <p className="text-base font-bold">{formatPrice(order.totalPrice)}</p>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Order #</p>
                      <p className="text-base font-bold text-indigo-300">{order._id.substring(order._id.length - 10).toUpperCase()}</p>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className={`px-5 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-inner backdrop-blur-sm ${order.isDelivered ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'}`}>
                    {order.isDelivered ? <CheckCircle2 className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
                    <span className="text-sm font-bold tracking-wide">
                      {order.isDelivered ? 'Delivered' : 'In Transit'}
                    </span>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-8 bg-amber-50 text-amber-800 px-5 py-4 rounded-2xl border border-amber-100">
                    <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                    <span className="font-semibold text-sm sm:text-base">
                      {order.isDelivered 
                        ? `Successfully delivered on ${new Date(order.deliveredAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}` 
                        : `Estimated delivery by ${getDeliveryDate(order.createdAt)}`
                      }
                    </span>
                  </div>

                  <div className="space-y-6 divide-y divide-slate-100">
                    {order.orderItems.map((item, idx) => (
                      <div key={idx} className="flex gap-6 items-center pt-6 first:pt-0">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shrink-0 group">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-extrabold text-slate-900 text-lg truncate mb-1 sm:mb-2">{item.name}</h4>
                          <div className="flex flex-wrap gap-2 mb-2 sm:mb-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                              Size {item.size}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                              Qty {item.qty || item.quantity || 1}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-black text-slate-900 text-lg sm:text-xl">{formatPrice(item.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer - Price Breakdown */}
                <div className="bg-slate-50 border-t border-slate-200 p-6 sm:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                      <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-4">Shipping To</h4>
                      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                        <p className="text-base text-slate-600 leading-relaxed font-medium">
                          {order.shippingAddress.street}<br />
                          {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                          {order.shippingAddress.country}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-3">
                      <div className="flex justify-between text-base">
                        <span className="text-slate-500 font-medium">Subtotal</span>
                        <span className="font-bold text-slate-900">{formatPrice(order.itemsPrice || 0)}</span>
                      </div>
                      <div className="flex justify-between text-base">
                        <span className="text-slate-500 font-medium">Shipping</span>
                        <span className="font-bold text-slate-900">{order.shippingPrice === 0 ? <span className="text-green-600">Free</span> : formatPrice(order.shippingPrice)}</span>
                      </div>
                      <div className="flex justify-between text-base">
                        <span className="text-slate-500 font-medium">Tax</span>
                        <span className="font-bold text-slate-900">{formatPrice(order.taxPrice)}</span>
                      </div>
                      <div className="flex justify-between text-xl font-black pt-4 border-t border-slate-100 mt-2">
                        <span className="text-slate-900">Total</span>
                        <span className="text-indigo-600">{formatPrice(order.totalPrice)}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
