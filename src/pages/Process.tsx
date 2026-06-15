import { motion } from 'motion/react';
import TypewriterText from '../components/Common/TypewriterText';

export default function Process() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-40 pb-28 bg-bg-dark"
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-[80px]">
        {/* Editorial Story Layout */}
        <div className="max-w-[820px] mx-auto space-y-12 pt-10">
          
          {/* Sannvara Studio Frame (4500 x 3000 aspect-ratio empty container) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
            className="w-full aspect-[3/2] overflow-hidden bg-white/[0.02] rounded-xl md:rounded-2xl shadow-2xl border border-white/10 relative flex items-center justify-center select-none"
          >
            {/* Minimal Subtle Grid Overlay to indicate a placeholder / canvas area */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

            {/* Corner Alignment Guides */}
            <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t border-l border-white/25" />
            <div className="absolute top-4 right-4 w-3.5 h-3.5 border-t border-r border-white/25" />
            <div className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b border-l border-white/25" />
            <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b border-r border-white/25" />

            {/* Empty Canvas Label */}
            <div className="text-center space-y-1 z-10">
              <span className="text-[10px] md:text-xs uppercase font-mono tracking-[0.35em] text-white/40 block">
                4500 × 3000 Frame
              </span>
              <span className="text-[9px] font-mono tracking-[0.2em] text-[#C0C742]/50 block">
                Sannvara Studio
              </span>
            </div>
          </motion.div>

          {/* Main Conviction Statement */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="pb-12 mb-12"
          >
            <p className="text-[22px] md:text-[28px] font-light leading-relaxed text-bg-light tracking-tight font-body">
              At Sannvara, we centralize our operations on the belief that the brands that survive time's test are those who filter the noise and build upon the core of their essence.
            </p>
          </motion.div>

          <div className="space-y-8 font-body text-[16px] md:text-[18px] text-bg-light/75 leading-[1.75]">
            
            {/* Paragraph 1 */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Positioning as a global force, Sannvara is an interesting story which started in the African region inspired by the never ending beauty of the savannahs. Our philosophy is inherited from the ancient Sanskrit school <span className="font-semibold text-accent font-display">'samvara'</span> (Purification of the soul by filtration of impurities). Thousands of years ago, ancient thinkers sat with a question that was less about business and more about the nature of existence itself: <span className="text-bg-light font-display">what happens when a thing loses its essential quality?</span> What happens when the soul, or a self, or an idea is buried under layers of accumulated, unconsidered experience?
            </motion.p>

            {/* Paragraph 2 - Styled text block without left border */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="py-4 my-6 text-[18px] md:text-[20px] text-bg-light/85 max-w-[760px]"
            >
              They called that accumulation <span className="font-semibold font-display text-accent">'āsrava'</span> (The inflow). The slow drift of karmic matter that clouds what is naturally radiant. Restraint. Containment. The deliberate, disciplined act of 'closing the channels' of deciding, with full intention, what is allowed in. Not as limitation. As protection. As the act that finally allows the truest thing to come forward and be seen.
            </motion.div>

            {/* Paragraph 3 */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              We ask the harder questions. We look for the thing that was always true about you — the quality that was present on the first day, in the founding impulse, in the reason someone cared enough to begin. And then we build the structures that protect, contain and make it unmistakable. At Sannvara, design is not decoration. It is architecture. It is the building of perceptual walls — careful, intentional structures that define what a brand is and, just as importantly, what it is not.
            </motion.p>

            {/* Paragraph 4 */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              We guard tone and visual territory. We guard the feeling that lives in the space between what is seen and what is understood. Because a brand that cannot hold its ground is not a brand.
            </motion.p>

          </div>

        </div>
      </div>
    </motion.div>
  );
}
