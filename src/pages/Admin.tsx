import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, loginWithGoogle, logout, db, storage } from '../lib/firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const ImageUpload = ({ label, value, onChange }: { label: string, value: string, onChange: (url: string) => void }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(prog);
      },
      (error) => {
        console.error('Upload error:', error);
        setUploading(false);
        alert('File upload failed. Ensure you have proper permissions.');
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setUploading(false);
        setProgress(0);
        onChange(downloadURL);
      }
    );
  };

  return (
    <div className="w-full py-2 border-b border-bg-dark/20">
      <label className="block text-xs uppercase opacity-50 mb-2">{label}</label>
      {value ? (
        <div className="flex items-center gap-4">
          <img src={value} alt="Preview" className="h-12 w-12 object-cover bg-black/10" />
          <button type="button" onClick={() => onChange('')} className="text-xs uppercase hover:underline">Remove</button>
        </div>
      ) : (
        <div>
          <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:uppercase file:bg-bg-dark file:text-bg-light hover:file:bg-bg-dark/80 transition-colors cursor-pointer" />
          {uploading && <div className="text-xs mt-2 opacity-70">Uploading... {Math.round(progress)}%</div>}
        </div>
      )}
    </div>
  );
};

const LiveGridPreview = ({ project }: { project: any }) => {
  const items = [
    { type: 'video', span: 'full', label: 'Intro Motion Visual' },
    { type: 'image', url: project.splitLeft, span: 'half', label: 'Split Left Photo' },
    { type: 'image', url: project.splitRight, span: 'half', label: 'Split Right Photo' },
    { type: 'video', span: 'full', label: 'System Animation Loop' },
    { type: 'image', url: project.variation1 || project.splitLeft, span: 'half', label: 'Variation 1' },
    { type: 'image', url: project.variation2 || project.splitRight, span: 'half', label: 'Variation 2' },
    { type: 'image', url: project.assetLogo, span: 'full', label: 'Asset / Logo Image' },
    { type: 'image', url: project.variation3 || project.assetLogo, span: 'half', label: 'Variation 3' },
    { type: 'image', url: '', span: 'half', label: 'Industry Image 1' },
    { type: 'image', url: '', span: 'half', label: 'Industry Image 2' },
    { type: 'video', span: 'half', label: 'Interface Transcode' },
    { type: 'image', url: project.finalePhoto, span: 'full', label: 'Finale Photo' },
    { type: 'image', url: '', span: 'half', label: 'Industry Image 3' },
    { type: 'video', span: 'half', label: 'Mechanics Video' },
    { type: 'video', span: 'half', label: 'Asset Motion' },
    { type: 'image', url: '', span: 'half', label: 'Industry Image 4' },
    { type: 'video', span: 'full', label: 'Abstract Wide' },
    { type: 'image', url: '', span: 'half', label: 'Industry Image 5' },
    { type: 'video', span: 'half', label: 'Design Interaction' },
    { type: 'video', span: 'half', label: 'Detail Screen Loop' },
    { type: 'image', url: '', span: 'half', label: 'Industry Image 6' },
    { type: 'image', url: project.bannerPhoto, span: 'half', label: 'Banner Photo' },
    { type: 'image', url: '', span: 'half', label: 'Industry Image 7' }
  ];

  return (
    <div className="sticky top-8 bg-bg-dark text-bg-light p-6 h-[800px] overflow-y-auto">
      <h3 className="text-xl font-display mb-6 sticky top-0 bg-bg-dark z-10 py-2">Live Grid Preview</h3>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item, idx) => (
          <div key={idx} className={`relative bg-black/50 border border-white/5 ${item.span === 'full' ? 'col-span-2' : 'col-span-1'} aspect-[4/3] flex items-center justify-center overflow-hidden group`}>
            {item.type === 'video' ? (
              <div className="text-white/40 font-mono text-[10px] text-center uppercase tracking-widest px-2">{item.label} <br/>(Video Playback)</div>
            ) : item.url ? (
              <img src={item.url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="" />
            ) : (
              <div className="text-white/40 font-mono text-[10px] text-center uppercase tracking-widest px-2 border border-dashed border-white/20 p-4">{item.label}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Projects state
  const [projects, setProjects] = useState<any[]>([]);
  const [newProject, setNewProject] = useState({
    title: '', category: '', discipline: '', sector: '', year: '', 
    image: '', aspectRatio: 'aspect-[16/10]', span: 'half',
    client: '', director: '', scope: '', editorialTitle: '',
    writeup: '', challenges: '', solutions: '',
    assetLogo: '', bannerPhoto: '', splitLeft: '', splitRight: '',
    variation1: '', variation2: '', variation3: '', finalePhoto: '', industry: ''
  });

  // Insights state
  const [insights, setInsights] = useState<any[]>([]);
  const [newInsight, setNewInsight] = useState({
    category: '', date: '', title: '', description: '', readTime: '', image: '', content: ''
  });

  // Inquiries and Subscriptions States
  const [adminInquiries, setAdminInquiries] = useState<any[]>([]);
  const [adminSubscriptions, setAdminSubscriptions] = useState<any[]>([]);

  // SMTP diagnostic state
  const [smtpStatus, setSmtpStatus] = useState<any>(null);
  const [smtpTesting, setSmtpTesting] = useState(false);
  const [smtpResult, setSmtpResult] = useState<{success?: boolean; message?: string; error?: string} | null>(null);

  const fetchAdminData = async () => {
    try {
      const inqRes = await fetch('/api/admin/inquiries');
      if (inqRes.ok) {
        const d = await inqRes.json();
        setAdminInquiries(d.inquiries || []);
      }
      const subRes = await fetch('/api/admin/subscriptions');
      if (subRes.ok) {
        const d = await subRes.json();
        setAdminSubscriptions(d.subscriptions || []);
      }
      const smtpRes = await fetch('/api/admin/smtp-status');
      if (smtpRes.ok) {
        const d = await smtpRes.json();
        setSmtpStatus(d);
      }
    } catch (e) {
      console.error("Error loading admin data: ", e);
    }
  };

  const handleTestSmtp = async () => {
    setSmtpTesting(true);
    setSmtpResult(null);
    try {
      const res = await fetch('/api/admin/test-smtp', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setSmtpResult({ success: true, message: data.message });
      } else {
        setSmtpResult({ success: false, error: data.error || 'Connection timed out or failed.' });
      }
    } catch (err: any) {
      setSmtpResult({ success: false, error: err.message || 'Network request failed' });
    } finally {
      setSmtpTesting(false);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (confirm("Are you sure you want to delete this contact submission?")) {
      try {
        await fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
        fetchAdminData();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    if (confirm("Are you sure you want to delete this subscription?")) {
      try {
        await fetch(`/api/admin/subscriptions/${id}`, { method: 'DELETE' });
        fetchAdminData();
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      if (user && user.email === 'odionsantos7@gmail.com') {
        fetchAdminData();
      }
    });

    const unsubscribeProjects = onSnapshot(collection(db, 'projects'), (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, error => console.error("Error fetching projects", error));

    const unsubscribeInsights = onSnapshot(collection(db, 'insights'), (snapshot) => {
      setInsights(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, error => console.error("Error fetching insights", error));

    return () => {
      unsubscribeAuth();
      unsubscribeProjects();
      unsubscribeInsights();
    };
  }, []);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'projects'), {
        ...newProject,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setNewProject({
        title: '', category: '', discipline: '', sector: '', year: '', 
        image: '', aspectRatio: 'aspect-[16/10]', span: 'half',
        client: '', director: '', scope: '', editorialTitle: '',
        writeup: '', challenges: '', solutions: '',
        assetLogo: '', bannerPhoto: '', splitLeft: '', splitRight: '',
        variation1: '', variation2: '', variation3: '', finalePhoto: '', industry: ''
      });
      alert("Project added successfully!");
    } catch (error: any) {
      alert("Error adding project: " + error.message);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm("Are you sure?")) {
      try {
        await deleteDoc(doc(db, 'projects', id));
      } catch (error: any) {
        alert("Error deleting project: " + error.message);
      }
    }
  };

  const handleAddInsight = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'insights'), {
        ...newInsight,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setNewInsight({
        category: '', date: '', title: '', description: '', readTime: '', image: '', content: ''
      });
      alert("Insight added successfully!");
    } catch (error: any) {
      alert("Error adding insight: " + error.message);
    }
  };

  const handleDeleteInsight = async (id: string) => {
    if (confirm("Are you sure?")) {
      try {
        await deleteDoc(doc(db, 'insights', id));
      } catch (error: any) {
        alert("Error deleting insight: " + error.message);
      }
    }
  };

  if (loading) return <div className="min-h-screen bg-bg-light text-bg-dark flex items-center justify-center">Loading...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-bg-light text-bg-dark flex flex-col items-center justify-center">
        <h1 className="text-3xl font-display mb-8">Admin Access</h1>
        <button onClick={loginWithGoogle} className="px-6 py-3 bg-bg-dark text-bg-light rounded hover:bg-bg-dark/80 transition-colors">
          Sign in with Google
        </button>
      </div>
    );
  }

  // Ensure authorized email
  if (user.email !== 'odionsantos7@gmail.com') {
    return (
      <div className="min-h-screen bg-bg-light text-bg-dark flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-3xl font-display mb-4">Unauthorized</h1>
        <p className="mb-4">Your email ({user.email}) is not authorized to edit CMS content.</p>
        <button onClick={logout} className="px-6 py-3 border border-bg-dark text-bg-dark rounded hover:bg-bg-dark hover:text-bg-light transition-colors">Sign Out</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-light text-bg-dark p-8 md:p-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12 border-b border-bg-dark/20 pb-6">
          <h1 className="text-3xl md:text-5xl font-display">Sannvara CMS</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-mono opacity-60">{user.email}</span>
            <button onClick={logout} className="text-sm uppercase tracking-widest hover:text-accent transition-colors">Sign Out</button>
          </div>
        </div>

        <div className="flex flex-col gap-24">
          {/* Projects CMS */}
          <div>
            <h2 className="text-2xl font-display mb-6">Manage Projects</h2>
            
            <div className="grid lg:grid-cols-2 gap-16 relative items-start">
              <form onSubmit={handleAddProject} className="space-y-4 bg-white/50 p-6 border border-bg-dark/10 h-[800px] overflow-y-auto">
                <h3 className="text-lg font-mono uppercase tracking-widest mb-4">Add New Project / Case Study</h3>
                <div className="space-y-4 font-mono text-sm">
                  <input type="text" placeholder="Title*" required value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="w-full p-2 bg-transparent border-b border-bg-dark/20 focus:outline-none" />
                  <input type="text" placeholder="Category*" required value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value})} className="w-full p-2 bg-transparent border-b border-bg-dark/20 focus:outline-none" />
                  <input type="text" placeholder="Discipline (e.g., Identity Architecture)*" required value={newProject.discipline} onChange={e => setNewProject({...newProject, discipline: e.target.value})} className="w-full p-2 bg-transparent border-b border-bg-dark/20 focus:outline-none" />
                  <input type="text" placeholder="Sector (e.g., Technology)*" required value={newProject.sector} onChange={e => setNewProject({...newProject, sector: e.target.value})} className="w-full p-2 bg-transparent border-b border-bg-dark/20 focus:outline-none" />
                  <input type="text" placeholder="Industry*" required value={newProject.industry} onChange={e => setNewProject({...newProject, industry: e.target.value})} className="w-full p-2 bg-transparent border-b border-bg-dark/20 focus:outline-none" />
                  <input type="text" placeholder="Year*" required value={newProject.year} onChange={e => setNewProject({...newProject, year: e.target.value})} className="w-full p-2 bg-transparent border-b border-bg-dark/20 focus:outline-none" />
                  
                  <h4 className="mt-8 mb-2 font-bold opacity-50">Images & Grid Settings</h4>
                  <ImageUpload label="Main Image / Thumbnail" value={newProject.image} onChange={url => setNewProject({...newProject, image: url})} />
                  <input type="text" placeholder="Aspect Ratio (aspect-[16/10], aspect-[3/4])*" required value={newProject.aspectRatio} onChange={e => setNewProject({...newProject, aspectRatio: e.target.value})} className="w-full p-2 bg-transparent border-b border-bg-dark/20 focus:outline-none" />
                  <input type="text" placeholder="Span (full or half)*" required value={newProject.span} onChange={e => setNewProject({...newProject, span: e.target.value})} className="w-full p-2 bg-transparent border-b border-bg-dark/20 focus:outline-none" />

                  <h4 className="mt-8 mb-2 font-bold opacity-50">Case Study Details</h4>
                  <input type="text" placeholder="Client Name*" required value={newProject.client} onChange={e => setNewProject({...newProject, client: e.target.value})} className="w-full p-2 bg-transparent border-b border-bg-dark/20 focus:outline-none" />
                  <input type="text" placeholder="Creative Director*" required value={newProject.director} onChange={e => setNewProject({...newProject, director: e.target.value})} className="w-full p-2 bg-transparent border-b border-bg-dark/20 focus:outline-none" />
                  <input type="text" placeholder="Scope of Work*" required value={newProject.scope} onChange={e => setNewProject({...newProject, scope: e.target.value})} className="w-full p-2 bg-transparent border-b border-bg-dark/20 focus:outline-none" />
                  
                  <textarea placeholder="Editorial Title*" required value={newProject.editorialTitle} onChange={e => setNewProject({...newProject, editorialTitle: e.target.value})} className="w-full p-2 bg-transparent border-b border-bg-dark/20 focus:outline-none min-h-16" />
                  <textarea placeholder="Project Writeup (General)" value={newProject.writeup} onChange={e => setNewProject({...newProject, writeup: e.target.value})} className="w-full p-2 bg-transparent border-b border-bg-dark/20 focus:outline-none min-h-[150px]" />
                  
                  <h4 className="mt-8 mb-2 font-bold opacity-50">Challenges & Solutions</h4>
                  <textarea placeholder="The Challenge (use newlines for paragraphs)*" value={newProject.challenges} onChange={e => setNewProject({...newProject, challenges: e.target.value})} className="w-full p-2 bg-transparent border-b border-bg-dark/20 focus:outline-none min-h-[150px]" />
                  <textarea placeholder="The Solution (use newlines for paragraphs)*" value={newProject.solutions} onChange={e => setNewProject({...newProject, solutions: e.target.value})} className="w-full p-2 bg-transparent border-b border-bg-dark/20 focus:outline-none min-h-[150px]" />

                  <h4 className="mt-8 mb-2 font-bold opacity-50">Case Study Grid Contents</h4>
                  <ImageUpload label="Split Left Photo (Half width)" value={newProject.splitLeft} onChange={url => setNewProject({...newProject, splitLeft: url})} />
                  <ImageUpload label="Split Right Photo (Half width)" value={newProject.splitRight} onChange={url => setNewProject({...newProject, splitRight: url})} />
                  <ImageUpload label="Variation 1 Photo (Half width)" value={newProject.variation1} onChange={url => setNewProject({...newProject, variation1: url})} />
                  <ImageUpload label="Variation 2 Photo (Half width)" value={newProject.variation2} onChange={url => setNewProject({...newProject, variation2: url})} />
                  <ImageUpload label="Asset / Logo Image (Full width)" value={newProject.assetLogo} onChange={url => setNewProject({...newProject, assetLogo: url})} />
                  <ImageUpload label="Variation 3 Photo (Half width)" value={newProject.variation3} onChange={url => setNewProject({...newProject, variation3: url})} />
                  <ImageUpload label="Finale Photo (Full width)" value={newProject.finalePhoto} onChange={url => setNewProject({...newProject, finalePhoto: url})} />
                  <ImageUpload label="Banner Photo (Half width)" value={newProject.bannerPhoto} onChange={url => setNewProject({...newProject, bannerPhoto: url})} />
                </div>
                <button type="submit" className="w-full mt-6 py-3 bg-bg-dark text-bg-light uppercase tracking-widest text-sm hover:bg-bg-dark/80 transition-colors">Add Project</button>
              </form>

              <LiveGridPreview project={newProject} />
            </div>

            <div className="space-y-4 max-w-2xl mt-12">
              <h3 className="text-lg font-mono uppercase tracking-widest opacity-50 mb-4">Existing Projects</h3>
              {projects.map(p => (
                <div key={p.id} className="flex items-center justify-between p-4 border border-bg-dark/10 bg-white/30">
                  <div>
                    <h4 className="font-display text-lg">{p.title}</h4>
                    <span className="text-xs font-mono opacity-60">{p.year} • {p.category}</span>
                  </div>
                  <button onClick={() => handleDeleteProject(p.id)} className="text-red-500 hover:text-red-700 uppercase tracking-widest text-xs">Delete</button>
                </div>
              ))}
            </div>
          </div>

          {/* Insights CMS */}
          <div>
            <h2 className="text-2xl font-display mb-6">Manage "The Gather" Insights</h2>

            <form onSubmit={handleAddInsight} className="space-y-4 mb-12 bg-white/50 p-6 border border-bg-dark/10">
              <h3 className="text-lg font-mono uppercase tracking-widest mb-4">Add New Insight</h3>
              <input type="text" placeholder="Category (e.g., ESSAY)" required value={newInsight.category} onChange={e => setNewInsight({...newInsight, category: e.target.value})} className="w-full p-2 bg-transparent border-b border-bg-dark/20 focus:outline-none" />
              <input type="text" placeholder="Date (e.g., June 10, 2026)" required value={newInsight.date} onChange={e => setNewInsight({...newInsight, date: e.target.value})} className="w-full p-2 bg-transparent border-b border-bg-dark/20 focus:outline-none" />
              <input type="text" placeholder="Title" required value={newInsight.title} onChange={e => setNewInsight({...newInsight, title: e.target.value})} className="w-full p-2 bg-transparent border-b border-bg-dark/20 focus:outline-none" />
              <textarea placeholder="Brief description to act as teaser copy" required value={newInsight.description} onChange={e => setNewInsight({...newInsight, description: e.target.value})} className="w-full p-2 bg-transparent border-b border-bg-dark/20 focus:outline-none h-24" />
              <textarea placeholder="Essay/Insight markdown content (use double-new-lines for paragraphs and start core headers with ###)" value={newInsight.content} onChange={e => setNewInsight({...newInsight, content: e.target.value})} className="w-full p-2 bg-transparent border-b border-bg-dark/20 focus:outline-none h-48 font-mono text-xs" />
              <input type="text" placeholder="Read Time (e.g., 8 MIN READ)" required value={newInsight.readTime} onChange={e => setNewInsight({...newInsight, readTime: e.target.value})} className="w-full p-2 bg-transparent border-b border-bg-dark/20 focus:outline-none" />
              <input type="text" placeholder="Image URL" required value={newInsight.image} onChange={e => setNewInsight({...newInsight, image: e.target.value})} className="w-full p-2 bg-transparent border-b border-bg-dark/20 focus:outline-none" />
              <button type="submit" className="w-full mt-4 py-3 bg-bg-dark text-bg-light uppercase tracking-widest text-sm hover:bg-bg-dark/80 transition-colors">Add Insight</button>
            </form>

            <div className="space-y-4">
              {insights.map(i => (
                <div key={i.id} className="flex items-center justify-between p-4 border border-bg-dark/10 bg-white/30">
                  <div>
                    <h4 className="font-display text-lg">{i.title}</h4>
                    <span className="text-xs font-mono opacity-60">{i.readTime}</span>
                  </div>
                  <button onClick={() => handleDeleteInsight(i.id)} className="text-red-500 hover:text-red-700 uppercase tracking-widest text-xs">Delete</button>
                </div>
              ))}
            </div>

          </div>

          {/* SMTP Mail Server Status & Diagnostics Section */}
          <div className="border-t border-bg-dark/20 pt-16 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-display">SMTP Integration Diagnostics</h2>
                <p className="text-xs font-mono text-bg-dark/60 mt-1 uppercase tracking-wider">Configure environments secrets to receive inquiry & newsletter alert emails</p>
              </div>
              <button 
                onClick={fetchAdminData} 
                className="text-xs uppercase tracking-widest bg-bg-dark text-bg-light px-4 py-2 hover:bg-bg-dark/80 transition-colors"
              >
                Refresh Configuration Status
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Config Details */}
              <div className="p-6 border border-bg-dark/10 bg-white/40 font-mono space-y-4">
                <h3 className="text-xs uppercase tracking-widest font-bold border-b border-bg-dark/10 pb-2">Active Settings</h3>
                {smtpStatus ? (
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-bg-dark/5">
                      <span className="opacity-60">Status:</span>
                      <span className={smtpStatus.configured ? "text-green-600 font-bold" : "text-yellow-600 font-bold"}>
                        {smtpStatus.configured ? "✦ Ready to Test" : "⚠️ Credentials Missing"}
                      </span>
                    </div>
                    {smtpStatus.hasResend && (
                      <div className="flex justify-between py-1 border-b border-bg-dark/5 text-green-600 font-bold">
                        <span>HTTP API Provider:</span>
                        <span>Resend (Active)</span>
                      </div>
                    )}
                    {smtpStatus.hasSendGrid && (
                      <div className="flex justify-between py-1 border-b border-bg-dark/5 text-green-600 font-bold">
                        <span>HTTP API Provider:</span>
                        <span>SendGrid (Active)</span>
                      </div>
                    )}
                    {smtpStatus.service && (
                      <div className="flex justify-between py-1 border-b border-bg-dark/5">
                        <span className="opacity-60">Preset Service:</span>
                        <span className="font-semibold">{smtpStatus.service}</span>
                      </div>
                    )}
                    {smtpStatus.host && (
                      <div className="flex justify-between py-1 border-b border-bg-dark/5">
                        <span className="opacity-60">SMTP Host:</span>
                        <span className="font-semibold">{smtpStatus.host}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1 border-b border-bg-dark/5">
                      <span className="opacity-60">Port:</span>
                      <span>{smtpStatus.port}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-bg-dark/5">
                      <span className="opacity-60">Secure Connection:</span>
                      <span>{String(smtpStatus.secure)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="opacity-60">Sender Address:</span>
                      <span>{smtpStatus.user || 'onboarding@resend.dev'}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs opacity-50">Loading SMTP status...</p>
                )}
              </div>

              {/* Diagnostic Trigger */}
              <div className="p-6 border border-bg-dark/10 bg-white/40 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xs uppercase tracking-widest font-bold font-mono">Test SMTP Connection</h3>
                  <p className="text-xs text-bg-dark/70 leading-relaxed">
                    Trigger a connection test and send a diagnostic verification email to <strong className="font-mono">workwithsannvara@gmail.com</strong> relative to the setup.
                  </p>
                </div>

                <div className="space-y-4">
                  <button 
                    disabled={smtpTesting || !smtpStatus?.configured}
                    onClick={handleTestSmtp} 
                    className={`w-full py-3 font-mono text-[11px] uppercase tracking-wider font-bold transition-all border ${
                      !smtpStatus?.configured 
                        ? 'border-bg-dark/10 bg-transparent text-bg-dark/30 cursor-not-allowed'
                        : smtpTesting 
                          ? 'border-accent bg-accent/10 text-accent/80 cursor-wait'
                          : 'bg-bg-dark border-transparent hover:bg-bg-dark/80 text-bg-light'
                    }`}
                  >
                    {smtpTesting ? "Performing Handshake..." : "Run Connection Diagnostics"}
                  </button>

                  {smtpResult && (
                    <div className={`p-3 border text-xs font-mono space-y-1 ${
                      smtpResult.success 
                        ? 'bg-green-100/40 border-green-300 text-green-800' 
                        : 'bg-red-100/40 border-red-300 text-red-800'
                    }`}>
                      <span className="font-bold block uppercase tracking-wider">
                        {smtpResult.success ? "✓ Test Succeeded" : "✗ test failed"}
                      </span>
                      <p className="text-[11px] leading-relaxed break-words">{smtpResult.message || smtpResult.error}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Setup Guide */}
              <div className="p-6 border border-bg-dark/10 bg-white/40 font-mono text-[11px] space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#987a55]">SMTP vs HTTP Deliverability</h3>
                <p className="opacity-80 leading-relaxed text-[11px]">
                  Cloud sandboxes/hosting block standard SMTP ports (587, 465) by default. To bypass port blockades:
                </p>
                <div className="space-y-2 bg-[#f9f8f6] p-2 border border-bg-dark/10 text-[10px]">
                  <strong className="block text-green-700 uppercase">Recommended: HTTP Email API</strong>
                  <p className="leading-relaxed">Get a free key from <a href="https://resend.com" target="_blank" rel="noreferrer" className="underline font-bold">Resend.com</a> or <a href="https://sendgrid.com" target="_blank" rel="noreferrer" className="underline font-bold">SendGrid</a>, then configure <code className="bg-bg-dark/5 px-1 font-semibold">RESEND_API_KEY</code> or <code className="bg-bg-dark/5 px-1 font-semibold">SENDGRID_API_KEY</code>.</p>
                </div>
                <div className="space-y-1 opacity-75">
                  <strong className="block uppercase text-[10px]">Fallback: SMTP Server</strong>
                  <p className="leading-relaxed text-[10px]">Configure: <code className="bg-bg-dark/5 px-1 font-semibold">SMTP_HOST</code>, <code className="bg-bg-dark/5 px-1 font-semibold">SMTP_USER</code>, <code className="bg-bg-dark/5 px-1 font-semibold">SMTP_PASS</code> (App Password for Gmail).</p>
                </div>
              </div>

            </div>
          </div>

          {/* Inquiries & Subscriptions Section */}
          <div className="grid md:grid-cols-2 gap-16 border-t border-bg-dark/20 pt-16">
            
            {/* Inquiries List */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-display">Contact Inquiries ({adminInquiries.length})</h2>
                <button onClick={fetchAdminData} className="text-xs uppercase tracking-widest bg-bg-dark text-bg-light px-3 py-1 hover:bg-bg-dark/80 transition-colors">Refresh</button>
              </div>
              
              {adminInquiries.length === 0 ? (
                <div className="text-sm font-mono text-bg-dark/50 border border-dashed border-bg-dark/20 p-8 text-center bg-white/10">No contact inquiries found. Submit the Contact form to test.</div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {adminInquiries.map((inq: any) => (
                    <div key={inq.id} className="p-5 border border-bg-dark/10 bg-white/40 block space-y-3 relative group">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-display text-lg font-medium">{inq.name}</h4>
                          <a href={`mailto:${inq.email}`} className="text-xs font-mono text-accent hover:underline">{inq.email}</a>
                        </div>
                        <button onClick={() => handleDeleteInquiry(inq.id)} className="text-red-500 hover:text-red-700 uppercase tracking-widest text-xs font-mono">Delete</button>
                      </div>
                      
                      {inq.company && (
                        <p className="text-xs font-mono bg-bg-dark/5 px-2 py-1 inline-block uppercase tracking-wider">Company: {inq.company}</p>
                      )}
                      
                      <p className="text-sm font-body text-bg-dark/80 bg-white/20 p-3 border-l border-bg-dark/20 whitespace-pre-line">{inq.message}</p>
                      <span className="text-[10px] font-mono opacity-40 block">{new Date(inq.date).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Newsletter Subscriptions List */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-display">Newsletter Signups ({adminSubscriptions.length})</h2>
                <button onClick={fetchAdminData} className="text-xs uppercase tracking-widest bg-bg-dark text-bg-light px-3 py-1 hover:bg-bg-dark/80 transition-colors">Refresh</button>
              </div>

              {adminSubscriptions.length === 0 ? (
                <div className="text-sm font-mono text-bg-dark/50 border border-dashed border-bg-dark/20 p-8 text-center bg-white/10">No newsletter signups found. Submit the newsletter input in Gather to test.</div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                  {adminSubscriptions.map((sub: any) => (
                    <div key={sub.id} className="flex justify-between items-center p-4 border border-bg-dark/10 bg-white/40">
                      <div>
                        <span className="font-mono text-sm tracking-wide font-medium">{sub.email}</span>
                        <span className="block text-[10px] font-mono opacity-40 mt-1">{new Date(sub.date).toLocaleString()}</span>
                      </div>
                      <button onClick={() => handleDeleteSubscription(sub.id)} className="text-red-500 hover:text-red-700 uppercase tracking-widest text-xs font-mono">Delete</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
