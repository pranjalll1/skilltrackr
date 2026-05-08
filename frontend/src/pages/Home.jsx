import { Link } from 'react-router-dom';
import { Sparkles, Brain, Shield, Zap, ChevronRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative px-6 md:px-12 py-24 md:py-32 overflow-hidden flex-grow flex items-center justify-center">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-accent/30 bg-brand-primary/20 backdrop-blur-md mb-8">
            <Sparkles className="w-4 h-4 text-brand-secondary" />
            <span className="text-sm font-medium text-brand-secondary">Introducing Next-Gen AI Assessments</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Master the Future with <br />
            <span className="text-gradient">Intelligent Evaluation</span>
          </h1>
          
          <p className="text-lg md:text-xl text-brand-light/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            Savvy AI leverages advanced neural networks to provide dynamic, adaptive testing and insights for forward-thinking enterprises.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/register" className="flex items-center gap-2 bg-brand-accent hover:bg-opacity-90 text-brand-dark px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_25px_rgba(255,133,187,0.5)] hover:shadow-[0_0_35px_rgba(255,133,187,0.7)] hover:-translate-y-1">
              Start Free Trial <ChevronRight className="w-5 h-5" />
            </Link>
            <Link to="/features" className="px-8 py-4 rounded-full font-bold text-lg text-brand-light hover:text-brand-secondary border border-brand-light/20 hover:border-brand-secondary/50 transition-all backdrop-blur-sm">
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 md:px-12 bg-brand-dark relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Designed for <span className="text-gradient">Excellence</span></h2>
            <p className="text-brand-light/70 max-w-2xl mx-auto">Experience a platform built with precision, speed, and uncompromising security at its core.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Brain, title: "Adaptive AI Engine", desc: "Our models dynamically adjust test difficulty based on real-time performance metrics." },
              { icon: Zap, title: "Lightning Fast", desc: "Experience zero latency with our optimized, globally distributed edge network architecture." },
              { icon: Shield, title: "Enterprise Security", desc: "Bank-grade encryption and strict compliance ensure your data is always protected." }
            ].map((feature, idx) => (
              <div key={idx} className="glass-card p-8 group hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 rounded-2xl bg-brand-primary/50 flex items-center justify-center mb-6 border border-brand-accent/20 group-hover:border-brand-accent/60 transition-colors">
                  <feature.icon className="w-7 h-7 text-brand-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-brand-light/70 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
