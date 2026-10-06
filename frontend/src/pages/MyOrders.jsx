import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Truck, ArrowLeft, Clock, CheckCircle2, Shirt } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

const MyOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

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
                    <button 
                      onClick={() => setSelectedInvoice(order)} 
                      className="text-blue-600 hover:underline font-medium"
                    >
                      View Invoice
                    </button>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-sm">
                
                {/* Billed To Box */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col h-full">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Billed To</p>
                  <p className="font-bold text-slate-900 text-base mb-1">{user.name}</p>
                  <p className="text-slate-500">{user.email}</p>
                </div>

                {/* Shipped To Box */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col h-full">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Shipped To</p>
                  <p className="font-bold text-slate-900 text-base mb-1">{selectedInvoice.shippingAddress.street}</p>
                  <p className="text-slate-500">
                    {selectedInvoice.shippingAddress.city}, {selectedInvoice.shippingAddress.postalCode}<br />
                    {selectedInvoice.shippingAddress.country}
                  </p>
                </div>

                {/* Invoice Details Box */}
                <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10 flex flex-col h-full">
                  <p className="text-xs font-bold text-primary/60 uppercase tracking-wider mb-3">Invoice Details</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Invoice No:</span>
                      <span className="font-bold text-slate-900">{selectedInvoice._id.substring(selectedInvoice._id.length - 8).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Date:</span>
                      <span className="font-bold text-slate-900">{new Date(selectedInvoice.createdAt).toLocaleDateString('en-GB')}</span>
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
