import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send inquiry');
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', company: '', message: '' });
      
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-40 pb-20 bg-bg-dark"
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-[80px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-12">
            <header className="space-y-6">
              <h1 className="text-[64px] md:text-[80px] leading-[1.1] tracking-tight text-bg-light">
                Start with<br />
                a conversation<span className="text-accent">.</span>
              </h1>
            </header>

            <div className="space-y-8 text-[17px] text-bg-light/50 leading-relaxed max-w-[420px] font-body">
              <p>
                The brands and experiences we've built started exactly where you are now. Our team is active and we respond within 24 hours. Your first step is a 30-minute discovery call for clarity.
              </p>
            </div>

            <div className="space-y-6 pt-8">
              <div className="space-y-1">
                <p className="text-bg-light/30 text-[11px] font-body font-medium uppercase tracking-widest">Email</p>
                <a href="mailto:workwithsannvara@gmail.com" className="text-[22px] md:text-[24px] font-display text-bg-light hover:text-accent hover:underline underline-offset-8 transition-all">
                  workwithsannvara@gmail.com
                </a>
              </div>
              <div className="space-y-1 pt-4">
                <p className="text-bg-light/30 text-[11px] font-body font-medium uppercase tracking-widest">Location</p>
                <p className="text-[14px] text-bg-light/60 font-body">Lagos, Nigeria</p>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-6 lg:offset-1">
            <form className="space-y-10" onSubmit={handleSubmit}>
              <div className="space-y-3">
                <label className="text-bg-light text-[11px] font-body font-medium uppercase tracking-widest">Your Name</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter name"
                  className="w-full bg-transparent border-b border-bg-light/20 py-4 text-bg-light placeholder:text-bg-light/20 focus:border-accent transition-colors outline-none font-body text-[16px]"
                />
              </div>

              <div className="space-y-3">
                <label className="text-bg-light text-[11px] font-body font-medium uppercase tracking-widest">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="w-full bg-transparent border-b border-bg-light/20 py-4 text-bg-light placeholder:text-bg-light/20 focus:border-accent transition-colors outline-none font-body text-[16px]"
                />
              </div>

              <div className="space-y-3">
                <label className="text-bg-light text-[11px] font-body font-medium uppercase tracking-widest">Company / Project</label>
                <input 
                  type="text" 
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Company name"
                  className="w-full bg-transparent border-b border-bg-light/20 py-4 text-bg-light placeholder:text-bg-light/20 focus:border-accent transition-colors outline-none font-body text-[16px]"
                />
              </div>

              <div className="space-y-3">
                <label className="text-bg-light text-[11px] font-body font-medium uppercase tracking-widest">Tell us about your project</label>
                <textarea 
                  rows={4}
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your vision"
                  className="w-full bg-transparent border-b border-bg-light/20 py-4 text-bg-light placeholder:text-bg-light/20 focus:border-accent transition-colors outline-none font-body text-[16px] resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className={`group w-full h-16 border font-mono font-bold tracking-wider flex items-center justify-center gap-3 transition-all duration-300 rounded-[12px] outline-none ${
                  isSubmitted 
                  ? 'bg-accent border-accent text-bg-dark font-bold' 
                  : isSubmitting 
                  ? 'bg-transparent border-bg-light/30 text-bg-light/50 cursor-not-allowed'
                  : 'bg-transparent border-bg-light text-bg-light hover:bg-bg-light hover:text-bg-dark hover:scale-[1.01] active:scale-[0.99]'
                }`}
              >
                {isSubmitted ? (
                  <>
                    email sent <CheckCircle2 className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    send inquiry
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
