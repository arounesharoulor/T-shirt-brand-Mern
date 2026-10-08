import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Palette, Truck, ShieldCheck, Zap, ArrowRight, CheckCircle2, Star, Sparkles, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ALL_PRODUCTS } from '../data/products';

const Home = () => {
  const { user } = useAuth();
  
  // Mouse Parallax Setup
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth) * 2 - 1;
    const y = (clientY / innerHeight) * 2 - 1;
    mouseX.set(x);
    mouseY.set(y);
  };

  const bgX1 = useTransform(smoothX, [-1, 1], [-40, 40]);
  const bgY1 = useTransform(smoothY, [-1, 1], [-40, 40]);
  
  const bgX2 = useTransform(smoothX, [-1, 1], [60, -60]);
  const bgY2 = useTransform(smoothY, [-1, 1], [60, -60]);

  const img1X = useTransform(smoothX, [-1, 1], [-25, 25]);
  const img1Y = useTransform(smoothY, [-1, 1], [-25, 25]);
  const img1Rotate = useTransform(smoothX, [-1, 1], [-6, -2]);

  const img2X = useTransform(smoothX, [-1, 1], [35, -35]);
  const img2Y = useTransform(smoothY, [-1, 1], [35, -35]);
  const img2Rotate = useTransform(smoothX, [-1, 1], [4, 8]);

  const badgeX = useTransform(smoothX, [-1, 1], [15, -15]);
  const badgeY = useTransform(smoothY, [-1, 1], [15, -15]);

  // Animation Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const features = [
    {
      icon: <Palette className="w-8 h-8 text-primary" />,
      title: 'Limitless Creativity',
      desc: 'Use our advanced canvas to add text, images, and shapes. Your imagination is the only limit.'
    },
    {
      icon: <Zap className="w-8 h-8 text-accent" />,
      title: 'Premium Quality',
      desc: 'We use 100% organic cotton and state-of-the-art printing tech for vibrant, lasting colors.'
    },
    {
      icon: <Truck className="w-8 h-8 text-secondary" />,
      title: 'Fast Delivery',
      desc: 'Express shipping available worldwide. Get your custom tee delivered in days, not weeks.'
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />,
      title: 'Satisfaction Guaranteed',
      desc: 'Not happy with your print? We offer a hassle-free 30-day money-back guarantee.'
    }
  ];

  const steps = [
    { title: "Select a Base", desc: "Choose from our premium organic cotton tees." },
    { title: "Design It", desc: "Add text, upload graphics, or use our templates." },
    { title: "We Print It", desc: "High-quality, eco-friendly printing process." },
    { title: "Wear It", desc: "Delivered to your door in eco-friendly packaging." },
  ];

  const testimonials = [
    { name: "Sarah Jenkins", text: "The print quality is fantastic! The colors on my custom shirts look exactly like my design.", role: "Graphic Designer" },
    { name: "Michael Torres", text: "Very easy to use the customizer. I designed matching shirts for my entire team in under 10 minutes.", role: "Business Owner" },
    { name: "Emily Rodriguez", text: "Fast shipping and the t-shirt fabric is incredibly soft. This is easily my new favorite shirt.", role: "Customer" }
  ];

  return (
    <div className="flex flex-col bg-background selection:bg-slate-900 selection:text-white overflow-hidden">
      
      {/* 1. HERO SECTION - REDESIGNED */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#fafafa]"
        onMouseMove={handleMouseMove}
      >
        {/* Abstract Background Elements */}
        <motion.div 
          style={{ x: bgX1, y: bgY1 }}
          className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-blue-100 rounded-full blur-[150px] -z-10 translate-x-1/3 -translate-y-1/3 opacity-70" 
        />
        <motion.div 
          style={{ x: bgX2, y: bgY2 }}
          className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-pink-100 rounded-full blur-[120px] -z-10 -translate-x-1/3 translate-y-1/3 opacity-70" 
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center pt-24 pb-12">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center lg:text-left z-20"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-200 text-sm font-bold text-slate-800 mb-8 tracking-wide cursor-default hover:shadow-md transition-all"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles className="w-4 h-4 text-blue-600" /> 
              </motion.div>
              Premium Custom T-Shirts
            </motion.div>
            
            <h1 className="text-5xl sm:text-7xl font-display font-black leading-[1.05] mb-8 text-slate-900 tracking-tight">
              Design your <br className="hidden xl:block" />
              <motion.span 
                className="relative inline-block cursor-crosshair group"
                whileHover="hover"
              >
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">
                  custom t-shirt
                </span>
                <motion.svg 
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
                  className="absolute -bottom-3 left-0 w-full h-4 text-slate-200 group-hover:text-blue-200 transition-colors duration-300 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none"
                >
                  <motion.path 
                    variants={{ hover: { pathLength: [1, 0, 1], transition: { duration: 0.8, ease: "easeInOut" } } }}
                    d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round"
                  />
                </motion.svg>
              </motion.span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Create high-quality, custom-printed apparel with our easy-to-use design tools. Perfect for brands, teams, or personal style.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                to={user ? "/customiser" : "/register"} 
                className="group relative flex items-center justify-center gap-2 text-lg px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-slate-900/20 transition-all duration-300 hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {user ? "Start Designing Now" : "Create Account to Start"} 
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              
              <Link 
                to={user ? "/shop" : "/register"} 
                className="flex items-center justify-center text-lg px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl border-2 border-slate-200 hover:border-slate-900 transition-all duration-300 hover:-translate-y-1"
              >
                {user ? "Browse Collection" : "Explore Products"}
              </Link>
            </div>
            
            {!user && (
              <p className="mt-6 text-sm font-medium text-slate-500">
                Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Sign up for free</Link>
              </p>
            )}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            style={{ perspective: 1500 }}
            className="relative h-[600px] flex justify-center items-center w-full"
          >
            {/* Main high-end fashion image */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ x: img1X, y: img1Y, rotate: img1Rotate }}
              whileHover={{ scale: 1.1, rotateX: 15, rotateY: -15, zIndex: 50, boxShadow: "0px 30px 60px rgba(0,0,0,0.3)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute z-10 w-[280px] sm:w-[340px] aspect-[4/5] right-[10%] sm:right-[20%] top-[10%] cursor-crosshair"
            >
              <div className="w-full h-full rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white relative group">
                <img 
                  src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1600&auto=format&fit=crop" 
                  alt="Custom t-shirt" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
              </div>
            </motion.div>

            {/* Secondary image for depth */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ x: img2X, y: img2Y, rotate: img2Rotate }}
              whileHover={{ scale: 1.1, rotateX: -15, rotateY: 15, zIndex: 40, boxShadow: "0px 30px 60px rgba(0,0,0,0.3)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute z-0 w-[240px] sm:w-[280px] aspect-square left-[5%] sm:left-[10%] bottom-[15%] cursor-crosshair"
            >
              <div className="w-full h-full rounded-[2rem] overflow-hidden shadow-xl border-8 border-white relative group">
                <img 
                  src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1600&auto=format&fit=crop" 
                  alt="T-shirt rack" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </motion.div>
            
            {/* Floating Quality Badge */}
            <motion.div 
              style={{ x: badgeX, y: badgeY }}
              whileHover={{ scale: 1.15, rotateX: 10, rotateY: -10, zIndex: 60, boxShadow: "0px 20px 40px rgba(0,0,0,0.15)" }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="absolute bottom-1/4 right-0 lg:-right-4 bg-white/95 backdrop-blur-xl px-6 py-4 rounded-2xl flex items-center gap-4 z-30 shadow-2xl shadow-slate-900/10 border border-slate-100 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center">
                <CheckCircle2 className="text-white w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 tracking-tight">Premium Quality</span>
                <span className="text-sm font-medium text-slate-500">Apparel Blanks</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Why Choose Us?</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">We've obsessed over every detail to give you the best custom clothing experience on the planet.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, idx) => (
              <motion.div key={idx} variants={fadeUp} className="glass-panel p-8 group hover:-translate-y-3 transition-transform duration-300 bg-surface">
                <div className="mb-6 inline-flex p-4 rounded-2xl bg-white shadow-sm group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 text-base leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 2.5 TRENDING DESIGNS SECTION */}
      <section className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            >
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Trending Now</h2>
              <p className="text-slate-600 text-lg max-w-xl">Our most popular premium blanks, ready for your custom designs.</p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <Link to="/shop" className="hidden md:flex items-center gap-2 font-bold text-blue-600 hover:text-blue-700 transition-colors">
                View Collection <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>

          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {ALL_PRODUCTS.slice(0, 4).map((product) => (
              <motion.div key={product._id} variants={fadeUp} className="group bg-white p-4 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300">
                <Link to={`/product/${product._id}`} className="block relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-slate-100">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.isNew && (
                    <div className="absolute top-4 left-4 bg-white text-slate-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      NEW
                    </div>
                  )}
                </Link>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1 truncate">{product.name}</h3>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">{product.category}</span>
                    <span className="font-bold text-slate-900">${product.price.toFixed(2)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="mt-10 flex justify-center md:hidden">
            <Link to="/shop" className="flex items-center gap-2 font-bold text-blue-600 bg-blue-50 px-6 py-3 rounded-full hover:bg-blue-100 transition-colors">
              View Collection <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS - EDITORIAL & ANIMATED */}
      <section className="py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8"
          >
            <div>
              <h2 className="text-[3rem] md:text-[5rem] font-display font-black tracking-tighter uppercase leading-none">The Process</h2>
            </div>
            <p className="text-slate-400 text-lg max-w-md font-medium leading-relaxed">From raw concept to finished product in four seamless steps. We handle the complexity so you can focus on the art.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-4 relative">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: idx * 0.2, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -10 }}
                className="relative group cursor-crosshair border-l border-white/10 pl-8 pb-12"
              >
                <div className="absolute top-0 left-[-1px] w-px h-0 bg-white group-hover:h-full transition-all duration-700 ease-out" />
                <span className="text-7xl font-display font-black text-white/5 group-hover:text-white/20 transition-colors duration-500 block mb-6">
                  0{idx + 1}
                </span>
                <h3 className="text-2xl font-bold mb-4 tracking-tight">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TESTIMONIALS - MARQUEE / ANIMATED */}
      <section className="py-32 bg-[#F4F4F4] relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 mb-16 text-center">
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-[3rem] md:text-[5rem] font-display font-black text-slate-900 tracking-tighter uppercase leading-none mb-6"
          >
            Loved By Creators
          </motion.h2>
        </div>

        <div className="relative w-full overflow-hidden flex flex-col gap-6 py-4">
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-r from-[#F4F4F4] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-l from-[#F4F4F4] to-transparent z-10 pointer-events-none" />
          
          <motion.div 
            animate={{ x: [0, -2000] }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            className="flex gap-6 w-max"
          >
            {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map((test, idx) => (
              <div key={idx} className="w-[350px] md:w-[450px] bg-white p-10 border border-slate-200 hover:border-slate-900 transition-colors duration-500 group shadow-sm hover:shadow-xl">
                <div className="flex gap-1 mb-8">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-slate-900 text-slate-900" />)}
                </div>
                <p className="text-slate-900 text-lg font-medium mb-10 leading-relaxed">"{test.text}"</p>
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-slate-100 flex items-center justify-center text-slate-900 font-bold text-xl font-display uppercase group-hover:bg-slate-900 group-hover:text-white transition-colors duration-500">
                    {test.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs">{test.name}</h4>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mt-1.5">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900" />
        <div className="absolute inset-0 bg-hero-gradient opacity-20 mix-blend-overlay" />
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="max-w-4xl mx-auto px-4 relative z-10 text-center"
        >
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8">Ready to create your custom design?</h2>
          <p className="text-xl text-slate-300 mb-10">Get started with our premium custom clothing platform today.</p>
          <Link to="/customiser" className="inline-flex items-center justify-center px-10 py-5 bg-white text-slate-900 font-bold rounded-full text-lg transition-transform hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            Start Designing Now <ArrowRight className="ml-2 w-6 h-6" />
          </Link>
        </motion.div>
      </section>

    </div>
  );
};

export default Home;
