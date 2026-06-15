import { motion } from 'motion/react';

export default function ClientStrip() {
  const clients = ['INVEX', 'OBSIDIAN', 'CRĒDO', 'LUMINA', 'KINETIC', 'AXION'];

  // Duplicate the list of brands to form two identical sets side by side for a seamless loop
  const marqueeItems = [...clients, ...clients];

  return (
    <section className="bg-bg-light/[0.01] py-10 overflow-hidden relative w-full">
      {/* Vignette fade layers for a premium high-end hardware/editorial aesthetic */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bg-dark to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-bg-dark to-transparent z-10 pointer-events-none" />

      <div className="w-full relative flex overflow-hidden">
        <motion.div
          className="flex gap-20 md:gap-32 items-center whitespace-nowrap min-w-full uppercase"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            ease: 'linear',
            duration: 6,
            repeat: Infinity,
          }}
        >
          {marqueeItems.map((client, idx) => (
            <span
              key={`${client}-${idx}`}
              className="font-body text-[22px] md:text-[28px] tracking-[0.16em] font-normal text-bg-light/30 cursor-default flex items-center gap-1.5 shrink-0"
            >
              {client}
              {/* Elegant dot separators to give a premium brand scroller feel */}
              <span className="text-[12px] text-accent/20 font-mono ml-20 md:ml-32 select-none">•</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

