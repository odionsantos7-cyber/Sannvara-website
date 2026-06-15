import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface CTAButtonProps {
  children: ReactNode;
  onClick?: () => void;
  to?: string;
  className?: string;
  variant?: 'primary' | 'outline';
}

export default function CTAButton({ children, onClick, to, className = "", variant = 'primary' }: CTAButtonProps) {
  const isPrimary = variant === 'primary';
  
  const content = (
    <span className="relative flex items-center gap-4 z-10">
      <span>{children}</span>
      <motion.span
        variants={{
          hover: { x: 5 },
          tap: { x: 2 }
        }}
      >
        <ArrowRight className="w-5 h-5" />
      </motion.span>
    </span>
  );

  const backgroundEffects = null;

  const baseClasses = `
    relative group px-12 py-5 rounded-[12px] font-mono text-[18px] font-bold tracking-[0.05em] uppercase 
    flex items-center gap-4 transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.98]
    ${isPrimary ? 'bg-transparent border border-bg-light text-bg-light hover:bg-accent hover:border-accent hover:text-bg-dark' : 'border border-bg-light/20 text-bg-light hover:bg-accent hover:border-accent hover:text-bg-dark'}
    ${className}
  `;

  if (to) {
    return (
      <Link to={to} className="inline-block">
        <motion.div
          whileHover="hover"
          whileTap="tap"
          className={baseClasses}
        >
          {content}
        </motion.div>
      </Link>
    );
  }
  
  return (
    <motion.button
      onClick={onClick}
      whileHover="hover"
      whileTap="tap"
      className={baseClasses}
    >
      {content}
    </motion.button>
  );
}
