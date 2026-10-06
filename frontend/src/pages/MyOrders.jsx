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
    <div className="min-h-screen bg-slate-50 py-10 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200 hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-3xl font-display font-extrabold text-slate-900">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">No orders yet</h2>
            <p className="text-slate-500 mb-6">You haven't placed any orders yet. Start exploring our collection!</p>
            <button onClick={() => navigate('/shop')} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">
              Browse Shop
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Order Header */}
                <div className="bg-slate-50 border-b border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Order Placed</p>
                    <p className="text-sm font-bold text-slate-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Amount</p>
                    <p className="text-sm font-bold text-slate-900">{formatPrice(order.totalPrice)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Order ID</p>
                    <p className="text-sm font-bold text-slate-900">#{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                  </div>
                  
                  {/* Delivery Status Badge */}
                  <div className={`px-4 py-2 rounded-xl flex items-center gap-2 ${order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {order.isDelivered ? <CheckCircle2 className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                    <span className="text-xs font-bold tracking-wide">
                      {order.isDelivered ? 'Delivered' : 'In Transit'}
                    </span>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-6 text-slate-700">
                    <Clock className="w-5 h-5 text-amber-500" />
                    <span className="font-bold text-sm">
                      {order.isDelivered 
                        ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString()}` 
                        : `Expected Delivery by ${getDeliveryDate(order.createdAt)}`
                      }
                    </span>
                  </div>

                  <div className="space-y-4">
                    {order.orderItems.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                          <p className="text-sm text-slate-500 mt-1">Size: {item.size} • Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">{formatPrice(item.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer - Price Breakdown */}
                <div className="bg-slate-50 border-t border-slate-200 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm mb-2">Shipping Address</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {order.shippingAddress.street}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Subtotal</span>
                        <span className="font-medium text-slate-900">{formatPrice(order.itemsPrice)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Shipping (Affordable)</span>
                        <span className="font-medium text-slate-900">{order.shippingPrice === 0 ? 'Free' : formatPrice(order.shippingPrice)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Tax</span>
                        <span className="font-medium text-slate-900">{formatPrice(order.taxPrice)}</span>
                      </div>
                      <div className="flex justify-between text-base font-bold pt-2 border-t border-slate-200">
                        <span className="text-slate-900">Total</span>
                        <span className="text-slate-900">{formatPrice(order.totalPrice)}</span>
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
