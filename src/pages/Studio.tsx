import { motion } from 'motion/react';
import TypewriterText from '../components/Common/TypewriterText';

export default function Studio() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-40 pb-20 bg-bg-dark"
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-[80px]">
        <div className="max-w-[900px] space-y-12 animate-fade-in">
          <header className="space-y-6">
            <h1 className="text-[42px] sm:text-[54px] md:text-[72px] lg:text-[80px] leading-[1.1] tracking-tight text-bg-light lg:max-w-none whitespace-pre-line">
              <TypewriterText text={`At Sannvara,\nevery of our processes is\nheavily guided by strategy\nand precise intentionality`} />
            </h1>
          </header>

          <div className="space-y-8 text-[18px] text-bg-light/55 leading-relaxed max-w-[760px] font-body">
            <p>
              Sannvara is a African brand design and consultancy studio built on a single, ancient principle that the most powerful thing a brand can do is not add more, but protect what is essential. We are not opposed to beauty. We are opposed to noise wearing the mask of beauty. We believe a brand is not a visual exercise. It is a structural decision. Every mark, every word, every colour exists because it was chosen with precision not because it looked good in the moment, but because it holds the positioning for years to come.
            </p>
            <p>
              We understand that architecture endures. Our practice is deliberately focused and deliberately deep. We carry the strategic rigour of a global consultancy and the craft obsession of an independent studio. The Sannvara Guardians are a collective of independent strategists, designers, and engineers assembled per brief; each operating under one shared standard of precision, each bringing specialised depth rather than generalist convenience. Since our founding, sannvara. has partnered with ambitious founders and businesses who understand that brand is infrastructure.
            </p>
            <p>
              Our work spans brand strategy and positioning, visual identity and logo engineering, brand narrative and verbal systems, motion identity, digital environments, brand auditing, and brand governance. We operate across the full spectrum of brand design and architecture, from the first strategic discovery session to the governed living system we leave behind.
            </p>
            <p>
              We are rooted in Lagos. We think in global standards. The African creative economy is not emerging; it has always been here, thinking at this level. Sannvara exists as proof of that. We work with those who understand that clarity does not arrive by accident but was uncovered through discipline, restraint, and the courage to remove everything that does not belong.
            </p>
          </div>
        </div>

        <section id="studio-disciplines-section" className="mt-32 pt-20">
          <div className="mb-14">
            <span className="inline-block border border-bg-light/12 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-bg-light/60 rounded-[3px] select-none hover:text-accent hover:border-accent/40 transition-colors duration-300">
              Disciplines
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-16 gap-x-12 lg:gap-x-16">
            {DISCIPLINES_DATA.map((discipline, idx) => (
              <motion.div 
                key={discipline.category}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="space-y-6 group"
              >
                <h3 className="font-display text-[20px] md:text-[22px] leading-[1.2] text-bg-light tracking-tight pb-4">
                  <span className="font-semibold">{discipline.category}</span>
                </h3>
                <ul className="space-y-4 font-body text-[15px] md:text-[16px] text-bg-light/75 leading-relaxed">
                  {discipline.items.map((item) => (
                    <li key={item} className="cursor-default font-normal">
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Dynamic Editorial Team Grid Layout (Pentagram Partners Style) */}
        <section id="studio-team-section" className="mt-36 pt-24">
          <div className="mb-20">
            <h2 className="text-[36px] md:text-[54px] font-display text-bg-light tracking-tight leading-[1.1]">
              Guardians<span className="text-accent">.</span>
            </h2>
            <div className="text-bg-light/50 font-body text-[16px] md:text-[18px] max-w-[800px] mt-6 space-y-4 leading-relaxed">
              <p>
                Sannvara is a structured network of independent specialists — strategists, designers, motion designers, copywriters, and developers — who operate under one shared standard of precision and are assembled per brief depending on what each project demands.
              </p>
              <p>
                The Guardians are the custodians of that standard. They lead projects, direct operations, and hold responsibility for every channel through which Sannvara's discipline and culture are expressed and protected.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 gap-y-12">
            {TEAM_MEMBERS.map((member) => (
              <div key={member.id} className="group flex flex-col" id={`team-member-${member.id}`}>
                {/* Image Container with precise aspect-ratio matching the user's provided design */}
                <div className="w-full aspect-[2/3] overflow-hidden bg-bg-light/5 relative rounded-xl">
                  <img
                    src={member.image}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    style={member.objectPosition ? { objectPosition: member.objectPosition } : {}}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                {/* Labeling spaced tightly and elegantly underneath */}
                <div className="mt-4">
                  <h3 className="text-[17px] md:text-[19px] font-display text-bg-light font-medium tracking-tight duration-300 transition-colors group-hover:text-accent">
                    {member.name}
                  </h3>
                  <p className="text-[12px] font-mono tracking-wider text-bg-light/40 mt-1">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}

const DISCIPLINES_DATA = [
  {
    category: 'Identity Architecture',
    items: [
      'Brand Discovery & Diagnosis',
      'Competitive Landscape Analysis',
      'Positioning Strategy',
      'Brand Personality & Voice',
      'Naming & Verbal Identity',
      'Brand Narrative Development'
    ]
  },
  {
    category: 'Visual Systems',
    items: [
      'Logo & Mark Engineering',
      'Visual Identity Design',
      'Typography & Colour Architecture',
      'Brand Pattern & Asset Design',
      'Motion Identity Development',
      'Brand Document Design'
    ]
  },
  {
    category: 'Digital Environments',
    items: [
      'Website Design & Development',
      'UI/UX Design',
      'Social Media Identity Systems',
      'Brand Collateral Design',
      'Brand Guidelines & Governance',
      'Brand Audit & Remediation'
    ]
  }
];

interface TeamMember {
  id: string;
  name: string;
  role: string;
  location: string;
  image: string;
  objectPosition?: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Oghedegbe Eromosele',
    role: 'Director of Art & Strategy',
    location: 'Lagos',
    image: '/oghedegbe.jpg',
    objectPosition: 'center top'
  },
  {
    id: '2',
    name: 'Idonin Eseosa',
    role: 'Head of Culture & Operations',
    location: 'Lagos',
    image: '/idonin.jpg',
    objectPosition: 'center top'
  },
  {
    id: '3',
    name: 'Lamptey Okunnifo',
    role: 'Director of Design Systems',
    location: 'Tokyo',
    image: '/lamptey.jpg',
    objectPosition: 'center top'
  },
  {
    id: '4',
    name: 'Omoyemen Omoh',
    role: 'Head of Marketing and Finance',
    location: 'London',
    image: '/omoyemen.jpg',
    objectPosition: 'center top'
  }
];
