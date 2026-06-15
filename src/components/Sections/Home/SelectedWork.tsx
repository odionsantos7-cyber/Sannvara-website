import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot, query, limit } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

export default function SelectedWork() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'projects'), limit(4));
    const unsub = onSnapshot(q, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  if (projects.length === 0) return null;

  return (
    <section className="bg-bg-dark pt-[120px] pb-20">
      <div className="max-w-[1440px] mx-auto px-5 md:px-[80px]">
        {/* Work Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-12">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              className={`group flex flex-col gap-4 md:gap-5 cursor-pointer ${project.span === 'full' ? 'md:col-span-2' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Link to={`/work/${project.id}`} className="block w-full">
                <div className={`relative overflow-hidden rounded-xl md:rounded-2xl ${project.span === 'full' ? 'aspect-[16/7]' : 'aspect-[4/5]'}`}>
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-bg-dark/5" />
                </div>
                
                <div className="mt-4 md:mt-5 flex justify-between items-start w-full">
                  <h3 className="text-bg-light text-[22px] md:text-[26px] leading-tight font-body font-normal">
                    {project.title}
                  </h3>
                  <div className="flex flex-col items-end gap-1.5 text-right">
                    <p className="text-accent text-[10px] md:text-[11px] font-mono font-bold tracking-[0.14em] uppercase whitespace-nowrap">
                      {project.discipline}
                    </p>
                    <p className="text-bg-light/40 text-[12px] md:text-[13px] font-mono tracking-wide">
                      {project.sector} &middot; {project.year}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
