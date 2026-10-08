import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Shirt, Globe, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrency } from '../../context/CurrencyContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { currency, setCurrency } = useCurrency();
  const { getCartCount } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Customise', path: '/customiser' },
    { name: 'Help & Support', path: '/help' },
  ];

  const toggleCurrency = () => {
    setCurrency(currency === 'USD' ? 'INR' : 'USD');
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
              <Shirt className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-900">
              CustomTees
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path === '/customiser' && !user ? '/register' : link.path}
                className={`text-sm font-bold transition-colors hover:text-primary ${
                  location.pathname === link.path ? 'text-primary' : 'text-slate-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {user && user.role === 'admin' && (
              <Link
                to="/admin"
                className={`text-sm font-bold transition-colors hover:text-primary ${
                  location.pathname.startsWith('/admin') ? 'text-primary' : 'text-slate-600'
                }`}
              >
                Admin Panel
              </Link>
            )}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-6">
            
            <button 
              onClick={toggleCurrency}
              className="flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full"
            >
              <Globe className="w-4 h-4" />
              <span>{currency}</span>
            </button>

            {user && (
              <Link to="/wishlist" className="text-slate-600 hover:text-red-500 transition-colors">
                <Heart className="w-5 h-5" />
              </Link>
            )}
            
            <Link to={user ? "/profile" : "/login"} className="text-slate-600 hover:text-slate-900 transition-colors">
              <User className="w-5 h-5" />
            </Link>

            {user && (
              <Link to="/cart" className="relative text-slate-600 hover:text-slate-900 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={toggleCurrency}
              className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-full"
            >
              <Globe className="w-3 h-3" />
              {currency}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-slate-100 py-4 md:hidden"
          >
            <div className="flex flex-col px-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path === '/customiser' && !user ? '/register' : link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-bold px-4 py-2 rounded-xl transition-colors ${
                    location.pathname === link.path
                      ? 'bg-primary/10 text-primary'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {user && user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-bold px-4 py-2 rounded-xl transition-colors ${
                    location.pathname.startsWith('/admin')
                      ? 'bg-primary/10 text-primary'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Admin Panel
                </Link>
              )}
              <div className="h-px bg-slate-100 my-2" />
              <Link
                to={user ? "/profile" : "/login"}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-xl font-bold"
              >
                <User className="w-5 h-5" /> {user ? "My Profile" : "Account / Login"}
              </Link>
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-xl font-bold"
              >
                <ShoppingCart className="w-5 h-5" /> Cart ({getCartCount()} items)
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
