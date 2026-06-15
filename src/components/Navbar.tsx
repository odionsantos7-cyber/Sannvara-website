import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import SannvaraLogo from './Common/SannvaraLogo';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Archives', path: '/work' },
    { name: 'Philosophy', path: '/process' },
    { name: 'Team', path: '/studio' },
    { name: 'The Gather', path: '/gather' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
        scrolled ? 'bg-bg-dark/95 backdrop-blur-xl py-4' : 'bg-transparent py-[26px]'
      }`}
    >
      <div className="w-full px-6 md:px-12 xl:px-16 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center"
        >
          <SannvaraLogo className="h-[12px] md:h-[14px] w-auto text-bg-light hover:text-accent transition-colors duration-300" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-[40px] ml-auto">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="relative text-[14px] font-mono font-normal tracking-wide text-bg-light/60 hover:text-bg-light transition-colors group"
            >
              {link.name}
            </Link>
          ))}
          
          <Link
            to="/contact"
            className="px-6 py-2.5 bg-transparent border border-bg-light text-bg-light rounded-[12px] text-[14px] font-mono font-normal tracking-wide flex items-center gap-2 hover:bg-accent hover:border-accent hover:text-bg-dark hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 ml-2"
          >
            <span>Initiate A Call</span>
            <span className="text-[14px] leading-none select-none font-normal">&rarr;</span>
          </Link>
        </div>

        {/* Mobile Hamburger stays for small screens but we'll hide it for desktop-perfect replicate focus */}
        <button 
          className="md:hidden flex flex-col gap-1.5 z-[101]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <motion.span 
            animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 8 : 0 }}
            className="w-6 h-[1.5px] bg-bg-light block"
          />
          <motion.span 
            animate={{ opacity: mobileMenuOpen ? 0 : 1 }}
            className="w-6 h-[1.5px] bg-bg-light block"
          />
          <motion.span 
            animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -8 : 0 }}
            className="w-6 h-[1.5px] bg-bg-light block"
          />
        </button>

        {/* Mobile Menu Overlay */}
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: mobileMenuOpen ? 1 : 0, x: mobileMenuOpen ? '0%' : '100%' }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed inset-0 bg-bg-dark z-[100] flex flex-col p-10 pt-32"
        >
          <div className="flex flex-col gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="font-mono text-[40px] text-bg-light"
              >
                {link.name}
              </Link>
            ))}
             <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="font-mono text-[40px] text-bg-light hover:text-accent"
              >
                Contact
              </Link>
          </div>
          
          <div className="mt-auto pb-10">
            <p className="text-bg-light text-[11px] font-mono font-medium tracking-widest mb-4">Get In Touch</p>
            <a href="mailto:workwithsannvara@gmail.com" className="font-mono text-[24px] text-bg-light hover:text-accent transition-colors block">
              workwithsannvara@gmail.com
            </a>
            <p className="text-bg-light/40 text-[14px] mt-2">Lagos, Nigeria</p>
          </div>
        </motion.div>
      </div>
    </nav>
  );
}
