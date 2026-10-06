import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Truck, ShieldCheck, Paintbrush, ShoppingBag, ArrowLeft, Ruler, Heart, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { ALL_PRODUCTS } from '../data/products';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL'];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('L');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  // Carousel State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Review State
  const [reviews, setReviews] = useState([]);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${id}`);
      const data = await response.json();
      if (data.success) {
        setReviews(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch reviews', error);
    }
  };

  useEffect(() => {
    // Find the product based on ID
    const foundProduct = ALL_PRODUCTS.find(p => p._id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      fetchReviews();
    } else {
      navigate('/shop');
    }
  }, [id, navigate]);

  // Auto Carousel Effect
  useEffect(() => {
    if (!product) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, [product]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          product: id,
          rating: newReviewRating,
          comment: newReviewComment
        })
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success('Review posted successfully!');
        setNewReviewComment('');
        setNewReviewRating(5);
        fetchReviews(); // refresh reviews
      } else {
        toast.error(data.error || 'Failed to post review');
      }
    } catch (error) {
      toast.error('Server error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (!product) return null; // or a loading spinner

  const mockImages = [
    product.image,
    product.image + '&auto=format&fit=crop&rot=90',
    product.image + '&auto=format&fit=crop&flip=h',
    product.image + '&auto=format&fit=crop&q=60'
  ];

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
    toast.success(`${product.name} added to cart!`, { icon: '🛒' });
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, quantity);
    navigate('/checkout');
  };

  const handleCustomise = () => {
    // Pass product info to customiser
    navigate('/customiser', { state: { product, selectedColor: { name: product.color, hex: '#000' } } });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % mockImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + mockImages.length) % mockImages.length);
  };

  return (
    <div className="min-h-screen bg-white pt-6 pb-24 font-sans">
      
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left Column - Product Gallery (Sticky on Desktop) */}
          <div className="w-full lg:w-1/2">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] bg-gradient-to-tr from-slate-100 to-slate-200 rounded-[2.5rem] overflow-hidden group shadow-inner">
                {product.isNew && (
                  <div className="absolute top-6 left-6 z-20 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl uppercase tracking-wider shadow-lg shadow-blue-600/30">
                    New Arrival
                  </div>
                )}
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    <img 
                      src={mockImages[currentImageIndex]} 
                      alt={product.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Carousel Controls */}
                <button 
                  onClick={prevImage}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/70 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 shadow-xl z-10 text-slate-800"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/70 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 shadow-xl z-10 text-slate-800"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Dots indicator */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-10">
                  {mockImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImageIndex(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 shadow-sm ${currentImageIndex === i ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-4 mt-6">
                {mockImages.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentImageIndex(i)}
                    className={`aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer border-2 transition-all relative ${currentImageIndex === i ? 'border-blue-600 shadow-md scale-[1.02]' : 'border-transparent hover:border-slate-300'}`}
                  >
                    <img src={img} className="w-full h-full object-cover transition-opacity" alt={`thumbnail ${i}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center py-4 lg:py-10">
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="mb-3 inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest rounded-lg">
                {product.category}
              </div>
              
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                  {product.name}
                </h1>
                {user && (
                  <button 
                    onClick={() => toggleWishlist(product)}
                    className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-red-50 hover:border-red-100 transition-colors shrink-0 shadow-sm group"
                  >
                    <Heart className={`w-6 h-6 transition-transform group-hover:scale-110 ${isInWishlist(product._id) ? 'text-red-500 fill-red-500' : 'text-slate-400'}`} />
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-6 mb-8">
                <span className="text-3xl font-extrabold text-slate-900">
                  {formatPrice(product.price)}
                </span>
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl border border-amber-100">
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                  <span className="text-sm font-bold text-amber-900">{product.rating}</span>
                  <span className="text-sm font-medium text-amber-700/60">({product.reviews} reviews)</span>
                </div>
              </div>

              <p className="text-lg text-slate-600 leading-relaxed mb-10 font-medium">
                {product.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-slate-50/50 p-6 sm:p-8 rounded-[2rem] border border-slate-100"
            >
              {/* Size Selection */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Select Size</h3>
                  <button className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors">
                    <Ruler className="w-4 h-4" /> Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {SIZES.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                        selectedSize === size 
                          ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 scale-[1.02]' 
                          : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Quantity</h3>
                <div className="flex items-center gap-4 bg-white border border-slate-200 w-fit p-1 rounded-2xl shadow-sm">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center text-slate-600 hover:bg-slate-50 rounded-xl transition-colors font-bold text-lg">-</button>
                  <span className="w-8 text-center font-bold text-lg text-slate-900">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center text-slate-600 hover:bg-slate-50 rounded-xl transition-colors font-bold text-lg">+</button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 mb-8">
                {user ? (
                  <>
                    <div className="flex gap-4">
                      <button 
                        onClick={handleAddToCart}
                        className="flex-1 py-4 px-4 bg-white border-2 border-slate-200 hover:border-slate-900 text-slate-900 font-bold text-base rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        <ShoppingBag className="w-5 h-5" /> Add to Bag
                      </button>
                      <button 
                        onClick={handleBuyNow}
                        className="flex-1 py-4 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base rounded-2xl shadow-xl shadow-blue-600/20 flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                      >
                        Buy Now
                      </button>
                    </div>
                    <button 
                      onClick={handleCustomise}
                      className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 group shadow-xl shadow-slate-900/20 hover:-translate-y-1 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      <Paintbrush className="w-5 h-5 relative z-10" /> <span className="relative z-10">Customise Your Design</span>
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => navigate('/register')}
                    className="w-full py-5 px-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold text-lg rounded-2xl shadow-xl shadow-slate-900/20 flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                  >
                    Create Free Account to Purchase
                  </button>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-bold text-slate-700 leading-tight">Free global<br/>shipping</span>
                </div>
                <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm font-bold text-slate-700 leading-tight">Lifetime<br/>guarantee</span>
                </div>
              </div>
            </motion.div>
            
          </div>
        </div>
        
        {/* Product Details Tabs (Description, Reviews) */}
        <div className="mt-24 max-w-4xl mx-auto">
          <div className="border-b border-slate-200 flex gap-8">
            <button 
              onClick={() => setActiveTab('description')}
              className={`pb-4 text-lg font-bold transition-colors ${activeTab === 'description' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Description
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-lg font-bold transition-colors ${activeTab === 'reviews' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Customer Reviews ({product.reviews})
            </button>
            <button 
              onClick={() => setActiveTab('shipping')}
              className={`pb-4 text-lg font-bold transition-colors ${activeTab === 'shipping' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Shipping & Returns
            </button>
          </div>
          
          <div className="py-8 prose prose-slate prose-lg max-w-none text-slate-600">
            {activeTab === 'description' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p>
                  The <strong>{product.name}</strong> is crafted from the highest grade materials. We spent months perfecting the fit, ensuring it drapes perfectly whether worn blank or adorned with your custom designs. 
                </p>
                <ul>
                  <li>100% Organic Cotton</li>
                  <li>Pre-shrunk to minimize shrinkage</li>
                  <li>Ribbed collar that won't lose shape</li>
                  <li>Tear-away tag for custom branding</li>
                </ul>
                <p>
                  Ready to make it yours? Use our built-in design studio by clicking "Customise Design" above to add your own graphics, text, or logos.
                </p>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div className="flex items-center gap-6 mb-8 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="text-6xl font-display font-black text-slate-900">{product.rating}</div>
                  <div className="flex flex-col gap-1">
                    <div className="flex text-amber-400">
                      {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                    </div>
                    <span className="text-sm font-bold text-slate-500">Based on {reviews.length > 0 ? reviews.length : product.reviews} reviews</span>
                  </div>
                </div>

                {/* Review Form */}
                {user ? (
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-8">
                    <h4 className="font-bold text-slate-900 mb-4">Leave a Review</h4>
                    <form onSubmit={handleReviewSubmit}>
                      <div className="mb-4">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Rating</label>
                        <div className="flex gap-2 text-amber-400">
                          {[1,2,3,4,5].map(i => (
                            <button 
                              key={i} type="button" 
                              onClick={() => setNewReviewRating(i)}
                              className="focus:outline-none hover:scale-110 transition-transform"
                            >
                              <Star className={`w-6 h-6 ${i <= newReviewRating ? 'fill-current' : 'text-slate-300'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Comment</label>
                        <textarea 
                          className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                          rows="3"
                          placeholder="What did you think about this product?"
                          value={newReviewComment}
                          onChange={(e) => setNewReviewComment(e.target.value)}
                          required
                        />
                      </div>
                      <button 
                        type="submit" 
                        disabled={isSubmittingReview}
                        className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-70"
                      >
                        {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="bg-slate-50 p-6 rounded-2xl mb-8 flex items-center justify-between border border-slate-100">
                    <p className="font-medium text-slate-700 m-0">Please sign in to leave a review.</p>
                    <button onClick={() => navigate('/login')} className="px-5 py-2 bg-white border border-slate-200 rounded-lg font-bold text-sm hover:bg-slate-100">
                      Sign In
                    </button>
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.length > 0 ? reviews.map(review => (
                    <div key={review._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">
                            {review.userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-base leading-none">{review.userName}</div>
                            <div className="text-xs text-slate-500 mt-1">{new Date(review.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex text-amber-400 mb-3">
                        {[1,2,3,4,5].map(i => <Star key={i} className={`w-4 h-4 ${i <= review.rating ? 'fill-current' : 'text-slate-200'}`} />)}
                      </div>
                      <p className="text-slate-700 m-0 text-base">{review.comment}</p>
                    </div>
                  )) : (
                    <div className="text-center py-10 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-slate-500 font-medium">No reviews yet. Be the first to review this product!</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'shipping' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h4 className="font-bold text-slate-900 mb-2">Free Global Shipping</h4>
                <p className="mb-6">We offer free standard shipping on all orders over $100. Standard delivery typically takes 3-5 business days. Express shipping options are available at checkout.</p>
                
                <h4 className="font-bold text-slate-900 mb-2">Easy Returns & Refunds</h4>
                <p>Not completely satisfied? We accept returns within 30 days of delivery. If you received a damaged item or the wrong color, you can easily request a refund.</p>
                <div className="mt-4">
                  <Link to="/refund" className="text-blue-600 font-bold hover:underline inline-flex items-center">
                    Start a Return or Refund Request <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProductDetail;
