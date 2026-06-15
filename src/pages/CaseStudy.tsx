import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ProjectDetail {
  id: string;
  title: string;
  category: string;
  year: string;
  industry: string;
  image: string;
  
  // High fidelity metadata for the editorial grid
  client: string;
  sector: string;
  country: string;
  director: string;
  scope: string;
  
  // Editorial storytelling
  editorialTitle: string;
  writeup: string;
  challenges?: string;
  solutions?: string;

  // Custom visual asset sections matching the exact combo grid layout
  assetLogo: string;
  bannerPhoto: string;
  splitLeft: string;
  splitRight: string;
  variations: string[];
  finalePhoto: string;
}

interface GridItem {
  type: 'image' | 'video';
  url: string;
  span: 'full' | 'half';
  alt: string;
}

function getIndustryImage(industry: string, keyIdx: number): string {
  const defaultImages = [
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1521791136368-1a46827d0136?auto=format&fit=crop&q=80&w=1200',
  ];
  const industryList = defaultImages;
  return industryList[keyIdx % industryList.length];
}

function getProjectGridItems(project: ProjectDetail, industry: string): GridItem[] {
  return [
    { type: 'video', url: 'https://res.cloudinary.com/df3zuhmkr/video/upload/v1737699496/01-PESA_mnlerx.mp4', span: 'full', alt: 'Brand identity intro' },
    { type: 'image', url: project.splitLeft, span: 'half', alt: 'Identity split detail left' },
    { type: 'image', url: project.splitRight, span: 'half', alt: 'Identity split detail right' },
    { type: 'video', url: 'https://video.gumlet.io/67b83d3533456fa6739b6c12/67d32bffefcecbdea74ca971/download.mp4', span: 'full', alt: 'Animation presentation loop' },
    { type: 'image', url: project.variations[0] || project.splitLeft, span: 'half', alt: 'Visual variant' },
    { type: 'image', url: project.variations[1] || project.splitRight, span: 'half', alt: 'Visual variant secondary' },
    { type: 'image', url: project.assetLogo, span: 'full', alt: 'Logo presentation' },
    { type: 'image', url: project.variations[2] || project.assetLogo, span: 'half', alt: 'Brand pattern display' },
    { type: 'image', url: getIndustryImage(industry, 0), span: 'half', alt: 'Industry photography one' },
    { type: 'image', url: getIndustryImage(industry, 1), span: 'half', alt: 'Industry photography two' },
    { type: 'video', url: 'https://cdn.prod.website-files.com/668458270cb55dcf37c69577%2F66e0d7965585f1e9aaabc31e_06-PESA-transcode.mp4', span: 'half', alt: 'Digital interface transcode' },
    { type: 'image', url: project.finalePhoto, span: 'full', alt: 'Finale exhibition layout' },
    { type: 'image', url: getIndustryImage(industry, 2), span: 'half', alt: 'Industry photography three' },
    { type: 'video', url: 'https://res.cloudinary.com/df3zuhmkr/video/upload/v1737699497/22-PESA_onyesi.mp4', span: 'half', alt: 'Digital interaction transition mechanics' },
    { type: 'video', url: 'https://video.gumlet.io/67b83d3533456fa6739b6c12/67d32bffcbc68914a33b1d39/download.mp4', span: 'half', alt: 'Branding asset motion' },
    { type: 'image', url: getIndustryImage(industry, 3), span: 'half', alt: 'Industry photography four' },
    { type: 'video', url: 'https://res.cloudinary.com/df3zuhmkr/video/upload/v1737699502/18-PESA_zf0zcc.mp4', span: 'full', alt: 'Comprehensive motion identity' },
    { type: 'image', url: getIndustryImage(industry, 4), span: 'half', alt: 'Industry photography five' },
    { type: 'video', url: 'https://res.cloudinary.com/df3zuhmkr/video/upload/v1737699493/10-PESA_cxlizt.mp4', span: 'half', alt: 'Motion poster design interaction' },
    { type: 'video', url: 'https://res.cloudinary.com/df3zuhmkr/video/upload/v1737699495/11-PESA_yje4av.mp4', span: 'half', alt: 'System dynamic detail screen' },
    { type: 'image', url: getIndustryImage(industry, 5), span: 'half', alt: 'Industry photography six' },
    { type: 'image', url: project.bannerPhoto, span: 'half', alt: 'Horizontal banner' },
    { type: 'image', url: project.image, span: 'half', alt: 'Conceptual photographic identity' }
  ];
}

