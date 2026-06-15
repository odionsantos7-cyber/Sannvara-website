import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProcessSection() {
  return (
    <section className="bg-bg-dark text-bg-light py-[120px]">
      <div className="max-w-[1440px] mx-auto px-5 md:px-[80px]">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <span className="text-accent text-[12px] uppercase tracking-widest font-mono">From The Gather</span>
            <h2 className="text-[32px] md:text-[48px] leading-[1.1] font-display">
              Latest Insight
            </h2>
          </div>
          <Link to="/gather" className="group flex items-center gap-4 text-[14px] tracking-widest transition-all duration-300 px-6 py-2.5 border border-bg-light/20 rounded-[12px] font-mono hover:bg-accent hover:border-accent hover:text-bg-dark">
            The Gather
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Featured Article */}
        <Link to="/gather" className="group block">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-7 overflow-hidden">
              <motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200"
                alt="Building an authentic brand in the age of AI"
                className="w-full aspect-[4/3] object-cover"
              />
            </div>

            <div className="lg:col-span-5 space-y-8">
              <div className="flex items-center gap-4 text-[12px] font-mono text-bg-light/60 uppercase tracking-widest">
                <span>Essay</span>
                <span>•</span>
                <span>8 Min Read</span>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-[28px] md:text-[36px] leading-[1.2] font-display group-hover:text-accent transition-colors">
                  Building an authentic brand in the age of AI
                </h3>
                <p className="text-[16px] text-bg-light/80 leading-relaxed max-w-lg">
                  An exploration of why human-centered depth, strategic intentionality, and deliberate craft are more critical than ever in an era saturated with synthetic generation.
                </p>
              </div>

              <div className="inline-flex items-center gap-4 border-b border-bg-light/20 pb-2 group-hover:border-accent transition-colors mt-4">
                <span className="text-[14px] uppercase tracking-widest group-hover:text-accent transition-colors">Read Article</span>
              </div>
            </div>

          </div>
        </Link>

      </div>
    </section>
  );
}
