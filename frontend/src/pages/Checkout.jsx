import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, ArrowLeft, CreditCard, Smartphone, MapPin, ChevronRight, CheckCircle2, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const getValidObjectId = (id) => {
  const str = String(id || '1');
  // If it's already a valid 24-char hex string, return it
  if (/^[0-9a-fA-F]{24}$/.test(str)) {
    return str;
  }
  // If it's a short numeric ID like "1", pad it
  if (/^[0-9a-fA-F]+$/.test(str) && str.length < 24) {
    return str.padStart(24, '0');
  }
  // Otherwise, return a safe fallback dummy ObjectId
  return '000000000000000000000001';
};

const Checkout = () => {
  const { cartItems } = useCart();
  const { formatPrice, currency } = useCurrency();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.name ? user.name.split(' ')[0] : '',
    lastName: user?.name ? user.name.split(' ').slice(1).join(' ') : '',
    phone: user?.phone || '',
    address: '',
    city: '',
    postalCode: '',
  });

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const gst = subtotal * 0.18;
  const shipping = subtotal > 100 ? 0 : 15.00;
  const total = subtotal + gst + shipping;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setGeoLoading(true);
    toast.loading('Locating you...', { id: 'geoToast' });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await response.json();
          
          if (data && data.address) {
            setFormData(prev => ({
              ...prev,
              address: data.address.road || data.address.suburb || '',
              city: data.address.city || data.address.town || data.address.village || '',
              postalCode: data.address.postcode || ''
            }));
            toast.success('Address auto-filled successfully!', { id: 'geoToast' });
          } else {
            toast.error('Could not determine exact address.', { id: 'geoToast' });
          }
        } catch (error) {
          toast.error('Failed to reverse geocode location.', { id: 'geoToast' });
        } finally {
          setGeoLoading(false);
        }
      },
      (error) => {
        console.error(error);
        toast.error('Location access denied or unavailable.', { id: 'geoToast' });
        setGeoLoading(false);
      }
    );
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.email || !formData.firstName || !formData.address || !formData.city || !formData.phone) {
        toast.error("Please fill all required shipping fields.");
        return;
      }
    }
    setStep(2);
    window.scrollTo(0, 0);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step !== 2) return;
    
    setLoading(true);
    
    if (paymentMethod === 'cod') {
      try {
        const orderRes = await fetch('https://t-shirt-brand-mern.onrender.com/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            orderItems: cartItems.map(item => ({
              name: item.product.name,
              qty: item.quantity,
              image: item.product.image,
              price: item.product.price,
              product: getValidObjectId(item.product.isCustomized ? item.product.baseProductId : (item.product.id || item.product._id)),
              color: item.color || item.product.colorName || item.product.color || 'Custom',
              size: item.size || 'M'
            })),
            shippingAddress: {
              street: formData.address,
              city: formData.city,
              postalCode: formData.postalCode,
              country: 'India'
            },
            paymentMethod: 'COD',
            itemsPrice: subtotal,
            taxPrice: gst,
            shippingPrice: shipping,
            totalPrice: total
          })
        });
        
        const data = await orderRes.json();
        if (data.success) {
          toast.success('Order placed successfully!');
          navigate('/order-success');
        } else {
          toast.error(data.error || 'Failed to place order');
        }
      } catch (err) {
        toast.error('Failed to connect to server');
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error('Razorpay SDK failed to load. Are you online?');
        setLoading(false);
        return;
      }

      // Initiate Razorpay transaction (no order in DB yet)
      const rzpOrderResponse = await fetch('https://t-shirt-brand-mern.onrender.com/api/payment/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ amount: total })
      });
      const rzpOrderData = await rzpOrderResponse.json();

      if (!rzpOrderData.success) {
        toast.error('Failed to initiate payment gateway');
        setLoading(false);
        return;
      }

      // Get config/key
      const configResponse = await fetch('https://t-shirt-brand-mern.onrender.com/api/payment/config');
      const configData = await configResponse.json();

      const options = {
        key: configData.key,
        amount: rzpOrderData.data.amount.toString(),
        currency: rzpOrderData.data.currency,
        name: 'CustomTees',
        description: 'Secure Checkout',
        order_id: rzpOrderData.data.id,
        handler: async function (response) {
          try {
            // Create order in DB FIRST now that payment was successful
            const orderRes = await fetch('https://t-shirt-brand-mern.onrender.com/api/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                orderItems: cartItems.map(item => ({
                  name: item.product.name,
                  qty: item.quantity,
                  image: item.product.image,
                  price: item.product.price,
                  product: getValidObjectId(item.product.isCustomized ? item.product.baseProductId : (item.product.id || item.product._id)),
                  color: item.color || item.product.colorName || item.product.color || 'Custom',
                  size: item.size || 'M'
                })),
                shippingAddress: {
                  street: formData.address,
                  city: formData.city,
                  postalCode: formData.postalCode,
                  country: 'India'
                },
                paymentMethod: 'Razorpay',
                itemsPrice: subtotal,
                taxPrice: gst,
                shippingPrice: shipping,
                totalPrice: total
              })
            });
            const dbOrderData = await orderRes.json();
            
            if (!dbOrderData.success) {
               toast.error('Payment succeeded but failed to create order record. Please contact support.');
               return;
            }

            // Verify payment
            const verifyRes = await fetch('https://t-shirt-brand-mern.onrender.com/api/payment/razorpay/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                orderId: dbOrderData.data._id
              })
            });
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              toast.success('Payment Successful!');
              navigate('/order-success');
            } else {
              toast.error('Payment verification failed');
            }
          } catch (err) {
            toast.error('Verification Error');
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#2563EB',
        },
      };

      if (configData.key === 'rzp_test_dummykey123456') {
        toast.loading('Simulating Razorpay Payment (Dummy Key)...', { duration: 1500 });
        setTimeout(() => {
          options.handler({
            razorpay_payment_id: 'pay_mock_' + Date.now(),
            razorpay_order_id: rzpOrderData.data.id,
            razorpay_signature: 'mock_signature'
          });
        }, 1500);
        return;
      }

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on('payment.failed', function (response) {
        toast.error('Payment Failed: ' + response.error.description);
      });

    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline font-bold">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans">
      
      {/* LEFT COLUMN - Checkout Form */}
      <div className="w-full lg:w-[55%] xl:w-1/2 lg:ml-auto px-4 sm:px-8 lg:px-16 py-10 flex flex-col">
        
        {/* Header / Logo */}
        <header className="mb-8 flex items-center justify-between">
          <div className="font-display font-extrabold text-2xl tracking-tight text-slate-900">
            CustomTees
          </div>
          <button onClick={() => navigate('/cart')} className="text-slate-500 hover:text-slate-900 font-medium text-sm flex items-center transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Return to Cart
          </button>
        </header>

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-3 text-sm font-medium mb-10">
          <span 
            onClick={() => setStep(1)} 
            className={`flex items-center gap-2 cursor-pointer transition-colors ${step === 1 ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
          >
            {step > 1 ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-xs">1</span>}
            Information
          </span>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <span className={`flex items-center gap-2 ${step === 2 ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${step === 2 ? 'bg-slate-100' : 'border border-slate-200'}`}>2</span>
            Payment
          </span>
        </nav>

        <form onSubmit={handleSubmit} className="flex-1">
          
          {/* STEP 1: Information */}
          {step === 1 && (
            <div className="space-y-10 animate-in fade-in duration-500">
              
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Contact</h2>
                <div className="space-y-4">
                  <div>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                      placeholder="Email Address"
                    />
                  </div>
                  <div>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                      placeholder={`Phone Number (${currency === 'INR' ? '+91' : '+1'})`}
                    />
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-900">Shipping Address</h2>
                  <button 
                    type="button" 
                    onClick={handleGetCurrentLocation}
                    disabled={geoLoading}
                    className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50"
                  >
                    <MapPin className="w-4 h-4" /> {geoLoading ? 'Locating...' : 'Auto-fill Location'}
                  </button>
                </div>
                
                <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="firstName" placeholder="First Name" required value={formData.firstName} onChange={handleChange} className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" />
                    <input type="text" name="lastName" placeholder="Last Name" required value={formData.lastName} onChange={handleChange} className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" />
                  </div>
                  <input type="text" name="address" placeholder="Street Address" required value={formData.address} onChange={handleChange} className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="city" placeholder="City" required value={formData.city} onChange={handleChange} className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" />
                    <input type="text" name="postalCode" placeholder="Postal Code" required value={formData.postalCode} onChange={handleChange} className="w-full px-4 py-3.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all" />
                  </div>
                </div>
              </section>

              <div className="pt-4 flex items-center justify-end">
                <button 
                  type="button" 
                  onClick={nextStep}
                  className="py-4 px-10 bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg rounded-xl shadow-lg shadow-slate-900/20 transition-all flex items-center gap-2"
                >
                  Continue to Payment <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Payment */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              
              {/* Summary of Info */}
              <div className="border border-slate-200 rounded-2xl divide-y divide-slate-200 bg-white shadow-sm">
                <div className="p-4 flex items-start justify-between">
                  <div className="grid grid-cols-[80px_1fr] gap-4">
                    <span className="text-slate-500 text-sm">Contact</span>
                    <span className="text-slate-900 font-medium text-sm">{formData.email}</span>
                  </div>
                  <button type="button" onClick={() => setStep(1)} className="text-sm font-bold text-blue-600 hover:underline">Change</button>
                </div>
                <div className="p-4 flex items-start justify-between">
                  <div className="grid grid-cols-[80px_1fr] gap-4">
                    <span className="text-slate-500 text-sm">Ship to</span>
                    <span className="text-slate-900 font-medium text-sm">{formData.address}, {formData.city} {formData.postalCode}</span>
                  </div>
                  <button type="button" onClick={() => setStep(1)} className="text-sm font-bold text-blue-600 hover:underline">Change</button>
                </div>
              </div>

              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Payment</h2>
                <p className="text-slate-500 text-sm mb-6">All transactions are secure and encrypted.</p>
                
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                  
                  {/* Razorpay Option */}
                  <label className={`block p-5 cursor-pointer transition-colors border-b border-slate-200 ${paymentMethod === 'razorpay' ? 'bg-slate-50' : 'hover:bg-slate-50'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value="razorpay" 
                          checked={paymentMethod === 'razorpay'} 
                          onChange={() => setPaymentMethod('razorpay')}
                          className="w-5 h-5 text-slate-900 border-slate-300 focus:ring-slate-900"
                        />
                        <span className="font-bold text-slate-900">Razorpay Secure</span>
                      </div>
                      <div className="flex gap-2">
                        <Smartphone className="w-5 h-5 text-slate-600" />
                        <CreditCard className="w-5 h-5 text-slate-600" />
                      </div>
                    </div>
                    {paymentMethod === 'razorpay' && (
                      <div className="mt-4 pl-8 flex items-start gap-3 text-sm text-slate-600">
                        <Lock className="w-5 h-5 text-green-600 shrink-0" />
                        <p>After clicking "Pay now", you will be redirected to Razorpay to complete your purchase securely using Credit/Debit Card, UPI, or NetBanking.</p>
                      </div>
                    )}
                  </label>

                  {/* COD Option */}
                  <label className={`block p-5 cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'bg-slate-50' : 'hover:bg-slate-50'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value="cod" 
                          checked={paymentMethod === 'cod'} 
                          onChange={() => setPaymentMethod('cod')}
                          className="w-5 h-5 text-slate-900 border-slate-300 focus:ring-slate-900"
                        />
                        <span className="font-bold text-slate-900">Cash on Delivery (COD)</span>
                      </div>
                      <Truck className="w-5 h-5 text-slate-600" />
                    </div>
                  </label>
                  
                </div>
              </section>

              <div className="pt-6 flex flex-col gap-4">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full py-4.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {loading ? 'Processing securely...' : `Pay ${formatPrice(total)}`}
                </button>
                <div className="flex items-center justify-center gap-2 text-slate-500 text-sm mt-2">
                  <ShieldCheck className="w-4 h-4 text-green-600" /> 256-bit encrypted secure checkout
                </div>
              </div>

            </div>
          )}
        </form>

      </div>

      {/* RIGHT COLUMN - Order Summary (Sticky Desktop) */}
      <div className="w-full lg:w-[45%] xl:w-1/2 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200">
        <div className="lg:sticky lg:top-0 px-4 sm:px-8 lg:px-16 py-10 max-h-screen overflow-y-auto">
          
          <h2 className="text-lg font-bold text-slate-900 mb-6 lg:hidden">Order Summary</h2>

          <div className="space-y-4 mb-8">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-xl border border-slate-200 bg-slate-100 overflow-hidden flex items-center justify-center relative">
                    <img src={item.product.image} className="w-full h-full object-cover" alt="" />
                    {item.product.isCustomized && (
                      <>
                        {item.product.colorHex && item.product.colorName !== 'White' && (
                          <div className="absolute inset-0 mix-blend-multiply opacity-60 pointer-events-none" style={{ backgroundColor: item.product.colorHex }} />
                        )}
                        {item.product.customImage && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div style={{ width: '60%', height: '50%', position: 'relative' }}>
                              <img src={item.product.customImage} className="w-full h-full object-contain" />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-slate-500 text-white text-xs font-bold flex items-center justify-center rounded-full shadow-sm">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{item.product.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{item.size}</p>
                </div>
                <div className="font-medium text-slate-900">
                  {formatPrice(item.product.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 text-sm text-slate-600 border-t border-slate-200 pt-6 mb-6">
            <div className="flex justify-between items-center">
              <span>Subtotal</span>
              <span className="font-medium text-slate-900">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Shipping</span>
              <span className="font-medium text-slate-900">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Estimated Taxes (18% GST)</span>
              <span className="font-medium text-slate-900">{formatPrice(gst)}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center border-t border-slate-200 pt-6">
            <span className="text-base font-medium text-slate-900">Total</span>
            <div className="flex items-end gap-2">
              <span className="text-xs text-slate-500 mb-1">{currency}</span>
              <span className="text-3xl font-display font-extrabold text-slate-900">{formatPrice(total)}</span>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  );
};

export default Checkout;
