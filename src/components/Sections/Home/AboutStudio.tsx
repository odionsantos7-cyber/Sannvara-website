import { motion } from 'motion/react';

export default function AboutStudio() {
  return (
    <section className="bg-bg-dark pt-[120px] pb-[120px]">
      <div className="max-w-[1440px] mx-auto px-5 md:px-[80px]">
        <div className="flex flex-col items-center text-center max-w-[800px] mx-auto space-y-10">
          <div className="space-y-6">
            <h2 className="text-[42px] md:text-[54px] leading-[1.15] text-bg-light font-display tracking-tight">
              Building strong brand fortresses that stand their cause
            </h2>
          </div>
          
          <div className="space-y-6 text-[17px] md:text-[19px] text-bg-light/55 leading-relaxed max-w-[760px] font-body">
            <p>
              Sannvara. is a multi-disciplinary brand design and consultancy agency based in the city of Lagos, Nigeria.
            </p>
            <p>
              Our discipline spans through brand strategy and positioning, visual identity and logo engineering, brand narrative and verbal systems, motion identity, digital environments and web design, brand auditing, and brand governance. Every of these operations are made possible by our 'Guardians', who are a collective of creatives and design engineers assembled based on the required projects and operate under one shared standard of precision.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
