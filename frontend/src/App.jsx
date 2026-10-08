import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Customiser from './pages/Customiser';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import RefundRequest from './pages/RefundRequest';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import Help from './pages/Help';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import AdminProducts from './pages/AdminProducts';
import { CurrencyProvider } from './context/CurrencyContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CurrencyProvider>
          <CartProvider>
            <Router>
              <div className="min-h-screen bg-background text-textMain flex flex-col font-sans">
                <Toaster position="top-right" />
                <Navbar />
                <main className="flex-grow pt-20">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/customiser" element={<Customiser />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/refund" element={<RefundRequest />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                    <Route path="/my-orders" element={<MyOrders />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/orders" element={<AdminOrders />} />
                    <Route path="/admin/products" element={<AdminProducts />} />
                  </Routes>
                </main>
              </div>
            </Router>
          </CartProvider>
        </CurrencyProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
