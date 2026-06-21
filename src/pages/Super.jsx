import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';

const _0xDbChunks = ["aHR0cHM6Ly9zY3JpcHQuZ29v", "Z2xlLmNvbS9tYWNyb3Mvcy9B", "S2Z5Y2J6RXdlUkQ2dTVmeGVH", "SEtOR0VJTFhZOWkzcXhibTdP", "QVlMZHRaeGxHdmdEOXhDb01D", "aUN3OGJDbmpDLXhad3cxbksv", "ZXhlYw=="];
const DEFAULT_SHEETS_URL = atob(_0xDbChunks.join(""));
const LOGIN_PORTAL_URL = "https://s-tools.id/edu/page-instruktur.html";
const EMAIL_BUTTONS_HTML = `<br><br><div style="text-align:center;"><a href="https://s-tools.id/edu/" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-family: sans-serif; margin-right: 10px; margin-bottom: 10px;">Masuk ke Dashboard</a></div>`;

if (localStorage.getItem('edu_sheets_url') !== DEFAULT_SHEETS_URL) {
    localStorage.setItem('edu_sheets_url', DEFAULT_SHEETS_URL);
}

const IconWrapper = ({ name, size = 24, className = "", weight="regular" }) => <i className={`ph${weight === 'fill' ? '-fill' : weight === 'duotone' ? '-duotone' : weight === 'bold' ? '-bold' : ''} ph-${name} ${className}`} style={{ fontSize: size }}></i>;
const ShieldCheck = (p) => <IconWrapper name="shield-check" {...p} />; const Database = (p) => <IconWrapper name="database" {...p} />; const BookOpen = (p) => <IconWrapper name="book-open" {...p} />; const GraduationCap = (p) => <IconWrapper name="graduation-cap" {...p} />; const Bell = (p) => <IconWrapper name="bell" {...p} />; const Article = (p) => <IconWrapper name="article" {...p} />; const LogOut = (p) => <IconWrapper name="sign-out" {...p} />; const Users = (p) => <IconWrapper name="users" {...p} />; const PlusCircle = (p) => <IconWrapper name="plus-circle" {...p} />; const MagnifyingGlass = (p) => <IconWrapper name="magnifying-glass" {...p} />; const CheckCircle2 = (p) => <IconWrapper name="check-circle" {...p} />; const X = (p) => <IconWrapper name="x" {...p} />; const ToggleLeft = (p) => <IconWrapper name="toggle-left" {...p} />; const ToggleRight = (p) => <IconWrapper name="toggle-right" {...p} />; const Award = (p) => <IconWrapper name="medal" {...p} />; const AlertCircle = (p) => <IconWrapper name="warning-circle" {...p} />;

const calcProgress = (enr, crs) => { 
    if (!crs || !crs.modules || crs.modules.length === 0 || !enr) return 0; 
    if (enr.isGraduated) return 100;
    let completedArray = Array.isArray(enr.completedModules) ? enr.completedModules : (typeof enr.completedModules === 'string' ? JSON.parse(enr.completedModules || "[]") : []);
    let prog = Math.round((completedArray.length / crs.modules.length) * 100); 
    return prog > 100 ? 100 : prog;
};

const normalizeCourses = (coursesArr) => {
    if (!coursesArr) return [];
    return coursesArr.map(c => {
        let exam = c.exam || { minScore: 70, questions: [] };
        if (!exam.questions) exam.questions = [];
        while(exam.questions.length < 10) exam.questions.push({ q: '', options: ['','','',''], answer: 0 });
        if (exam.questions.length > 10) exam.questions = exam.questions.slice(0, 10);
        c.exam = exam; return c;
    });
};