export default function CaseStudy() {
  const { id } = useParams();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [nextProject, setNextProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectAndNext = async () => {
      setLoading(true);
      try {
        let currentProject: ProjectDetail | null = null;
        if (id) {
          const docSnap = await getDoc(doc(db, 'projects', id));
          if (docSnap.exists()) {
            const data = docSnap.data();
            currentProject = {
              id: docSnap.id,
              title: data.title || '', category: data.category || '', year: data.year || '',
              industry: data.industry || data.sector || 'Technology', image: data.image || '',
              client: data.client || data.title, sector: data.sector || '', country: data.country || data.location || '',
              director: data.director || '', scope: data.scope || '', editorialTitle: data.editorialTitle || data.title,
              writeup: data.writeup || '', challenges: data.challenges || '', solutions: data.solutions || '',
              assetLogo: data.assetLogo || data.image || '', bannerPhoto: data.bannerPhoto || data.image || '',
              splitLeft: data.splitLeft || data.image || '', splitRight: data.splitRight || data.image || '',
              variations: [data.variation1 || '', data.variation2 || '', data.variation3 || ''].filter(Boolean),
              finalePhoto: data.finalePhoto || data.image || ''
            };
            setProject(currentProject);
          }
        }

        // Fetch all projects to find the next one
        const q = query(collection(db, 'projects'), limit(40));
        const allProjectsSnap = await getDocs(q);
        const projects = allProjectsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProjectDetail));
        
        if (projects.length > 0) {
          const currentIndex = projects.findIndex(p => p.id === id);
          if (currentIndex !== -1 && currentIndex < projects.length - 1) {
            setNextProject(projects[currentIndex + 1]);
          } else {
            setNextProject(projects[0]); // Loop back to the first
          }
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectAndNext();
  }, [id]);

  if (loading) {
    return <div className="min-h-[100vh] bg-bg-dark text-bg-light flex items-center gap-4 text-xs font-mono uppercase justify-center opacity-50 tracking-widest">Constructing visual space...</div>;
  }

  if (!project) {
    return <div className="min-h-[100vh] bg-bg-dark text-bg-light flex items-center justify-center font-display text-2xl">Case study not found.</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-bg-dark pt-32 md:pt-40"
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-[80px]">
        {/* Top Showcase Banner mirroring the elegant Unsplash folder concept */}
        <div className="w-full aspect-[16/10] md:aspect-[21/9] overflow-hidden bg-bg-light/5 relative rounded-xl md:rounded-2xl">
          <img
            src={project.image}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-85"
          />
        </div>

        {/* Paragraph Section */}
        <div className="max-w-[800px] mx-auto pt-16 md:pt-24 pb-20 text-left">
          
          {project.writeup && (
            <div className="space-y-6 w-full text-[16px] md:text-[20px] text-bg-light/90 font-body font-normal leading-relaxed text-left mb-16">
              {project.writeup.split('\n').map((paragraph, index) => (
                paragraph.trim() ? (
                  <p key={index}>
                    {paragraph}
                  </p>
                ) : null
              ))}
            </div>
          )}

          {project.challenges && (
            <div className="mb-16">
              <h3 className="text-[13px] md:text-[15px] font-mono tracking-widest uppercase text-bg-light/50 mb-6 font-bold">The Challenge</h3>
              <div className="space-y-6 w-full text-[16px] md:text-[20px] text-bg-light/90 font-body font-normal leading-relaxed text-left">
                {project.challenges.split('\n').map((paragraph, index) => (
                  paragraph.trim() ? (
                    <p key={index}>
                      {paragraph}
                    </p>
                  ) : null
                ))}
              </div>
            </div>
          )}

          {project.solutions && (
            <div className="mb-16">
              <h3 className="text-[13px] md:text-[15px] font-mono tracking-widest uppercase text-bg-light/50 mb-6 font-bold">The Solution</h3>
              <div className="space-y-6 w-full text-[16px] md:text-[20px] text-bg-light/90 font-body font-normal leading-relaxed text-left">
                {project.solutions.split('\n').map((paragraph, index) => (
                  paragraph.trim() ? (
                    <p key={index}>
                      {paragraph}
                    </p>
                  ) : null
                ))}
              </div>
            </div>
          )}

        </div>

        {/* High-End Combo Grid: Replicating exactly the structure of https://fourthcanvas.co/portfolio/pesa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pb-32">
          {getProjectGridItems(project, project.industry || 'Technology').map((item, idx) => (
            <div
              key={idx}
              className={`relative overflow-hidden bg-bg-light/5 rounded-xl md:rounded-2xl group ${
                item.span === 'full' ? 'md:col-span-2' : 'md:col-span-1'
              }`}
            >
              <div className={`w-full relative ${
                item.span === 'full' ? 'aspect-[16/10] md:aspect-[21/9]' : 'aspect-[540/413]'
              }`}>
                {item.type === 'video' ? (
                  <video
                    src={item.url}
                    autoPlay
                    playsInline
                    loop
                    muted
                    preload="auto"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 brightness-95 group-hover:scale-[1.01]"
                  />
                ) : (
                  <img
                    src={item.url}
                    alt={item.alt}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out brightness-95 group-hover:scale-[1.01]"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Next Project elegant transition section */}
        {nextProject && (
          <div className="pt-20 border-t border-bg-light/10 pb-32 flex flex-col items-start justify-start">
            <Link
              to={`/work/${nextProject.id}`}
              className="group block w-full space-y-6 focus:outline-none"
            >
              {/* Header indicator / button with Arrow icon */}
              <div className="inline-flex items-center gap-3.5 font-mono text-[13px] md:text-[15.5px] tracking-widest text-bg-light/60 uppercase select-none transition-colors duration-300">
                <div className="w-[30px] h-[30px] rounded-full border border-bg-light/20 flex items-center justify-center text-bg-light/50 group-hover:border-bg-light/60 group-hover:text-bg-light transition-all duration-300">
                  <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform duration-300" />
                </div>
                <span className="font-semibold tracking-wider">NEXT ARCHIVE</span>
                <span className="text-bg-light/20 font-sans font-medium">&rarr;</span>
                <span className="text-bg-light font-body font-normal">
                  {nextProject.title}
                </span>
              </div>

              {/* Large Cover Image with beautiful rounded corners and elegant hover transition */}
              <div className="w-full aspect-[21/9] md:aspect-[21/8] overflow-hidden bg-bg-light/5 rounded-2xl md:rounded-3xl relative">
                <img
                  src={nextProject.image}
                  alt={`Next project cover showcase: ${nextProject.title}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-transparent group-hover:bg-bg-dark/5 transition-colors duration-500" />
              </div>
            </Link>
          </div>
        )}

      </div>
    </motion.div>
  );
}
