import { Link, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';

const Wishlist = () => {
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
          <Heart className="w-10 h-10 text-slate-300" />
        </div>
        <h2 className="text-3xl font-display font-extrabold text-slate-900 mb-4 text-center">Your Wishlist is Empty</h2>
        <p className="text-slate-500 mb-8 text-center max-w-md">Looks like you haven't added anything to your wishlist yet. Explore our collection and find something you love!</p>
        <Link to="/shop" className="bg-slate-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-slate-800 transition-colors">
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>

        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-display font-extrabold text-slate-900 flex items-center gap-3">
            My Wishlist <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          </h1>
          <span className="text-slate-500 font-bold bg-slate-200 px-4 py-1.5 rounded-full text-sm">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlistItems.map((product) => (
            <div key={product._id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 group relative">
              
              {/* Wishlist Toggle */}
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist(product);
                }}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
              >
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              </button>

              <Link to={`/product/${product._id}`} className="block relative aspect-[4/5] overflow-hidden bg-slate-100">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
              
              <div className="p-6">
                <div className="text-xs font-bold tracking-widest text-indigo-600 uppercase mb-2">
                  {product.category || 'T-Shirt'}
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2 truncate">
                  <Link to={`/product/${product._id}`} className="hover:text-indigo-600 transition-colors">
                    {product.name}
                  </Link>
                </h3>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-display font-bold text-xl text-slate-900">
                    {formatPrice(product.price)}
                  </span>
                  <Link to={`/product/${product._id}`} className="flex items-center justify-center w-10 h-10 bg-slate-900 text-white rounded-full hover:bg-indigo-600 transition-colors">
                    <ShoppingBag className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
