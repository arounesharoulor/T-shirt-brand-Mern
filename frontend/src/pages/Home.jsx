import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Palette, Truck, ShieldCheck, Zap, ArrowRight, CheckCircle2, Star, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  
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
    { name: "Sarah J.", text: "The print quality is unbelievable! The colors pop just like they did on my screen.", role: "Graphic Designer" },
    { name: "Mike T.", text: "Super easy to use the customizer. I made matching shirts for my entire team in 10 minutes.", role: "Startup Founder" },
    { name: "Emily R.", text: "Fastest shipping ever. The fabric is so soft, it's easily my new favorite shirt.", role: "Fashion Blogger" }
  ];

  return (
    <div className="flex flex-col bg-background selection:bg-slate-900 selection:text-white overflow-hidden">
      
      {/* 1. HERO SECTION - REDESIGNED */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#fafafa]">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-blue-100 rounded-full blur-[150px] -z-10 translate-x-1/3 -translate-y-1/3 opacity-70" />
        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-pink-100 rounded-full blur-[120px] -z-10 -translate-x-1/3 translate-y-1/3 opacity-70" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center pt-24 pb-12">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center lg:text-left z-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-200 text-sm font-bold text-slate-800 mb-8 tracking-wide">
              <Sparkles className="w-4 h-4 text-blue-600" /> 
              Next-Gen Fashion Studio
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-display font-black leading-[1.05] mb-8 text-slate-900 tracking-tight">
              Ready to wear your <br className="hidden xl:block" />
              <span className="relative">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  masterpiece?
                </span>
                <svg className="absolute -bottom-3 left-0 w-full h-4 text-blue-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Join thousands of creators who have already brought their ideas to life. Premium blanks, vibrant prints, zero compromises.
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
                {user ? "Browse Collection" : "Explore Studio"}
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
            className="relative h-[600px] flex justify-center items-center w-full"
          >
            {/* Main high-end fashion image */}
            <motion.div
              initial={{ opacity: 0, y: 40, rotate: -4 }}
              animate={{ opacity: 1, y: 0, rotate: -4 }}
              transition={{ duration: 1, delay: 0.4, type: "spring" }}
              className="absolute z-10 w-[280px] sm:w-[340px] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white right-[10%] sm:right-[20%] top-[10%]"
            >
              <img 
                src="https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=1600&auto=format&fit=crop" 
                alt="Streetwear model" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10" />
            </motion.div>

            {/* Secondary image for depth */}
            <motion.div
              initial={{ opacity: 0, y: 60, rotate: 6 }}
              animate={{ opacity: 1, y: 0, rotate: 6 }}
              transition={{ duration: 1, delay: 0.6, type: "spring" }}
              className="absolute z-0 w-[240px] sm:w-[280px] aspect-square rounded-[2rem] overflow-hidden shadow-xl border-8 border-white left-[5%] sm:left-[10%] bottom-[15%]"
            >
              <img 
                src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1600&auto=format&fit=crop" 
                alt="Fabric detail" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {/* Floating Quality Badge */}
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-1/4 right-0 lg:-right-4 bg-white/95 backdrop-blur-xl px-6 py-4 rounded-2xl flex items-center gap-4 z-30 shadow-2xl shadow-slate-900/10 border border-slate-100"
            >
              <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center">
                <CheckCircle2 className="text-white w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 tracking-tight">Studio Grade</span>
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

      {/* 3. HOW IT WORKS */}
      <section className="py-24 bg-slate-50 relative border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">How It Works</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">From concept to delivery in 4 simple steps.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-4 gap-12 relative"
          >
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-full" />
            
            {steps.map((step, idx) => (
              <motion.div key={idx} variants={fadeUp} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-white shadow-xl border-4 border-slate-50 flex items-center justify-center text-3xl font-extrabold text-primary mb-8 relative">
                  {idx + 1}
                  <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-ping" style={{ animationDuration: '3s' }}/>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. TESTIMONIALS */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Loved by Creators</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">Don't just take our word for it. Hear from our community.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((test, idx) => (
              <motion.div key={idx} variants={fadeUp} className="bg-surfaceHighlight rounded-3xl p-10 border border-slate-100 shadow-sm relative">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-accent text-accent" />)}
                </div>
                <p className="text-slate-700 text-lg italic mb-8">"{test.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
                    {test.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{test.name}</h4>
                    <p className="text-sm text-slate-500">{test.role}</p>
                  </div>
                </div>
              </motion.div>
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
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8">Ready to wear your masterpiece?</h2>
          <p className="text-xl text-slate-300 mb-10">Join thousands of creators who have already brought their ideas to life.</p>
          <Link to="/customiser" className="inline-flex items-center justify-center px-10 py-5 bg-white text-slate-900 font-bold rounded-full text-lg transition-transform hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            Start Designing Now <ArrowRight className="ml-2 w-6 h-6" />
          </Link>
        </motion.div>
      </section>

    </div>
  );
};

export default Home;