function SuperApp() {
  const [dbMode] = useState(() => localStorage.getItem('edu_db_mode') || 'sheets');
  const [dbReady, setDbReady] = useState(false);
  const [setupError, setSetupError] = useState("");
  const [session, setSession] = useState(() => JSON.parse(sessionStorage.getItem('edu_session')) || null);
  
  const [admins, setAdmins] = useState([]);
  const [courses, setCourses] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [appMode, setAppMode] = useState('super_dashboard');
  const [superTab, setSuperTab] = useState("dashboard"); 
  const [searchInst, setSearchInst] = useState("");
  const [searchCourse, setSearchCourse] = useState("");
  const [searchPart, setSearchPart] = useState("");
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, message: "", onConfirm: null });
  const [quotaModal, setQuotaModal] = useState({ isOpen: false, adminId: null, name: "", maxCourses: 0, maxParticipants: 0 });
  const [infoSuperForm, setInfoSuperForm] = useState({ instText: '', showInst: false, partText: '', showPart: false });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    if (!session || session.role !== 'super_admin') window.location.href = 'index.html';
  }, [session]);

  useEffect(() => {
    if (appMode === 'setup_db') return;
    if (dbMode === 'local') {
      setAdmins(JSON.parse(localStorage.getItem('edu_admins')) || []);
      setCourses(normalizeCourses(JSON.parse(localStorage.getItem('edu_courses')) || []));
      setParticipants(JSON.parse(localStorage.getItem('edu_participants')) || []);
      setEnrollments(JSON.parse(localStorage.getItem('edu_enrollments')) || []);
      setNotifications(JSON.parse(localStorage.getItem('edu_notifications')) || []);
      
      if (session?.role === 'super_admin') {
          const sup = (JSON.parse(localStorage.getItem('edu_admins')) || []).find(a => String(a.id) === String(session?.data?.id));
          if(sup) setInfoSuperForm({ instText: sup.info1||'', showInst: sup.showInfo1||false, partText: sup.info2||'', showPart: sup.showInfo2||false });
      }
      setDbReady(true);
    } else if (dbMode === 'sheets') {
      const url = localStorage.getItem('edu_sheets_url') || DEFAULT_SHEETS_URL;
      if(!url) { setAppMode('setup_db'); return; }
      const fetchUrl = url + (url.includes('?') ? '&' : '?') + 'nocache=' + new Date().getTime();
      fetch(fetchUrl).then(res => { if(!res.ok) throw new Error("Network error"); return res.json(); }).then(data => {
            if(data.admins) { const uniqueAdmins = Array.from(new Map(data.admins.map(a => [a.id, a])).values()); setAdmins(uniqueAdmins); localStorage.setItem('edu_admins', JSON.stringify(uniqueAdmins)); }
            if(data.courses) { const normCourses = normalizeCourses(data.courses); setCourses(normCourses); localStorage.setItem('edu_courses', JSON.stringify(normCourses)); }
            if(data.participants) { setParticipants(data.participants); localStorage.setItem('edu_participants', JSON.stringify(data.participants)); }
            if(data.enrollments) { setEnrollments(data.enrollments); localStorage.setItem('edu_enrollments', JSON.stringify(data.enrollments)); }
            if(data.notifications) { setNotifications(data.notifications); localStorage.setItem('edu_notifications', JSON.stringify(data.notifications)); }
            
            const sup = data.admins?.find(a => String(a.id) === String(session?.data?.id));
            if(sup) setInfoSuperForm({ instText: sup.info1||'', showInst: sup.showInfo1||false, partText: sup.info2||'', showPart: sup.showInfo2||false });
            setDbReady(true);
        }).catch(e => {
            let errorMsg = "Database belum terkoneksi. Silakan periksa jaringan internet Anda atau coba lagi nanti.";
            if (e.toString().includes("Failed to fetch") || e.toString().includes("Network error")) errorMsg = "Koneksi ke Database diblokir oleh browser (CORS). Perbarui Deployment GAS.";
            setSetupError(errorMsg); setAppMode('setup_db'); 
        });
    }
  }, [dbMode, appMode]);

  const execDbAction = async (localAction) => {
    try {
      if (dbMode === 'sheets') {
          localAction(); 
          const url = localStorage.getItem('edu_sheets_url') || DEFAULT_SHEETS_URL;
          if (url) {
              const currentAdmins = JSON.parse(localStorage.getItem('edu_admins')) || admins;
              const uniqueAdmins = Array.from(new Map(currentAdmins.map(a => [a.id, a])).values());
              const rawEnrollments = JSON.parse(localStorage.getItem('edu_enrollments')) || enrollments;
              const mappedEnrollments = rawEnrollments.map(enr => ({ ...enr, completedModules_json: JSON.stringify(enr.completedModules || []) }));
              const payload = { admins: uniqueAdmins, courses: JSON.parse(localStorage.getItem('edu_courses')) || courses, participants: JSON.parse(localStorage.getItem('edu_participants')) || participants, enrollments: mappedEnrollments, notifications: JSON.parse(localStorage.getItem('edu_notifications')) || notifications };
              fetch(url + (url.includes('?') ? '&' : '?') + 'nocache=' + new Date().getTime(), { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) }).catch(console.error);
          }
      } else { localAction(); }
    } catch (error) { console.error(error); showToast("Gagal menyimpan."); }
  };

  const triggerEmail = (emailAction) => {
      const url = localStorage.getItem('edu_sheets_url') || DEFAULT_SHEETS_URL;
      if (!url) return;
      fetch(url + (url.includes('?') ? '&' : '?') + 'nocache=' + new Date().getTime(), { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ emailAction }) }).catch(console.error);
  };

  const isSwitchableAccount = () => {
     if (!session) return false;
     const currentEmail = String(session.data.email).trim().toLowerCase();
     return admins.some(a => {
         const aEmail = a.email ? String(a.email).trim().toLowerCase() : `${String(a.username).trim().toLowerCase()}@edulearn.local`;
         return aEmail === currentEmail;
     });
  };

  const triggerRoleSwitch = () => { window.location.href = 'index.html'; };

  const handleLogout = () => {
    setSession(null); sessionStorage.removeItem('edu_session'); window.location.href = LOGIN_PORTAL_URL;
  };

  const ConfirmModal = () => {
    if (!confirmDialog.isOpen) return null;
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mx-auto mb-4"><AlertCircle size={32} /></div>
          <h3 className="text-lg md:text-xl font-bold mb-2">Konfirmasi Tindakan</h3><p className="text-sm text-slate-600 mb-6">{confirmDialog.message}</p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <button onClick={() => setConfirmDialog({ isOpen: false })} className="flex-1 bg-slate-100 hover:bg-slate-200 py-3 rounded-xl font-bold">Tutup</button>
              {confirmDialog.onConfirm && <button onClick={confirmDialog.onConfirm} className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold">Lanjutkan</button>}
          </div>
        </div>
      </div>
    );
  };

  const InstructorQuotaModal = () => {
     if (!quotaModal.isOpen) return null;
     return (
         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
             <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-[fadeIn_200ms_ease-out]">
                 <div className="flex justify-between items-center border-b pb-4 mb-6">
                     <div><h3 className="text-lg font-black text-slate-900">Kelola Kuota Instruktur</h3><p className="text-xs text-slate-500">Nama: <span className="font-bold text-slate-700">{quotaModal.name}</span></p></div>
                     <button onClick={() => setQuotaModal({ ...quotaModal, isOpen: false })} className="w-8 h-8 rounded-full bg-slate-100"><X size={16} /></button>
                 </div>
                 <form onSubmit={handleUpdateInstructorQuota} className="space-y-4">
                     <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase block">Maksimal Kuota Kelas</label><input type="number" min="0" required value={quotaModal.maxCourses} onChange={e => setQuotaModal({ ...quotaModal, maxCourses: e.target.value })} className="w-full p-3.5 bg-slate-50 border rounded-xl font-bold" /></div>
                     <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase block">Maksimal Kuota Siswa</label><input type="number" min="0" required value={quotaModal.maxParticipants} onChange={e => setQuotaModal({ ...quotaModal, maxParticipants: e.target.value })} className="w-full p-3.5 bg-slate-50 border rounded-xl font-bold" /></div>
                     <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl">Simpan Perubahan Limit</button>
                 </form>
             </div>
         </div>
     );
  };

  const handleRegisterAdmin = async (e) => {
    e.preventDefault(); const fd = new FormData(e.target); const username = fd.get('username').trim().toLowerCase(); const email = fd.get('email').trim().toLowerCase();
    if (admins.some(a => a.username === username)) return showToast("Username terpakai!");
    const newAdminData = { 
      name: fd.get('name'), username, email: email, password: fd.get('password'), 
      isSuper: false, isActive: true, donationLink: '', info1: '', showInfo1: false, info2: '', showInfo2: false, 
      info3: '', showInfo3: false, maxCourses: parseInt(fd.get('maxCourses')) || 5, maxParticipants: parseInt(fd.get('maxParticipants')) || 50,
      whatsapp: "", allowPromo: false
    };
    await execDbAction(() => {
          const updatedA = [...admins, { id: `adm_${Date.now()}`, ...newAdminData }];
          setAdmins(updatedA); localStorage.setItem('edu_admins', JSON.stringify(updatedA));
    });
    e.target.reset(); showToast("Instruktur Ditambahkan!");
    triggerEmail({ tujuan: email, subjek: "Akun Instruktur EduLearn Berhasil Dibuat", namaPengguna: newAdminData.name, isiPesanInti: `Akun Instruktur Anda telah berhasil dibuat oleh Super Admin.` + EMAIL_BUTTONS_HTML });
  };

  const handleToggleActiveAdmin = async (id, currentStatus) => {
    await execDbAction(() => {
        const updatedA = admins.map(a => a.id === id ? { ...a, isActive: !currentStatus } : a);
        setAdmins(updatedA); localStorage.setItem('edu_admins', JSON.stringify(updatedA));
    }); showToast(!currentStatus ? "Akun Diaktifkan" : "Akun Dinonaktifkan");
  };

  const handleTogglePromo = async (id, currentStatus) => {
    await execDbAction(() => {
        const updatedA = admins.map(a => a.id === id ? { ...a, allowPromo: !currentStatus } : a);
        setAdmins(updatedA); localStorage.setItem('edu_admins', JSON.stringify(updatedA));
    }); showToast(!currentStatus ? "Hak Promo Diaktifkan" : "Hak Promo Dicabut");
  };

  const handleToggleActiveCourse = async (id, currentStatus) => {
    await execDbAction(() => {
        const updatedC = courses.map(c => c.id === id ? { ...c, isActive: !currentStatus } : c);
        setCourses(updatedC); localStorage.setItem('edu_courses', JSON.stringify(updatedC));
    }); showToast(!currentStatus ? "Kursus Diaktifkan" : "Kursus Dinonaktifkan");
  };

  const handleUpdateInstructorQuota = async (e) => {
    e.preventDefault();
    await execDbAction(() => {
        const updatedA = admins.map(a => String(a.id) === String(quotaModal.adminId) ? { ...a, maxCourses: parseInt(quotaModal.maxCourses), maxParticipants: parseInt(quotaModal.maxParticipants) } : a);
        setAdmins(updatedA); localStorage.setItem('edu_admins', JSON.stringify(updatedA));
    });
    setQuotaModal({ ...quotaModal, isOpen: false }); showToast("Kuota Instruktur Berhasil Diperbarui!");
  };

  const handleApproveLimitRequest = async (notifId, instructorId, reqCourses, reqParticipants, isApproved) => {
     const addedCourses = parseInt(reqCourses) || 0; const addedParticipants = parseInt(reqParticipants) || 0;
     await execDbAction(() => {
         if (isApproved) {
             const updatedA = admins.map(a => String(a.id) === String(instructorId) ? { ...a, maxCourses: (a.maxCourses || 0) + addedCourses, maxParticipants: (a.maxParticipants || 0) + addedParticipants } : a);
             setAdmins(updatedA); localStorage.setItem('edu_admins', JSON.stringify(updatedA));
         }
         const updatedN = notifications.map(n => String(n.id) === String(notifId) ? { ...n, isRead: true } : n);
         setNotifications(updatedN); localStorage.setItem('edu_notifications', JSON.stringify(updatedN));
     });
     showToast(isApproved ? "Permintaan disetujui!" : "Permintaan ditolak.");
  };

  const handleUpdateAdminInfo = async () => {
      await execDbAction(() => {
          const currentUsername = String(session.data.username).trim().toLowerCase();
          const updatedA = admins.map(a => String(a.username).trim().toLowerCase() === currentUsername ? { ...a, info1: infoSuperForm.instText, showInfo1: infoSuperForm.showInst, info2: infoSuperForm.partText, showInfo2: infoSuperForm.showPart } : a);
          setAdmins(updatedA); localStorage.setItem('edu_admins', JSON.stringify(updatedA));
      }); showToast("Papan Informasi Diperbarui!");
  };

  if (!dbReady && appMode !== 'setup_db') return <div className="min-h-screen flex items-center justify-center"><h2 className="text-xl font-bold">Menghubungkan ke Database...</h2></div>;
  
  if (appMode === 'setup_db') {
      return (
          <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
              <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md text-center">
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4"><Database size={32} /></div>
                  <h2 className="text-2xl font-extrabold text-slate-900">Koneksi Database Gagal</h2><p className="text-slate-500 mt-2 mb-6">{setupError}</p>
                  <button onClick={() => window.location.reload()} className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl">Coba Lagi</button>
              </div>
          </div>
      );
  }

  if (appMode === 'super_dashboard') {
    const safeLower = (str) => (str || '').toString().toLowerCase();
    const regularAdmins = admins.filter(a => !(a.isSuper === true || a.isSuper === 'true' || a.isSuper === 'TRUE'));
    const filteredAdmins = regularAdmins.filter(a => safeLower(a.name).includes(safeLower(searchInst)) || safeLower(a.username).includes(safeLower(searchInst)));
    const filteredCourses = courses.filter(c => safeLower(c.title).includes(safeLower(searchCourse)) || safeLower(c.code).includes(safeLower(searchCourse)) || safeLower(c.instructor).includes(safeLower(searchCourse)));
    const allEnrs = enrollments.map(enr => { const p = participants.find(x => String(x.id) === String(enr.participantId)); const c = courses.find(x => String(x.id) === String(enr.courseId)); return { ...enr, pName: p?.name||'', pEmail: p?.email||'', cTitle: c?.title||'', prog: calcProgress(enr,c) }; });
    const filteredEnrs = allEnrs.filter(e => safeLower(e.pName).includes(safeLower(searchPart)) || safeLower(e.cTitle).includes(safeLower(searchPart)));

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col animate-[fadeIn_200ms_ease-out]">
        {ConfirmModal()}{InstructorQuotaModal()}{toast && <div className="fixed top-4 right-4 z-[100] bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2"><CheckCircle2 size={20}/><span>{toast}</span></div>}
        
        <header className="bg-slate-900 text-white px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between z-20 gap-4 shadow-md">
          <div className="flex items-center space-x-3 w-full md:w-auto justify-center md:justify-start"><ShieldCheck size={28} className="text-amber-400" /><div className="flex items-center flex-wrap justify-center gap-2"><h1 className="text-lg md:text-xl font-bold">EduLearn</h1><span className="bg-slate-800 text-amber-400 text-[10px] md:text-xs px-2.5 py-1 rounded-md font-bold tracking-wider uppercase border border-slate-700">Super Admin</span></div></div>
          <div className="flex space-x-2 bg-slate-800 p-1.5 rounded-xl overflow-x-auto scrollbar-hide w-full md:w-auto snap-x">
            <button onClick={() => setSuperTab('dashboard')} className={`shrink-0 px-4 py-2 rounded-lg text-sm font-bold flex items-center ${superTab==='dashboard'?'bg-amber-500 text-slate-900 shadow-sm':'text-slate-300 hover:bg-slate-700'}`}><Database size={18} className="mr-2"/> Dasbor</button>
            <button onClick={() => setSuperTab('instructors')} className={`shrink-0 px-4 py-2 rounded-lg text-sm font-bold flex items-center ${superTab==='instructors'?'bg-amber-500 text-slate-900 shadow-sm':'text-slate-300 hover:bg-slate-700'}`}><IconWrapper name="users-three" size={18} className="mr-2" /> Instruktur</button>
            <button onClick={() => setSuperTab('courses')} className={`shrink-0 px-4 py-2 rounded-lg text-sm font-bold flex items-center ${superTab==='courses'?'bg-amber-500 text-slate-900 shadow-sm':'text-slate-300 hover:bg-slate-700'}`}><BookOpen size={18} className="mr-2"/> Kursus</button>
            <button onClick={() => setSuperTab('participants')} className={`shrink-0 px-4 py-2 rounded-lg text-sm font-bold flex items-center ${superTab==='participants'?'bg-amber-500 text-slate-900 shadow-sm':'text-slate-300 hover:bg-slate-700'}`}><GraduationCap size={18} className="mr-2"/> Peserta</button>
            <button onClick={() => setSuperTab('requests')} className={`shrink-0 px-4 py-2 rounded-lg text-sm font-bold flex items-center relative ${superTab==='requests'?'bg-amber-500 text-slate-900 shadow-sm':'text-slate-300 hover:bg-slate-700'}`}><Bell size={18} className="mr-2"/> Permintaan {notifications.filter(n => n.courseId === "REQ_UPGRADE" && !n.isRead).length > 0 && <span className="absolute top-0.5 right-1 bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">{notifications.filter(n => n.courseId === "REQ_UPGRADE" && !n.isRead).length}</span>}</button>
            <button onClick={() => setSuperTab('info')} className={`shrink-0 px-4 py-2 rounded-lg text-sm font-bold flex items-center ${superTab==='info'?'bg-amber-500 text-slate-900 shadow-sm':'text-slate-300 hover:bg-slate-700'}`}><Article size={18} className="mr-2"/> Info Global</button>
          </div>
          <div className="flex items-center gap-2 justify-between w-full md:w-auto mt-2 md:mt-0">
              <span className="text-sm font-bold text-amber-400 block md:mr-2">{session.data.name}</span>
              {isSwitchableAccount() && (<button onClick={triggerRoleSwitch} className="px-3.5 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"><IconWrapper name="users-three" size={16} weight="fill" /><span className="hidden lg:inline">Ganti Peran</span></button>)}
              <button onClick={handleLogout} className="p-2.5 bg-slate-800 text-red-400 rounded-xl hover:bg-red-500 hover:text-white"><LogOut size={20} /></button>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {superTab === 'dashboard' && (
              <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center"><div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mr-5 shadow-inner"><Users size={32}/></div><div><p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Instruktur</p><h3 className="text-4xl font-extrabold text-slate-900">{regularAdmins.length}</h3></div></div>
                      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center"><div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mr-5 shadow-inner"><BookOpen size={32}/></div><div><p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Kursus</p><h3 className="text-4xl font-extrabold text-slate-900">{courses.length}</h3></div></div>
                      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center"><div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mr-5 shadow-inner"><GraduationCap size={32}/></div><div><p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Peserta</p><h3 className="text-4xl font-extrabold text-slate-900">{participants.length}</h3></div></div>
                  </div>
              </div>
          )}

          {superTab === 'requests' && (
            <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100 max-w-4xl mx-auto">
              <h2 className="font-extrabold text-slate-800 mb-8 text-2xl flex items-center"><Bell size={28} className="mr-3 text-amber-500" /> Permintaan Tambahan Kuota</h2>
              <div className="space-y-4">
                  {notifications.filter(n => n.courseId === "REQ_UPGRADE").length === 0 ? <div className="text-center p-12"><p className="text-slate-400 font-medium">Tidak ada permohonan kuota saat ini.</p></div> : notifications.filter(n => n.courseId === "REQ_UPGRADE").map(n => {
                      let details = { name: "Instruktur", username: "", reason: n.text, reqCourses: 5, reqParticipants: 50 };
                      try { details = JSON.parse(n.text); } catch(e) {}
                      return (
                        <div key={n.id} className={`flex flex-col md:flex-row justify-between p-5 md:p-6 rounded-2xl border transition group ${n.isRead ? 'bg-white border-slate-200' : 'bg-amber-50/50 border-amber-200 shadow-sm'}`}>
                            <div className="mb-4 md:mb-0">
                                <div className="flex items-center mb-2"><span className={`w-2 h-2 rounded-full mr-2 ${n.isRead ? 'bg-slate-400':'bg-amber-500'}`}></span><p className="text-base font-bold text-slate-800 leading-snug">Permintaan dari {details.name} (@{details.username})</p></div>
                                <p className="text-sm text-slate-600 ml-4 mb-3"><b>Alasan:</b> {details.reason}</p>
                                <div className="flex gap-3 ml-4">
                                    <span className="text-xs font-bold bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg">Minta +{details.reqCourses} Kelas</span>
                                    <span className="text-xs font-bold bg-emerald-50 border border-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg">Minta +{details.reqParticipants} Siswa</span>
                                </div>
                            </div>
                            {!n.isRead && (
                                <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0 items-center">
                                    <button onClick={() => handleApproveLimitRequest(n.id, n.moduleId, details.reqCourses, details.reqParticipants, true)} className="flex-1 md:flex-none bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5"><CheckCircle2 size={16} weight="bold" /><span>Setujui</span></button>
                                    <button onClick={() => handleApproveLimitRequest(n.id, n.moduleId, details.reqCourses, details.reqParticipants, false)} className="flex-1 md:flex-none bg-rose-100 text-rose-700 border border-rose-200 px-5 py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5"><X size={16} weight="bold" /><span>Tolak</span></button>
                                </div>
                            )}
                        </div>
                      );
                  })}
              </div>
            </div>
          )}

          {superTab === 'info' && (
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 max-w-3xl mx-auto">
                <h2 className="font-extrabold text-slate-800 mb-2 text-2xl flex items-center"><Article size={28} className="mr-3 text-amber-500" /> Papan Informasi Global</h2>
                <div className="space-y-8 mt-6">
                    <div className="bg-slate-50 p-5 md:p-6 rounded-2xl border border-slate-200">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3"><h3 className="font-bold text-slate-800 text-lg flex items-center"><Users size={20} className="mr-2 text-slate-400"/> Untuk Seluruh Instruktur</h3><button onClick={() => setInfoSuperForm({...infoSuperForm, showInst: !infoSuperForm.showInst})} className={`flex items-center text-sm font-bold px-4 py-2 rounded-full w-full sm:w-auto justify-center ${infoSuperForm.showInst ? 'bg-emerald-100 text-emerald-700' : 'bg-white border text-slate-500'}`}>{infoSuperForm.showInst ? <ToggleRight size={22} className="mr-2" weight="fill"/> : <ToggleLeft size={22} className="mr-2"/>} {infoSuperForm.showInst ? 'Aktif' : 'Sembunyi'}</button></div>
                        <textarea value={infoSuperForm.instText} onChange={e => setInfoSuperForm({...infoSuperForm, instText: e.target.value})} maxLength={1000} className="w-full p-4 border rounded-xl resize-none text-base" rows="3" placeholder="Tulis informasi..."></textarea>
                    </div>
                    <div className="bg-slate-50 p-5 md:p-6 rounded-2xl border border-slate-200">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3"><h3 className="font-bold text-slate-800 text-lg flex items-center"><GraduationCap size={20} className="mr-2 text-slate-400"/> Untuk Seluruh Peserta</h3><button onClick={() => setInfoSuperForm({...infoSuperForm, showPart: !infoSuperForm.showPart})} className={`flex items-center text-sm font-bold px-4 py-2 rounded-full w-full sm:w-auto justify-center ${infoSuperForm.showPart ? 'bg-emerald-100 text-emerald-700' : 'bg-white border text-slate-500'}`}>{infoSuperForm.showPart ? <ToggleRight size={22} className="mr-2" weight="fill"/> : <ToggleLeft size={22} className="mr-2"/>} {infoSuperForm.showPart ? 'Aktif' : 'Sembunyi'}</button></div>
                        <textarea value={infoSuperForm.partText} onChange={e => setInfoSuperForm({...infoSuperForm, partText: e.target.value})} maxLength={1000} className="w-full p-4 border rounded-xl resize-none text-base" rows="3" placeholder="Tulis informasi umum..."></textarea>
                    </div>
                    <div className="pt-6 border-t flex justify-end"><button onClick={handleUpdateAdminInfo} className="w-full sm:w-auto bg-amber-500 text-slate-900 font-bold px-8 py-3.5 rounded-xl shadow-lg">Simpan Papan Informasi</button></div>
                </div>
            </div>
          )}

          {superTab === 'instructors' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-fit">
                <h2 className="font-bold text-slate-800 mb-6 flex items-center text-lg"><PlusCircle size={22} className="mr-2 text-indigo-600" />Tambah Instruktur</h2>
                <form onSubmit={handleRegisterAdmin} className="space-y-4">
                  <input name="name" required maxLength={60} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Nama Lengkap"/>
                  <input name="username" required maxLength={30} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Username Khusus"/>
                  <input name="email" type="email" required maxLength={100} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Email Instruktur Aktif"/>
                  <input name="password" required maxLength={30} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" defaultValue="GURU123" placeholder="Password"/>
                  <div className="grid grid-cols-2 gap-3 border-t pt-4">
                    <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase block">Batas Kelas</label><input name="maxCourses" type="number" min="1" required defaultValue="5" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800" /></div>
                    <div className="space-y-1"><label className="text-[10px] font-bold text-slate-400 uppercase block">Batas Siswa</label><input name="maxParticipants" type="number" min="1" required defaultValue="50" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800" /></div>
                  </div>
                  <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-md mt-2">Buat Akun Instruktur</button>
                </form>
              </div>
              <div className="xl:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="font-bold text-slate-800 text-lg flex items-center"><Users size={22} className="mr-2 text-slate-400"/>Daftar Instruktur Aktif</h2>
                    <div className="relative w-full sm:w-auto"><MagnifyingGlass size={18} className="absolute left-3 top-3 text-slate-400"/><input type="text" placeholder="Cari instruktur..." value={searchInst} onChange={e=>setSearchInst(e.target.value)} className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"/></div>
                </div>
                <div className="overflow-x-auto min-w-full">
                    <table className="w-full text-left whitespace-nowrap"><thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider"><tr><th className="p-4 rounded-tl-xl">Status</th><th className="p-4">Nama Lengkap</th><th className="p-4">Username</th><th className="p-4">Sisa Kuota (K/S)</th><th className="p-4 text-right rounded-tr-xl">Manajemen</th></tr></thead><tbody className="divide-y divide-slate-100 text-sm">
                          {filteredAdmins.length === 0 ? <tr><td colSpan="5" className="p-8 text-center text-slate-400 italic">Tidak ada instruktur ditemukan.</td></tr> : filteredAdmins.map(adm => (<tr key={adm.id} className={`hover:bg-slate-50 transition ${!adm.isActive ? 'opacity-60 bg-slate-50' : ''}`}>
                              <td className="p-4">{adm.isActive ? <span className="text-emerald-700 font-bold text-[10px] bg-emerald-100 px-3 py-1.5 rounded border border-emerald-200">Aktif</span> : <span className="text-red-700 font-bold text-[10px] bg-red-100 px-3 py-1.5 rounded border border-red-200">Nonaktif</span>}</td>
                              <td className="p-4 font-bold text-slate-800">{adm.name}</td>
                              <td className="p-4 font-mono text-slate-500">{adm.username}</td>
                              <td className="p-4 font-bold text-slate-700 font-mono"><span className="text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-lg text-xs">{adm.maxCourses || 0} K</span><span className="mx-1 text-slate-300">/</span><span className="text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg text-xs">{adm.maxParticipants || 0} S</span></td>
                              <td className="p-4 text-right flex justify-end space-x-2">
                                  <button onClick={() => handleTogglePromo(adm.id, adm.allowPromo)} className={`text-xs px-3 py-2 rounded-lg font-bold flex items-center gap-1 shadow-sm ${adm.allowPromo ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}><IconWrapper name="crown" size={14} weight={adm.allowPromo ? "fill" : "regular"} /><span className="hidden xl:inline">{adm.allowPromo ? 'Cabut Promo' : 'Beri Promo'}</span></button>
                                  <button onClick={() => setQuotaModal({ isOpen: true, adminId: adm.id, name: adm.name, maxCourses: adm.maxCourses || 5, maxParticipants: adm.maxParticipants || 50 })} className="text-xs bg-slate-900 text-white px-3 py-2 rounded-lg flex items-center gap-1 shadow-sm"><IconWrapper name="sliders" size={14} /><span>Kuota</span></button>
                                  <button onClick={()=>handleToggleActiveAdmin(adm.id, adm.isActive)} className={`text-xs px-3 py-2 rounded-lg font-bold ${adm.isActive ? 'bg-white border border-red-200 text-red-600' : 'bg-emerald-600 text-white'}`}>{adm.isActive ? 'Nonaktifkan' : 'Aktifkan Akun'}</button>
                              </td>
                          </tr>))}
                    </tbody></table>
                </div>
              </div>
            </div>
          )}
          {superTab === 'courses' && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <h2 className="font-bold text-slate-800 text-lg flex items-center"><BookOpen size={22} className="mr-2 text-slate-400"/>Katalog Semua Kursus</h2>
                  <div className="relative w-full sm:w-auto"><MagnifyingGlass size={18} className="absolute left-3 top-3 text-slate-400"/><input type="text" placeholder="Cari kursus/kode..." value={searchCourse} onChange={e=>setSearchCourse(e.target.value)} className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"/></div>
              </div>
              <div className="overflow-x-auto min-w-full"><table className="w-full text-left whitespace-nowrap"><thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider"><tr><th className="p-4 rounded-tl-xl">Status</th><th className="p-4">Kode</th><th className="p-4">Nama Kursus</th><th className="p-4">Instruktur</th><th className="p-4 text-right rounded-tr-xl">Aksi</th></tr></thead><tbody className="divide-y divide-slate-100 text-sm">
                      {filteredCourses.length === 0 ? <tr><td colSpan="5" className="p-8 text-center text-slate-400 italic">Tidak ada kursus ditemukan.</td></tr> : filteredCourses.map(crs => (<tr key={crs.id} className={`hover:bg-slate-50 transition ${!crs.isActive ? 'opacity-60 bg-slate-50' : ''}`}>
                          <td className="p-4">{crs.isActive ? <span className="text-emerald-700 font-bold text-[10px] uppercase bg-emerald-100 px-3 py-1.5 rounded-md border border-emerald-200">Aktif</span> : <span className="text-red-700 font-bold text-[10px] uppercase bg-red-100 px-3 py-1.5 rounded-md border border-red-200">Nonaktif</span>}</td>
                          <td className="p-4"><span className="font-mono font-black text-base bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl border border-indigo-200">{crs.code}</span></td><td className="p-4 font-bold text-slate-800">{crs.title}</td><td className="p-4 text-slate-600">{crs.instructor}</td>
                          <td className="p-4 text-right"><button onClick={() => handleToggleActiveCourse(crs.id, crs.isActive)} className="text-xs px-4 py-2 rounded-lg font-bold bg-white border border-red-200 text-red-600">Tutup Kelas</button></td>
                      </tr>))}
              </tbody></table></div>
            </div>
          )}
          {superTab === 'participants' && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <h2 className="font-bold text-slate-800 text-lg flex items-center"><GraduationCap size={22} className="mr-2 text-slate-400"/>Progress Belajar Global</h2>
                  <div className="relative w-full sm:w-auto"><MagnifyingGlass size={18} className="absolute left-3 top-3 text-slate-400"/><input type="text" placeholder="Cari nama peserta..." value={searchPart} onChange={e=>setSearchPart(e.target.value)} className="w-full sm:w-64 pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"/></div>
              </div>
              <div className="overflow-x-auto min-w-full"><table className="w-full text-left whitespace-nowrap"><thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider"><tr><th className="p-4 rounded-tl-xl">Nama Peserta</th><th className="p-4">Kelas Diikuti</th><th className="p-4">Progress</th><th className="p-4">Skor Ujian</th><th className="p-4 rounded-tr-xl">Status Akhir</th></tr></thead><tbody className="divide-y divide-slate-100 text-sm">
                      {filteredEnrs.length === 0 ? <tr><td colSpan="5" className="p-8 text-center text-slate-400 italic">Tidak ada data progress.</td></tr> : filteredEnrs.map((enr, i) => (<tr key={i} className="hover:bg-slate-50 transition"><td className="p-4 font-bold text-slate-800">{enr.pName}</td><td className="p-4 text-slate-600">{enr.cTitle}</td><td className="p-4"><div className="flex items-center"><div className="w-16 bg-slate-200 rounded-full h-2 mr-2"><div className="h-2 rounded-full bg-emerald-500" style={{width:`${enr.prog}%`}}></div></div><span className="font-mono text-xs">{enr.prog}%</span></div></td><td className="p-4 font-bold text-slate-700">{enr.examScore !== null ? enr.examScore : '-'}</td><td className="p-4">{enr.isGraduated ? <span className="text-emerald-700 font-bold text-[10px] uppercase bg-emerald-100 px-2 py-1 rounded border border-emerald-200"><Award size={12} className="inline mr-1 pb-0.5"/>Lulus</span> : <span className="text-blue-700 font-bold text-[10px] uppercase bg-blue-50 px-2 py-1 rounded border border-blue-200">Belajar</span>}</td></tr>))}
              </tbody></table></div>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
}

ReactDOM.createRoot(document.getElementById('root')).render(<SuperApp />);