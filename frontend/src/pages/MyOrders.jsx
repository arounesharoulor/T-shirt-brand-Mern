import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Truck, ArrowLeft, Clock, CheckCircle2, Shirt, XCircle, RotateCcw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

const MyOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Cancel Modal State
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('not_needed');
  const [cancelPhoto, setCancelPhoto] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

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

  const handleCancelClick = (orderId) => {
    setOrderToCancel(orderId);
    setCancelReason('not_needed');
    setCancelPhoto(null);
    setCancelModalOpen(true);
  };

  const submitCancelOrder = async () => {
    if ((cancelReason === 'damage' || cancelReason === 'wrong_item') && !cancelPhoto) {
      alert('Please upload photo evidence for damaged or wrong items.');
      return;
    }

    setIsCancelling(true);
    try {
      const response = await fetch(`https://t-shirt-brand-mern.onrender.com/api/orders/${orderToCancel}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setOrders(orders.map(o => o._id === orderToCancel ? { ...o, isCancelled: true } : o));
        setCancelModalOpen(false);
      } else {
        alert(data.error || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
    } finally {
      setIsCancelling(false);
    }
  };

  const getDeliveryDate = (orderDate) => {
    const date = new Date(orderDate);
    date.setDate(date.getDate() + 4); // Estimated 4 days delivery
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const groupedOrders = useMemo(() => {
    // Ensure orders are sorted newest first
    const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const groups = [];
    sortedOrders.forEach(order => {
      const date = new Date(order.createdAt);
      const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      
      let group = groups.find(g => g.name === monthYear);
      if (!group) {
        group = { name: monthYear, items: [] };
        groups.push(group);
      }
      group.items.push(order);
    });
    return groups;
  }, [orders]);

  const generateInvoice = (order) => {
    const invoiceWindow = window.open('', '_blank');
    const orderId = order._id.substring(order._id.length - 10).toUpperCase();
    const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    const itemsHtml = order.orderItems.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <strong>${item.name}</strong><br>
          <small style="color: #666;">Size: ${item.size}</small>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.qty || item.quantity || 1}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(item.price)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(item.price * (item.qty || item.quantity || 1))}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <html>
        <head>
          <title>Invoice - ${orderId}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 40px; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 40px; }
            .logo { font-size: 24px; font-weight: bold; color: #000; }
            .invoice-title { font-size: 28px; font-weight: bold; color: #999; text-transform: uppercase; }
            .details { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .details h3 { margin-top: 0; margin-bottom: 10px; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            th { text-align: left; padding: 12px; border-bottom: 2px solid #333; font-size: 14px; text-transform: uppercase; color: #666; }
            .totals { width: 50%; float: right; }
            .total-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .grand-total { font-weight: bold; font-size: 18px; border-bottom: none; border-top: 2px solid #333; padding-top: 12px; margin-top: 4px; }
            .footer { clear: both; text-align: center; margin-top: 60px; font-size: 12px; color: #999; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">CustomTees</div>
            <div class="invoice-title">Invoice</div>
          </div>
          
          <div class="details">
            <div>
              <h3>Billed To:</h3>
              <strong>${user.name}</strong><br>
              ${user.email}<br><br>
              <h3>Shipped To:</h3>
              ${order.shippingAddress.street}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
              ${order.shippingAddress.country}
            </div>
            <div style="text-align: right;">
              <h3>Order ID:</h3>
              #${orderId}<br><br>
              <h3>Date of Issue:</h3>
              ${orderDate}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item Description</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>${formatPrice(order.itemsPrice || 0)}</span>
            </div>
            <div class="total-row">
              <span>Shipping:</span>
              <span>${order.shippingPrice === 0 ? 'Free' : formatPrice(order.shippingPrice)}</span>
            </div>
            <div class="total-row">
              <span>Tax:</span>
              <span>${formatPrice(order.taxPrice)}</span>
            </div>
            <div class="total-row grand-total">
              <span>Total Amount:</span>
              <span>${formatPrice(order.totalPrice)}</span>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for shopping with CustomTees! If you have any questions about this invoice, please contact support.</p>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    invoiceWindow.document.write(htmlContent);
    invoiceWindow.document.close();
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
            {groupedOrders.map((group) => (
              <div key={group.name} className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2">{group.name}</h3>
                <div className="space-y-12">
                  {group.items.map((order) => (
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
                          <button 
                            onClick={() => setSelectedInvoice(order)} 
                            className="text-blue-600 hover:underline font-medium"
                          >
                            View Invoice
                          </button>
                        </div>
                      </div>

                      {/* Status Bar */}
                      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-2">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            {order.isCancelled ? (
                              <>
                                <XCircle className="w-5 h-5 text-red-600" />
                                <span className="font-bold text-red-700">Cancelled</span>
                              </>
                            ) : order.isReturned ? (
                              <>
                                <RotateCcw className="w-5 h-5 text-orange-600" />
                                <span className="font-bold text-orange-700">Returned</span>
                              </>
                            ) : order.isDelivered ? (
                              <>
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                <span className="font-bold text-green-700">Delivered on {order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : 'N/A'}</span>
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
                          {(order.isCancelled || order.isReturned) && order.refundProof && (
                            <div className="text-sm text-gray-600 ml-7">
                              <span className="font-bold">Refund/Return Info:</span> {order.refundProof}
                            </div>
                          )}
                          {order.refundRequest?.isRequested && !order.isReturned && !order.isCancelled && (
                            <div className="text-sm text-amber-600 ml-7 font-bold">
                              Return requested. Under review.
                            </div>
                          )}
                        </div>


                        {/* Actions */}
                        <div>
                          {!order.isCancelled && !order.isDelivered && (
                            <button onClick={() => handleCancelClick(order._id)} className="text-red-600 hover:text-red-800 text-sm font-bold bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors">
                              Cancel Order
                            </button>
                          )}
                          {order.isDelivered && !order.isReturned && !order.isCancelled && (
                            <button onClick={() => navigate('/refund', { state: { orderId: order._id, email: user.email } })} className="text-orange-600 hover:text-orange-800 text-sm font-bold bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-lg transition-colors">
                              Return Order
                            </button>
                          )}
                        </div>
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
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invoice Modal Popup */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative flex flex-col border border-slate-200">
            
            {/* Modal Header actions - Non printable */}
            <div className="sticky top-0 right-0 px-6 py-4 flex justify-between items-center bg-white/95 backdrop-blur-md border-b border-slate-100 z-10 print:hidden">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-1.5 rounded-lg">
                  <Shirt className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-bold text-slate-800">Invoice Details</h3>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => window.print()} 
                  className="px-4 py-2 text-sm font-bold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Print
                </button>
                <button 
                  onClick={() => setSelectedInvoice(null)} 
                  className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Printable Invoice Area - Website Theme Style */}
            <div className="p-8 sm:p-12 print:p-0 print:m-0 bg-white text-slate-900" id="printable-invoice">
              
              {/* Header */}
              <div className="flex justify-between items-center border-b border-slate-200 pb-8 mb-8">
                {/* Matching Website Logo */}
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2.5 rounded-xl">
                    <Shirt className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <span className="font-display font-bold text-3xl tracking-tight text-slate-900 block">
                      CustomTees
                    </span>
                    <span className="text-sm text-slate-500">123 Fashion Street, contact@customtees.com</span>
                  </div>
                </div>
                <h2 className="text-4xl font-display font-bold text-slate-200 uppercase tracking-widest">Invoice</h2>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-sm items-stretch">
                
                {/* Billed To Box */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Billed To</p>
                  <p className="font-bold text-slate-900 text-base mb-1 truncate" title={user.name}>{user.name}</p>
                  <p className="text-slate-500 break-words">{user.email}</p>
                </div>

                {/* Shipped To Box */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Shipped To</p>
                  <p className="font-bold text-slate-900 text-base mb-1 truncate" title={selectedInvoice.shippingAddress.street}>{selectedInvoice.shippingAddress.street}</p>
                  <p className="text-slate-500 line-clamp-2">
                    {selectedInvoice.shippingAddress.city}, {selectedInvoice.shippingAddress.postalCode}
                  </p>
                  <p className="text-slate-500">{selectedInvoice.shippingAddress.country}</p>
                </div>

                {/* Invoice Details Box */}
                <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10 flex flex-col">
                  <p className="text-xs font-bold text-primary/60 uppercase tracking-wider mb-3">Invoice Details</p>
                  <div className="space-y-2 mt-auto">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Invoice No:</span>
                      <span className="font-bold text-slate-900 text-right">{selectedInvoice._id.substring(selectedInvoice._id.length - 8).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Date:</span>
                      <span className="font-bold text-slate-900 text-right">{new Date(selectedInvoice.createdAt).toLocaleDateString('en-GB')}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Items Table */}
              <div className="mb-12 border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="py-4 px-6 font-bold text-slate-700">Item</th>
                      <th className="py-4 px-6 font-bold text-slate-700 text-center w-24">Qty</th>
                      <th className="py-4 px-6 font-bold text-slate-700 text-right w-32">Price</th>
                      <th className="py-4 px-6 font-bold text-slate-700 text-right w-32">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedInvoice.orderItems.map((item, idx) => (
                      <tr key={idx} className="bg-white">
                        <td className="py-5 px-6">
                          <p className="font-bold text-slate-900 text-base">{item.name}</p>
                          <p className="text-slate-500 text-sm">Size: {item.size}</p>
                        </td>
                        <td className="py-5 px-6 text-center font-medium text-slate-700">{item.qty || item.quantity || 1}</td>
                        <td className="py-5 px-6 text-right font-medium text-slate-700">{formatPrice(item.price)}</td>
                        <td className="py-5 px-6 text-right font-bold text-slate-900">{formatPrice(item.price * (item.qty || item.quantity || 1))}</td>
                      </tr>
                    ))}
                    {/* Totals inside the table */}
                    <tr className="bg-slate-50/50">
                      <td colSpan="3" className="py-4 px-6 text-right text-slate-500 font-medium border-t border-slate-200">Subtotal</td>
                      <td className="py-4 px-6 text-right font-bold text-slate-700 border-t border-slate-200">{formatPrice(selectedInvoice.itemsPrice || 0)}</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td colSpan="3" className="py-4 px-6 text-right text-slate-500 font-medium">Shipping</td>
                      <td className="py-4 px-6 text-right font-bold text-slate-700">{selectedInvoice.shippingPrice === 0 ? 'Free' : formatPrice(selectedInvoice.shippingPrice)}</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td colSpan="3" className="py-4 px-6 text-right text-slate-500 font-medium">Tax</td>
                      <td className="py-4 px-6 text-right font-bold text-slate-700">{formatPrice(selectedInvoice.taxPrice)}</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td colSpan="3" className="py-5 px-6 text-right font-bold text-slate-900 text-base border-t border-slate-200">Total Due</td>
                      <td className="py-5 px-6 text-right font-display font-bold text-primary text-2xl border-t border-slate-200">{formatPrice(selectedInvoice.totalPrice)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="text-center pt-8 border-t border-slate-100">
                <p className="text-primary font-bold mb-1">Thank you for your business!</p>
                <p className="text-sm text-slate-500">If you have any questions regarding this invoice, please contact support.</p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      <AnimatePresence>
        {cancelModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={() => setCancelModalOpen(false)}
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl p-8 max-w-md w-full shadow-[0_0_40px_rgba(0,0,0,0.1)] relative overflow-hidden"
            >
              {/* AI Decorative Glows */}
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/20 blur-[50px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-500/20 blur-[50px] rounded-full pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-gradient-to-tr from-blue-600 to-violet-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/30">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Cancel Order</h2>
                </div>
                <p className="text-slate-500 mb-8 text-sm pl-14">Please tell us why you are cancelling this order.</p>

                <div className="space-y-6 mb-8">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Reason for Cancellation</label>
                    <div className="relative">
                      <select 
                        value={cancelReason} 
                        onChange={(e) => setCancelReason(e.target.value)}
                        className="w-full px-4 py-3.5 bg-white/80 border border-slate-200/80 rounded-xl focus:bg-white focus:ring-2 focus:ring-violet-500/50 outline-none font-medium text-slate-700 shadow-sm appearance-none transition-all"
                      >
                        <option value="not_needed">Item no longer needed</option>
                        <option value="ordered_by_mistake">Ordered by mistake</option>
                        <option value="found_better_price">Found a better price elsewhere</option>
                        <option value="damage">Received damaged / defective item</option>
                        <option value="wrong_item">Received wrong item</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {(cancelReason === 'damage' || cancelReason === 'wrong_item') && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2">
                          <label className="block text-sm font-bold text-slate-700 mb-2">Upload Photo Evidence</label>
                          <div className="relative border-2 border-dashed border-violet-200 bg-violet-50/50 rounded-xl p-6 hover:bg-violet-50 hover:border-violet-300 transition-colors text-center cursor-pointer group">
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => setCancelPhoto(e.target.files[0])} 
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                            />
                            <div className="flex flex-col items-center pointer-events-none">
                              {cancelPhoto ? (
                                <span className="font-bold text-violet-700 text-sm truncate max-w-[200px]">{cancelPhoto.name}</span>
                              ) : (
                                <>
                                  <Sparkles className="w-6 h-6 text-violet-400 mb-2 group-hover:text-violet-500 transition-colors" />
                                  <span className="text-sm font-bold text-violet-600">Tap to upload image</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setCancelModalOpen(false)} 
                    className="flex-1 py-3.5 text-slate-600 font-bold bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    Go Back
                  </button>
                  <button 
                    onClick={submitCancelOrder} 
                    disabled={isCancelling}
                    className="flex-1 py-3.5 text-white font-bold bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 rounded-xl transition-all shadow-lg shadow-red-500/25 disabled:opacity-50"
                  >
                    {isCancelling ? 'Submitting...' : 'Confirm Cancel'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Required CSS to hide everything else when printing the modal */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-invoice, #printable-invoice * { visibility: visible; }
          #printable-invoice { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; }
        }
      `}</style>
    </div>
  );
};

export default MyOrders;
