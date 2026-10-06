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
    <div className="min-h-screen bg-white py-12 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="hover:bg-gray-100 p-2 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-900" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Order History</h1>
          </div>
          <span className="text-gray-500 text-sm">{orders.length} {orders.length === 1 ? 'Order' : 'Orders'}</span>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-8">You haven't placed any orders yet.</p>
            <button onClick={() => navigate('/shop')} className="px-6 py-3 bg-black text-white font-medium hover:bg-gray-900 transition-colors">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {orders.map((order) => (
              <div key={order._id} className="border border-gray-200 rounded-lg overflow-hidden">
                
                {/* Minimal Header */}
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex flex-wrap justify-between items-center gap-4 text-sm">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-gray-500 mb-1">Order Placed</p>
                      <p className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Total</p>
                      <p className="font-medium text-gray-900">{formatPrice(order.totalPrice)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 mb-1">Order # {order._id.substring(order._id.length - 10).toUpperCase()}</p>
                    <a href="#" className="text-blue-600 hover:underline font-medium">View Invoice</a>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                  {order.isDelivered ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="font-bold text-green-700">Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</span>
                    </>
                  ) : (
                    <>
                      <Truck className="w-5 h-5 text-black" />
                      <span className="font-bold text-black">
                        Arriving by {getDeliveryDate(order.createdAt)}
                      </span>
                    </>
                  )}
                </div>

                {/* Items List */}
                <div className="px-6 py-6 space-y-6">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex gap-6">
                      <div className="w-24 h-32 bg-gray-50 border border-gray-100 shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover mix-blend-multiply" 
                        />
                      </div>
                      <div className="flex-1 flex justify-between">
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg mb-1">{item.name}</h4>
                          <p className="text-gray-500 text-sm mb-1">Size: {item.size}</p>
                          <p className="text-gray-500 text-sm">Qty: {item.qty || item.quantity || 1}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{formatPrice(item.price)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer details (Shipping & Summary side-by-side) */}
                <div className="bg-gray-50 px-6 py-6 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row justify-between gap-8">
                    
                    {/* Shipping Address */}
                    <div className="flex-1 max-w-xs">
                      <h4 className="font-bold text-gray-900 text-sm mb-3">Shipping Address</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {order.shippingAddress.street}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                        {order.shippingAddress.country}
                      </p>
                    </div>

                    {/* Order Summary */}
                    <div className="w-full md:w-72">
                      <h4 className="font-bold text-gray-900 text-sm mb-3">Order Summary</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Item(s) Subtotal:</span>
                          <span className="text-gray-900">{formatPrice(order.itemsPrice || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping:</span>
                          <span className="text-gray-900">{order.shippingPrice === 0 ? 'Free' : formatPrice(order.shippingPrice)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax:</span>
                          <span className="text-gray-900">{formatPrice(order.taxPrice)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-gray-900 text-base pt-3 border-t border-gray-200 mt-2">
                          <span>Grand Total:</span>
                          <span>{formatPrice(order.totalPrice)}</span>
                        </div>
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
