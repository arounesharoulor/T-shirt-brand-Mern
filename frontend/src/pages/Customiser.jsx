import { useState, useEffect, useRef } from 'react';
import { Canvas, IText, FabricImage } from 'fabric';
import { Type, Image as ImageIcon, ShoppingBag, Trash2, Ruler, Sparkles, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { COLORS } from '../data/products';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const Customiser = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  
  // Passed state from ProductDetail
  const passedProduct = location.state?.product || null;
  const passedColor = location.state?.selectedColor || COLORS[0];
  
  const categoryMockups = {
    'Half Sleeve': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    'Hoodie': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
    'Oversized': 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&q=80',
    'Full Sleeve': 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
  };
  const defaultImage = passedProduct ? (categoryMockups[passedProduct.category] || categoryMockups['Half Sleeve']) : categoryMockups['Half Sleeve'];
  
  const displayImage = passedProduct ? passedProduct.image : defaultImage;
  const basePrice = passedProduct ? passedProduct.price : 25.00;
  const customPrintPrice = 4.99;

  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [activeTab, setActiveTab] = useState('text');
  const [activeObj, setActiveObj] = useState(null);
  const [textColor, setTextColor] = useState('#000000');

  useEffect(() => {
    // Initialize Fabric.js canvas
    const initCanvas = new Canvas(canvasRef.current, {
      width: 280,
      height: 380,
      preserveObjectStacking: true,
    });

    initCanvas.on('selection:created', (e) => {
      setActiveObj(e.selected[0]);
      if (e.selected[0].type === 'i-text') {
        setTextColor(e.selected[0].fill);
      }
    });
    initCanvas.on('selection:updated', (e) => {
      setActiveObj(e.selected[0]);
      if (e.selected[0].type === 'i-text') {
        setTextColor(e.selected[0].fill);
      }
    });
    initCanvas.on('selection:cleared', () => {
      setActiveObj(null);
    });

    setCanvas(initCanvas);

    return () => {
      initCanvas.dispose();
    };
  }, []);

  const addText = () => {
    if (!canvas) return;
    const text = new IText('Your Text', {
      left: 50,
      top: 50,
      fontFamily: 'Inter',
      fill: passedColor && passedColor.name === 'Black' ? '#ffffff' : '#000000',
      fontSize: 30,
      fontWeight: 'bold',
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };
  
  const changeTextColor = (color) => {
    setTextColor(color);
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'i-text') {
      activeObject.set('fill', color);
      canvas.renderAll();
    }
  };

  const handleImageUpload = (e) => {
    if (!canvas) return;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (f) => {
        const data = f.target.result;
        FabricImage.fromURL(data).then((img) => {
          img.scaleToWidth(150);
          img.set({
            left: 50,
            top: 50,
          });
          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteActiveObject = () => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
    }
  };

  const getCustomizedProduct = () => {
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
    });
    
    return {
      ...(passedProduct || { _id: 'custom-tee', name: 'Custom Design T-Shirt', category: 'Custom', price: basePrice }),
      _id: (passedProduct ? passedProduct._id : 'custom-tee') + '-custom-' + Date.now(),
      baseProductId: passedProduct ? passedProduct._id : '1',
      price: basePrice + customPrintPrice,
      isCustomized: true,
      customImage: dataURL,
      image: displayImage,
      colorHex: passedColor ? passedColor.hex : null,
      colorName: passedColor ? passedColor.name : 'White',
      name: passedProduct ? `Custom ${passedProduct.name}` : 'Custom Design T-Shirt'
    };
  };

  const handleAddToCart = () => {
    if (!canvas) return;
    const customProduct = getCustomizedProduct();
    addToCart(customProduct, selectedSize, 1);
    toast.success('Custom design added to cart!', { icon: '🎨' });
  };

  const handleBuyNow = () => {
    if (!canvas) return;
    const customProduct = getCustomizedProduct();
    addToCart(customProduct, selectedSize, 1);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-white pt-6 pb-24">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Product
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-bold mb-6 tracking-widest uppercase">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Pro Design Studio
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 mb-4">Make It Yours</h1>
          <p className="text-slate-500 text-lg">Customize your {passedProduct ? passedProduct.name.toLowerCase() : 't-shirt'} with text and graphics.</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          
          {/* Left Toolbar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full lg:w-1/3 flex flex-col gap-6"
          >
            {/* Size Picker Card */}
            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                Select Size
              </h3>
              <div className="flex flex-wrap gap-4">
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 rounded-full transition-all border shadow-sm flex items-center justify-center font-bold text-lg ${
                      selectedSize === size ? 'ring-4 ring-slate-900 ring-offset-4 scale-110 border-transparent bg-slate-900 text-white' : 'ring-1 ring-transparent hover:ring-slate-300 border-slate-200 hover:scale-105 bg-white text-slate-900'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Tools Card */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="flex border-b border-slate-100 p-2 gap-2 bg-slate-50">
                <button 
                  className={`flex-1 py-4 text-sm font-bold transition-all rounded-xl relative ${activeTab === 'text' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:bg-slate-200/50'}`}
                  onClick={() => setActiveTab('text')}
                >
                  <span className="flex items-center justify-center gap-2"><Type className="w-4 h-4" /> Text</span>
                </button>
                <button 
                  className={`flex-1 py-4 text-sm font-bold transition-all rounded-xl relative ${activeTab === 'image' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:bg-slate-200/50'}`}
                  onClick={() => setActiveTab('image')}
                >
                  <span className="flex items-center justify-center gap-2"><ImageIcon className="w-4 h-4" /> Graphics</span>
                </button>
              </div>
              
              <div className="p-8">
                {activeTab === 'text' && (
                  <div className="space-y-6">
                    <button onClick={addText} className="w-full py-4 px-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 hover:bg-slate-800 hover:-translate-y-1 shadow-lg shadow-slate-900/20">
                      <Type className="w-5 h-5" />
                      Add Text Block
                    </button>
                    <p className="text-sm text-slate-500 text-center font-medium leading-relaxed">Double click added text on the shirt to edit contents.</p>
                  </div>
                )}

                {activeTab === 'image' && (
                  <div className="space-y-6">
                    <label className="w-full py-4 px-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 hover:bg-slate-800 hover:-translate-y-1 shadow-lg shadow-slate-900/20 cursor-pointer">
                      <ImageIcon className="w-5 h-5" />
                      Upload Graphic
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                    <p className="text-sm text-slate-500 text-center font-medium leading-relaxed">Supports PNG/JPG. Use transparent PNGs for best results.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Center Canvas Area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-1/3 flex justify-center items-center"
          >
            <div className="relative aspect-[4/5] w-full max-w-sm rounded-[2.5rem] overflow-hidden bg-slate-100 shadow-2xl shadow-slate-300/50 border-8 border-white group">
              {/* Product Background Image */}
              <img 
                src={displayImage} 
                alt="Product Canvas"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              
              {/* Color Overlay (keeps the color passed from product page) */}
              {passedColor && passedColor.name !== 'White' && (
                <div 
                  className="absolute inset-0 mix-blend-multiply opacity-60 pointer-events-none transition-colors duration-500"
                  style={{ backgroundColor: passedColor.hex }}
                />
              )}

              {/* Printable Area Box (Overlay) */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div 
                  className="border-2 border-dashed border-slate-400/50 rounded-xl group-hover:border-slate-900/50 transition-colors duration-300 relative bg-white/5 backdrop-blur-[1px]"
                  style={{ width: '280px', height: '380px' }}
                >
                  <canvas ref={canvasRef} className="absolute top-0 left-0" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Action Bar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full lg:w-1/3 space-y-6"
          >
            {/* Context Actions */}
            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Edit Tools</h3>
              
              {activeObj && activeObj.type === 'i-text' && (
                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-700 mb-3">Text Color</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={textColor}
                      onChange={(e) => changeTextColor(e.target.value)}
                      className="w-12 h-12 p-1 rounded-lg border border-slate-200 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-slate-500 uppercase">{textColor}</span>
                  </div>
                </div>
              )}

              <button onClick={deleteActiveObject} className="w-full py-4 px-4 bg-white hover:bg-red-50 text-red-600 font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors border-2 border-slate-200 hover:border-red-200 group">
                <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Remove Selected Item
              </button>
            </div>

            {/* Checkout Card */}
            <div className="bg-slate-900 rounded-[2rem] p-8 shadow-2xl shadow-slate-900/20 text-white relative overflow-hidden">
              
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 relative z-10">Order Summary</h3>
              
              <div className="space-y-4 mb-8 relative z-10">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-medium">Base Item</span>
                  <span className="font-bold">{formatPrice(basePrice)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-medium">Custom Prints</span>
                  <span className="font-bold">{formatPrice(customPrintPrice)}</span>
                </div>
                <div className="h-px bg-slate-800 my-4" />
                <div className="flex justify-between items-end">
                  <span className="text-slate-300 font-bold uppercase tracking-wider text-sm mb-1">Total</span>
                  <span className="font-extrabold text-4xl text-white tracking-tight">{formatPrice(basePrice + customPrintPrice)}</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 relative z-10 mt-4">
                <button onClick={handleAddToCart} className="w-full py-5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-extrabold rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 shadow-xl group hover:-translate-y-1 text-lg">
                  <ShoppingBag className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                  Add to Cart
                </button>
                <button onClick={handleBuyNow} className="w-full py-5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 shadow-xl group hover:-translate-y-1 text-lg">
                  Buy Now
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Customiser;
