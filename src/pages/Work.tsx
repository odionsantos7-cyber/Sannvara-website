import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { SlidersHorizontal, ChevronDown, Check } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Project {
  id: string;
  title: string;
  category: string;
  discipline: string;
  sector: string;
  year: string;
  image: string;
  aspectRatio: string;
  span: 'full' | 'half';
  location: string;
}

const DISCIPLINES = ['All', 'Identity Architecture', 'Brand Strategy', 'Digital Systems'];
const SECTORS = ['All', 'Energy', 'Technology', 'Consumer', 'Finance', 'Corporate', 'Aerospace'];
const YEARS = ['All', '2024', '2023', '2022'];

export default function Work() {
  const [selectedDiscipline, setSelectedDiscipline] = useState('All');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [activeDropdown, setActiveDropdown] = useState<'sector' | 'year' | null>(null);
  const [firebaseProjects, setFirebaseProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Only keeping the latest 40 projects
    const q = query(collection(db, 'projects'), limit(40));
    const unsub = onSnapshot(q, (snapshot) => {
      const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      setFirebaseProjects(projects);
    });
    return () => unsub();
  }, []);

  const filteredProjects = firebaseProjects.filter((project) => {
    const termDiscipline = selectedDiscipline === 'All' || project.discipline === selectedDiscipline;
    const termSector = selectedSector === 'All' || project.sector === selectedSector;
    const termYear = selectedYear === 'All' || project.year === selectedYear;
    return termDiscipline && termSector && termYear;
  });

  const resetFilters = () => {
    setSelectedDiscipline('All');
    setSelectedSector('All');
    setSelectedYear('All');
  };

  const hasActiveFilters = selectedDiscipline !== 'All' || selectedSector !== 'All' || selectedYear !== 'All';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-36 md:pt-44 pb-32 bg-bg-dark"
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-[80px]">
        {/* Dynamic & Interactive Filter System (Pentagram-inspired) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 mb-16 relative z-30">
          
          {/* Primary horizontal navigation selector (Disciplines) */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 scroll-smooth">
            <span className="text-[10px] font-mono tracking-[0.15em] text-bg-light/30 uppercase mr-4 select-none shrink-0">
              Discipline:
            </span>
            {DISCIPLINES.map((discipline) => {
              const active = selectedDiscipline === discipline;
              return (
                <button
                  key={discipline}
                  id={`filter-discipline-${discipline.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setSelectedDiscipline(discipline)}
                  className={`px-4 py-2 rounded-full font-body text-[17px] md:text-[19px] font-normal tracking-wide transition-all duration-300 shrink-0 whitespace-nowrap ${
                    active
                      ? 'bg-bg-light text-bg-dark font-medium'
                      : 'text-bg-light/50 hover:text-bg-light hover:bg-bg-light/5'
                  }`}
                >
                  {discipline}
                </button>
              );
            })}
          </div>

          {/* Secondary filter controls (Sector, Year, Reset) */}
          <div className="flex items-center gap-4 flex-wrap">
            
            {/* Sector Dropdown */}
            <div className="relative">
              <button
                id="filter-sector-dropdown"
                onClick={() => setActiveDropdown(activeDropdown === 'sector' ? null : 'sector')}
                className={`flex items-center gap-2 px-4 py-2 border rounded-full font-body font-normal text-[17px] md:text-[19px] transition-all duration-300 ${
                  selectedSector !== 'All' 
                    ? 'border-accent text-accent bg-accent/5' 
                    : 'border-bg-light/10 text-bg-light/60 hover:text-bg-light hover:border-bg-light/30'
                }`}
              >
                <span>Sector: {selectedSector}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeDropdown === 'sector' ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {activeDropdown === 'sector' && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 lg:left-0 mt-2 w-56 bg-[#121212] border border-bg-light/10 rounded-lg shadow-2xl p-2 z-50 overflow-hidden"
                    >
                      {SECTORS.map((sector) => (
                        <button
                          key={sector}
                          id={`filter-sector-opt-${sector.toLowerCase()}`}
                          onClick={() => {
                            setSelectedSector(sector);
                            setActiveDropdown(null);
                          }}
                          className="flex items-center justify-between w-full text-left px-3 py-2 rounded font-body font-normal text-[17px] md:text-[18px] text-bg-light/70 hover:text-bg-light hover:bg-bg-light/5 transition-colors"
                        >
                          <span>{sector}</span>
                          {selectedSector === sector && <Check className="w-4 h-4 text-accent" />}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Year Dropdown */}
            <div className="relative">
              <button
                id="filter-year-dropdown"
                onClick={() => setActiveDropdown(activeDropdown === 'year' ? null : 'year')}
                className={`flex items-center gap-2 px-4 py-2 border rounded-full font-body font-normal text-[17px] md:text-[19px] transition-all duration-300 ${
                  selectedYear !== 'All' 
                    ? 'border-accent text-accent bg-accent/5' 
                    : 'border-bg-light/10 text-bg-light/60 hover:text-bg-light hover:border-bg-light/30'
                }`}
              >
                <span>Year: {selectedYear}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeDropdown === 'year' ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {activeDropdown === 'year' && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-40 bg-[#121212] border border-bg-light/10 rounded-lg shadow-2xl p-2 z-50 overflow-hidden"
                    >
                      {YEARS.map((year) => (
                        <button
                          key={year}
                          id={`filter-year-opt-${year}`}
                          onClick={() => {
                            setSelectedYear(year);
                            setActiveDropdown(null);
                          }}
                          className="flex items-center justify-between w-full text-left px-3 py-2 rounded font-body font-normal text-[17px] md:text-[18px] text-bg-light/70 hover:text-bg-light hover:bg-bg-light/5 transition-colors"
                        >
                          <span>{year}</span>
                          {selectedYear === year && <Check className="w-4 h-4 text-accent" />}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Reset button */}
            {hasActiveFilters && (
              <button
                id="filter-reset-button"
                onClick={resetFilters}
                className="px-4 py-2 font-mono text-[10px] tracking-widest text-[#C0C742] hover:text-bg-light uppercase transition-colors"
              >
                Reset Filters [✕]
              </button>
            )}

          </div>
        </div>

        {/* Dynamic Editorial Grid Layout (Pentagram Portfolio Style) */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20 relative z-10">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                layout
                id={`project-card-${project.id}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`group flex flex-col justify-between ${
                  project.span === 'full' ? 'md:col-span-2' : 'md:col-span-1'
                }`}
              >
                <Link to={`/work/${project.id}`} className="block overflow-hidden relative">
                  {/* Aspect Ratio Container */}
                  <div className={`w-full ${project.aspectRatio} relative overflow-hidden bg-bg-light/5 rounded-xl md:rounded-2xl`}>
                    <img
                      src={project.image}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
                    />
                  </div>

                  {/* Pentagram Caption Style - Beautiful spacing placed strictly underneath the photography */}
                  <div className="mt-5 flex flex-col sm:flex-row justify-between items-start gap-4 pt-4">
                    <div>
                      {/* Brand Title / Client Name */}
                      <h3 className="text-[20px] md:text-[24px] font-body font-normal text-bg-light tracking-tight leading-tight">
                        {project.title}
                      </h3>
                    </div>

                    <div className="sm:text-right mt-1 sm:mt-0 flex flex-col gap-1 items-start sm:items-end">
                      {/* Category and Service */}
                      <span className="text-[11px] font-mono tracking-wider font-bold text-accent uppercase">
                        {project.discipline}
                      </span>
                      {/* Year Indicator */}
                      <span className="text-[11px] font-mono tracking-widest text-bg-light/30">
                        {project.sector} · {project.year}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state handles filtration perfectly */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 border border-dashed border-bg-light/10 rounded"
          >
            <p className="text-bg-light/40 mb-4 font-mono uppercase tracking-widest text-[13px]">
              No work matching selected criteria
            </p>
            <button
              onClick={resetFilters}
              className="text-accent underline font-body text-[14px] hover:text-bg-light transition-colors"
            >
              Reset all filters
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
