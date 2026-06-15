import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Hero from '../components/Sections/Home/Hero';
import SelectedWork from '../components/Sections/Home/SelectedWork';
import ProcessSection from '../components/Sections/Home/ProcessSection';
import AboutStudio from '../components/Sections/Home/AboutStudio';
import ClientStrip from '../components/Sections/Home/ClientStrip';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Hero />
      <SelectedWork />
      <ProcessSection />
      <AboutStudio />
      <ClientStrip />
    </motion.div>
  );
}
