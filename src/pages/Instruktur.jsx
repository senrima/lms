import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';

const _0xDbChunks = ["aHR0cHM6Ly9zY3JpcHQuZ29v", "Z2xlLmNvbS9tYWNyb3Mvcy9B", "S2Z5Y2J6RXdlUkQ2dTVmeGVH", "SEtOR0VJTFhZOWkzcXhibTdP", "QVlMZHRaeGxHdmdEOXhDb01D", "aUN3OGJDbmpDLXhad3cxbksv", "ZXhlYw=="];
//const DEFAULT_SHEETS_URL = atob(_0xDbChunks.join(""));
const DEFAULT_SHEETS_URL = "https://lms.senrima-ms.workers.dev/?kunci=RAHASIA-S-TOOLS";
const LOGIN_PORTAL_URL = "https://s-tools.id/edu/page-instruktur.html";

if (localStorage.getItem('edu_sheets_url') !== DEFAULT_SHEETS_URL) {
    localStorage.setItem('edu_sheets_url', DEFAULT_SHEETS_URL);
}

const IconWrapper = ({ name, size = 24, className = "", weight="regular" }) => <i className={`ph${weight === 'fill' ? '-fill' : weight === 'duotone' ? '-duotone' : weight === 'bold' ? '-bold' : ''} ph-${name} ${className}`} style={{ fontSize: size }}></i>;
const Database = (p) => <IconWrapper name="database" {...p} />; const Book = (p) => <IconWrapper name="book" {...p} />; const Users = (p) => <IconWrapper name="users" {...p} />; const MessageSquare = (p) => <IconWrapper name="chat-circle" {...p} />; const Article = (p) => <IconWrapper name="article" {...p} />; const UserIcon = (p) => <IconWrapper name="user" {...p} />; const LogOut = (p) => <IconWrapper name="sign-out" {...p} />; const PlusCircle = (p) => <IconWrapper name="plus-circle" {...p} />; const Video = (p) => <IconWrapper name="video" {...p} />; const RefreshCw = (p) => <IconWrapper name="arrows-clockwise" {...p} />; const CheckCircle2 = (p) => <IconWrapper name="check-circle" {...p} />; const X = (p) => <IconWrapper name="x" {...p} />; const BookOpen = (p) => <IconWrapper name="book-open" {...p} />; const ChevronRight = (p) => <IconWrapper name="caret-right" {...p} />; const CheckSquareOffset = (p) => <IconWrapper name="check-square-offset" {...p} />; const Trash2 = (p) => <IconWrapper name="trash" {...p} />; const GraduationCap = (p) => <IconWrapper name="graduation-cap" {...p} />; const AlertCircle = (p) => <IconWrapper name="warning-circle" {...p} />; const ToggleLeft = (p) => <IconWrapper name="toggle-left" {...p} />; const ToggleRight = (p) => <IconWrapper name="toggle-right" {...p} />; const ArrowLeft = (p) => <IconWrapper name="arrow-left" {...p} />; const PlayCircle = (p) => <IconWrapper name="play-circle" {...p} />; const Menu = (p) => <IconWrapper name="list" {...p} />; const Coffee = (p) => <IconWrapper name="coffee" {...p} />; const Lock = (p) => <IconWrapper name="lock" {...p} />; const MagnifyingGlass = (p) => <IconWrapper name="magnifying-glass" {...p} />; const Bell = (p) => <IconWrapper name="bell" {...p} />;

const emptyExam = { minScore: 70, questions: Array.from({length: 10}, () => ({ q: '', options: ['','','',''], answer: 0 })) };

const formatVideoUrl = (rawUrl) => {
    if (!rawUrl) return ""; let url = rawUrl.trim();
    try {
      if (url.includes('youtu.be/')) return `https://www.youtube.com/embed/${url.split('youtu.be/')[1].split('?')[0].split('&')[0]}`;
      if (url.includes('youtube.com/watch')) return `https://www.youtube.com/embed/${new URL(url).searchParams.get('v')}`;
      if (url.includes('youtube.com/shorts/')) return `https://www.youtube.com/embed/${url.split('shorts/')[1].split('?')[0].split('&')[0]}`;
      if (url.includes('drive.google.com/file/d/')) return `https://drive.google.com/file/d/${url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)[1]}/preview`;
    } catch (e) {} return url;
};

const calcProgress = (enr, crs) => { 
    if (!crs || !crs.modules || crs.modules.length === 0 || !enr) return 0; 
    if (enr.isGraduated) return 100;
    let completedArray = Array.isArray(enr.completedModules) ? enr.completedModules : (typeof enr.completedModules === 'string' ? JSON.parse(enr.completedModules || "[]") : []);
    let prog = Math.round((completedArray.length / crs.modules.length) * 100); 
    return prog > 100 ? 100 : prog;
};

const PromoTimer = () => {
    const [timeLeft, setTimeLeft] = useState("");
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date(); const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59); const diff = endOfDay - now;
            if (diff <= 0) setTimeLeft("00:00:00");
            else setTimeLeft(`${Math.floor((diff / 3600000) % 24).toString().padStart(2, '0')}:${Math.floor((diff / 60000) % 60).toString().padStart(2, '0')}:${Math.floor((diff / 1000) % 60).toString().padStart(2, '0')}`);
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    if(!timeLeft) return null;
    return (<div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-600 px-5 py-2.5 rounded-full mb-6 shadow-sm animate-pulse mx-auto"><IconWrapper name="timer" size={20} weight="bold" /><span className="text-sm font-bold">Promo Diskon Berakhir Hari Ini: <span className="font-mono text-base ml-1 tracking-widest">{timeLeft}</span></span></div>);
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

function InstrukturApp() {
  const [dbMode] = useState(() => localStorage.getItem('edu_db_mode') || 'sheets');
  const [dbReady, setDbReady] = useState(false);
  const [setupError, setSetupError] = useState("");
  const [session, setSession] = useState(() => JSON.parse(sessionStorage.getItem('edu_session')) || null);
  
  const [admins, setAdmins] = useState([]);
  const [courses, setCourses] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [appMode, setAppMode] = useState('admin_dashboard');
  const [adminTab, setAdminTab] = useState("courses"); 
  const [searchCourse, setSearchCourse] = useState("");
  const [searchPart, setSearchPart] = useState("");
  const [toast, setToast] = useState(null);
  
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, message: "", onConfirm: null });
  const [examModalOpen, setExamModalOpen] = useState(false);
  const [examCourseId, setExamCourseId] = useState(null);
  const [examForm, setExamForm] = useState(emptyExam);
  
  const [reqQuotaModal, setReqQuotaModal] = useState({ isOpen: false, reason: "", reqCourses: 5, reqParticipants: 50 });
  const [showPricingModal, setShowPricingModal] = useState(false);

  const [profileForm, setProfileForm] = useState({ donationLink: "", whatsapp: "" });
  const [infoInstForm, setInfoInstForm] = useState({ text: '', show: false }); 

  const [activeCourse, setActiveCourse] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    if (!session || session.role !== 'admin') window.location.href = 'index.html';
  }, [session]);

  useEffect(() => {
    if (appMode === 'setup_db') return;
    if (dbMode === 'local') {
      setAdmins(JSON.parse(localStorage.getItem('edu_admins')) || []);
      setCourses(normalizeCourses(JSON.parse(localStorage.getItem('edu_courses')) || []));
      setParticipants(JSON.parse(localStorage.getItem('edu_participants')) || []);
      setEnrollments(JSON.parse(localStorage.getItem('edu_enrollments')) || []);
      setNotifications(JSON.parse(localStorage.getItem('edu_notifications')) || []);
      
      if (session?.role === 'admin') {
          const myData = (JSON.parse(localStorage.getItem('edu_admins')) || []).find(a => String(a.id) === String(session?.data?.id));
          if (myData) { setProfileForm({ donationLink: myData.donationLink || "", whatsapp: myData.whatsapp || "" }); setInfoInstForm({ text: myData.info3 || '', show: myData.showInfo3 || false }); }
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
            
            const myData = data.admins?.find(a => String(a.id) === String(session?.data?.id));
            if (myData) { setProfileForm({ donationLink: myData.donationLink || "", whatsapp: myData.whatsapp || "" }); setInfoInstForm({ text: myData.info3 || '', show: myData.showInfo3 || false }); }
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
    setSession(null); sessionStorage.removeItem('edu_session');
    window.location.href = LOGIN_PORTAL_URL;
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

  const PricingModal = () => {
      if (!showPricingModal) return null;
      const getPaymentLink = (amount, item) => {
          const user = admins.find(a => String(a.id) === String(session.data.id)) || session.data;
          const email = encodeURIComponent(user.email || `${user.username}@edulearn.local`);
          return `https://s-tools.id/payment/index.html?amount=${amount}&item=${encodeURIComponent(item)}&kode_aplikasi=APP-STOOLS&email=${email}&name=${encodeURIComponent(user.name || user.username)}`;
      };
      return (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]">
              <div className="bg-white rounded-[2rem] w-full max-w-5xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
                  <div className="p-6 md:p-8 text-center relative border-b flex flex-col items-center">
                      <button onClick={() => setShowPricingModal(false)} className="absolute top-6 right-6 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500"><X size={20} weight="bold"/></button>
                      <PromoTimer />
                      <h2 className="text-2xl md:text-3xl font-black text-slate-900">Upgrade Kapasitas Sistem</h2>
                  </div>
                  <div className="p-6 md:p-10 overflow-y-auto bg-slate-50 flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto items-stretch">
                          <div className="bg-white rounded-3xl p-6 md:p-8 border shadow-sm flex flex-col hover:-translate-y-1 transition">
                              <h3 className="text-xl font-bold text-center mb-4">Paket Starter</h3>
                              <div className="text-center mb-6"><span className="text-3xl font-black">Rp 50.000</span></div>
                              <div className="space-y-4 flex-1 mb-8 text-sm font-bold text-slate-700">
                                  <p className="flex items-center gap-3"><CheckCircle2 size={20} className="text-emerald-500" weight="fill"/> +5 Kelas & +50 Siswa</p>
                              </div>
                              <a href={getPaymentLink(50000, "Paket Starter EduLearn")} target="_blank" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex justify-center items-center">Pilih Starter</a>
                          </div>
                          <div className="bg-indigo-50/50 rounded-3xl p-6 md:p-8 border-2 border-indigo-500 shadow-xl flex flex-col transform md:scale-105">
                              <div className="absolute top-0 inset-x-0 flex justify-center"><span className="bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-b-xl">Paling Laris</span></div>
                              <h3 className="text-xl font-bold text-center mb-4 mt-2">Paket Pro</h3>
                              <div className="text-center mb-6"><span className="text-4xl font-black">Rp 120.000</span></div>
                              <div className="space-y-4 flex-1 mb-8 text-sm font-bold text-slate-800">
                                  <p className="flex items-center gap-3"><CheckCircle2 size={20} className="text-indigo-600" weight="fill"/> +15 Kelas & +200 Siswa</p>
                                  <p className="flex items-center gap-3 border-t border-indigo-100 pt-3"><CheckCircle2 size={20} className="text-indigo-600" weight="fill"/> Etalase Promo Publik</p>
                              </div>
                              <a href={getPaymentLink(120000, "Paket Pro EduLearn")} target="_blank" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex justify-center items-center">Pilih Pro</a>
                          </div>
                          <div className="bg-white rounded-3xl p-6 md:p-8 border shadow-sm flex flex-col hover:-translate-y-1 transition">
                              <h3 className="text-xl font-bold text-center mb-4">Paket Enterprise</h3>
                              <div className="text-center mb-6"><span className="text-3xl font-black">Rp 250.000</span></div>
                              <div className="space-y-4 flex-1 mb-8 text-sm font-bold text-slate-700">
                                  <p className="flex items-center gap-3"><CheckCircle2 size={20} className="text-emerald-500" weight="fill"/> +50 Kelas & +1000 Siswa</p>
                              </div>
                              <a href={getPaymentLink(250000, "Paket Enterprise EduLearn")} target="_blank" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex justify-center items-center">Pilih Enterprise</a>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  const RequestQuotaModal = () => {
     if (!reqQuotaModal.isOpen) return null;
     return (
         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
             <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl">
                 <div className="flex justify-between items-center border-b pb-4 mb-6"><div><h3 className="text-lg font-black text-slate-900">Ajukan Tambahan Kuota</h3></div><button onClick={() => setReqQuotaModal({ ...reqQuotaModal, isOpen: false })} className="w-8 h-8 rounded-full bg-slate-100"><X size={16} /></button></div>
                 <form onSubmit={handleRequestLimitIncrease} className="space-y-4">
                     <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase block">Tambahan Kelas</label><input type="number" min="1" required value={reqQuotaModal.reqCourses} onChange={e => setReqQuotaModal({ ...reqQuotaModal, reqCourses: parseInt(e.target.value)||0 })} className="w-full p-3 bg-slate-50 border rounded-xl font-bold" /></div>
                         <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase block">Tambahan Siswa</label><input type="number" min="1" required value={reqQuotaModal.reqParticipants} onChange={e => setReqQuotaModal({ ...reqQuotaModal, reqParticipants: parseInt(e.target.value)||0 })} className="w-full p-3 bg-slate-50 border rounded-xl font-bold" /></div>
                     </div>
                     <div className="space-y-1"><label className="text-xs font-bold text-slate-500 uppercase block">Alasan Pengajuan</label><textarea required rows="3" value={reqQuotaModal.reason} onChange={e => setReqQuotaModal({ ...reqQuotaModal, reason: e.target.value })} className="w-full p-3.5 bg-slate-50 border rounded-xl"></textarea></div>
                     <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl">Kirim Pengajuan Resmi</button>
                 </form>
             </div>
         </div>
     );
  };

  const ManageExamModal = () => {
    if (!examModalOpen) return null;
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm">
        <div className="bg-white rounded-3xl w-full max-w-3xl flex flex-col max-h-[90vh]">
            <div className="p-5 border-b flex justify-between items-center bg-slate-50 rounded-t-3xl">
                <h2 className="text-xl font-bold">Pembuat Ujian Kelulusan</h2><button onClick={()=>setExamModalOpen(false)} className="text-slate-600"><X size={24}/></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200">
                    <label className="font-bold text-amber-900 block mb-2">Target Minimal Kelulusan</label>
                    <input type="number" min="0" max="100" value={examForm.minScore} onChange={e=>setExamForm({...examForm, minScore: parseInt(e.target.value)})} className="p-3 border rounded-xl font-bold" />
                </div>
                {examForm.questions.map((q, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-2xl border shadow-sm">
                        <label className="font-bold block mb-3">Soal {idx+1}</label>
                        <textarea value={q.q} onChange={e=>{const newQ = [...examForm.questions]; newQ[idx].q = e.target.value; setExamForm({...examForm, questions: newQ});}} className="w-full p-3 mb-4 border rounded-xl" placeholder="Tulis soal..." required></textarea>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {q.options.map((opt, optIdx) => (<input key={optIdx} type="text" value={opt} onChange={e=>{const newQ = [...examForm.questions]; newQ[idx].options[optIdx] = e.target.value; setExamForm({...examForm, questions: newQ});}} className="p-3 border rounded-xl" placeholder={`Opsi ${optIdx+1}`} required />))}
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl flex justify-between items-center"><label className="text-sm font-bold">Jawaban Benar:</label><select value={q.answer} onChange={e=>{const newQ = [...examForm.questions]; newQ[idx].answer = parseInt(e.target.value); setExamForm({...examForm, questions: newQ});}} className="p-2 border rounded-lg font-bold">{q.options.map((_, optIdx) => <option key={optIdx} value={optIdx}>Opsi {optIdx+1}</option>)}</select></div>
                    </div>
                ))}
            </div>
            <div className="p-6 border-t bg-white rounded-b-3xl flex justify-end gap-4"><button onClick={handleSaveExam} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold">Simpan Ujian</button></div>
        </div>
      </div>
    )
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault(); const fd = new FormData(e.target); const code = fd.get('code').trim().toUpperCase();
    if (courses.some(c => c.code === code)) return showToast("Kode sudah ada!");
    const myAdmin = admins.find(a => String(a.id) === String(session.data.id));
    if (myAdmin.maxCourses <= 0) { setConfirmDialog({ isOpen: true, message: "Kuota kelas habis (0).", onConfirm: null }); return; }

    const courseData = { authorId: session.data.id, code, title: fd.get('title'), instructor: fd.get('inst'), isActive: true, docLink: fd.get('docLink'), modules: [], exam: emptyExam };
    await execDbAction(() => {
        const updatedAdmins = admins.map(a => String(a.id) === String(session.data.id) ? { ...a, maxCourses: a.maxCourses - 1 } : a);
        setAdmins(updatedAdmins); localStorage.setItem('edu_admins', JSON.stringify(updatedAdmins));
        const updatedCourses = [...courses, { id: `c_${Date.now()}`, ...courseData }];
        setCourses(updatedCourses); localStorage.setItem('edu_courses', JSON.stringify(updatedCourses));
    }); e.target.reset(); showToast("Kursus dibuat!");
  };

  const handleCreateModule = async (e) => {
    e.preventDefault(); const fd = new FormData(e.target); const courseId = fd.get('courseId');
    if (enrollments.some(en => String(en.courseId) === String(courseId) && en.isGraduated)) {
        setConfirmDialog({ isOpen: true, message: "Ditolak! Ada peserta lulus.", onConfirm: null }); return;
    }
    const newModule = { id: `m_${Date.now()}`, title: fd.get('title'), videoUrl: formatVideoUrl(fd.get('vidUrl')), description: fd.get('desc'), comments: [] };
    await execDbAction(() => {
        const updated = courses.map(c => c.id === courseId ? { ...c, modules: [...c.modules, newModule] } : c);
        setCourses(updated); localStorage.setItem('edu_courses', JSON.stringify(updated));
    }); e.target.reset(); showToast("Materi ditambah!");
  };

  const handleDeleteModule = (courseId, moduleId) => {
    if (enrollments.some(en => String(en.courseId) === String(courseId) && en.isGraduated)) {
        setConfirmDialog({ isOpen: true, message: "Ditolak! Ada peserta lulus.", onConfirm: null }); return;
    }
    setConfirmDialog({ isOpen: true, message: "Hapus materi video ini?", onConfirm: async () => {
        setConfirmDialog({ isOpen: false }); 
        await execDbAction(() => {
            const updated = courses.map(c => c.id === courseId ? { ...c, modules: c.modules.filter(m => m.id !== moduleId) } : c);
            setCourses(updated); localStorage.setItem('edu_courses', JSON.stringify(updated));
        }); showToast("Materi dihapus.");
    }});
  };

  const handleUpdateAdminInfo = async () => {
      await execDbAction(() => {
          const updatedA = admins.map(a => String(a.username).trim().toLowerCase() === String(session.data.username).trim().toLowerCase() ? { ...a, info3: infoInstForm.text, showInfo3: infoInstForm.show } : a);
          setAdmins(updatedA); localStorage.setItem('edu_admins', JSON.stringify(updatedA));
      }); showToast("Papan Informasi Diperbarui!");
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    await execDbAction(() => {
        const updatedA = admins.map(a => String(a.username).trim().toLowerCase() === String(session.data.username).trim().toLowerCase() ? { ...a, donationLink: profileForm.donationLink, whatsapp: profileForm.whatsapp } : a);
        setAdmins(updatedA); localStorage.setItem('edu_admins', JSON.stringify(updatedA));
    }); showToast("Profil Publik diperbarui!");
  };

  const openExamBuilder = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    let currentExam = course.exam ? JSON.parse(JSON.stringify(course.exam)) : JSON.parse(JSON.stringify(emptyExam));
    setExamCourseId(courseId); setExamForm(currentExam); setExamModalOpen(true);
  };

  const handleSaveExam = async () => {
    await execDbAction(() => {
        const updated = courses.map(c => c.id === examCourseId ? { ...c, exam: examForm } : c);
        setCourses(updated); localStorage.setItem('edu_courses', JSON.stringify(updated));
    }); setExamModalOpen(false); showToast("Ujian disimpan!");
  };

  const handleRegisterParticipant = async (e) => {
    e.preventDefault(); const fd = new FormData(e.target); const email = fd.get('email').trim().toLowerCase();
    if (participants.some(p => p.email === email)) return showToast("Email sudah terdaftar!");
    const myAdmin = admins.find(a => String(a.id) === String(session.data.id));
    if (myAdmin.maxParticipants <= 0) { setConfirmDialog({ isOpen: true, message: "Kuota pendaftaran habis (0).", onConfirm: null }); return; }

    const newPart = { id: `p_${Date.now()}`, name: fd.get('name').trim(), email, accessCode: fd.get('code').trim() };
    const newEnr = { id: `e_${Date.now()}`, participantId: newPart.id, courseId: fd.get('courseId'), completedModules: [], isGraduated: false, certDownloaded: false, examScore: null };
    await execDbAction(() => {
        const updatedAdmins = admins.map(a => String(a.id) === String(session.data.id) ? { ...a, maxParticipants: a.maxParticipants - 1 } : a);
        setAdmins(updatedAdmins); localStorage.setItem('edu_admins', JSON.stringify(updatedAdmins));
        setParticipants([...participants, newPart]); localStorage.setItem('edu_participants', JSON.stringify([...participants, newPart]));
        setEnrollments([...enrollments, newEnr]); localStorage.setItem('edu_enrollments', JSON.stringify([...enrollments, newEnr]));
    }); e.target.reset(); showToast("Peserta terdaftar!");
  };

  const handleEnrollExisting = async (e) => {
    e.preventDefault(); const fd = new FormData(e.target); const email = fd.get('email').trim().toLowerCase(); const cId = fd.get('cId');
    const participant = participants.find(p => p.email === email); if (!participant) return showToast("Peserta tidak ditemukan!");
    if(enrollments.some(en => String(en.participantId) === String(participant.id) && String(en.courseId) === String(cId))) return showToast("Sudah terdaftar!");
    const myAdmin = admins.find(a => String(a.id) === String(session.data.id));
    if (myAdmin.maxParticipants <= 0) { setConfirmDialog({ isOpen: true, message: "Kuota siswa habis (0).", onConfirm: null }); return; }
    
    await execDbAction(() => {
        const updatedAdmins = admins.map(a => String(a.id) === String(session.data.id) ? { ...a, maxParticipants: a.maxParticipants - 1 } : a);
        setAdmins(updatedAdmins); localStorage.setItem('edu_admins', JSON.stringify(updatedAdmins));
        const updatedE = [...enrollments, { id: `e_${Date.now()}`, participantId: participant.id, courseId: cId, completedModules: [], isGraduated: false, examScore: null }];
        setEnrollments(updatedE); localStorage.setItem('edu_enrollments', JSON.stringify(updatedE));
    }); showToast("Ditambahkan ke kelas!");
  };

  const handleRequestLimitIncrease = async (e) => {
    e.preventDefault(); const myAdmin = admins.find(a => String(a.id) === String(session.data.id));
    if (notifications.some(n => n.courseId === "REQ_UPGRADE" && n.moduleId === myAdmin.id && !n.isRead)) return showToast("Ada permintaan tertunda!");
    const reqDetails = { name: myAdmin.name, username: myAdmin.username, reason: reqQuotaModal.reason.trim(), reqCourses: parseInt(reqQuotaModal.reqCourses) || 5, reqParticipants: parseInt(reqQuotaModal.reqParticipants) || 50 };
    const superId = admins.find(a => a.isSuper === true || a.isSuper === 'true' || a.isSuper === 'TRUE')?.id || 'adm_super_rahasia';
    await execDbAction(() => {
        const updatedN = [{ id: `n_req_${Date.now()}`, adminId: superId, text: JSON.stringify(reqDetails), isRead: false, time: "Baru saja", courseId: "REQ_UPGRADE", moduleId: myAdmin.id }, ...notifications];
        setNotifications(updatedN); localStorage.setItem('edu_notifications', JSON.stringify(updatedN));
    });
    setReqQuotaModal({ isOpen: false, reason: "", reqCourses: 5, reqParticipants: 50 }); setConfirmDialog({ isOpen: true, message: "Pengajuan kuota terkirim.", onConfirm: null });
  };

  const markNotifsRead = async () => {
    await execDbAction(() => {
        const updatedN = notifications.map(n => String(n.adminId) === String(session.data.id) ? { ...n, isRead: true } : n);
        setNotifications(updatedN); localStorage.setItem('edu_notifications', JSON.stringify(updatedN));
    });
  };

  const jumpToClassroom = (courseId, targetModuleId = null) => {
    const course = courses.find(c => c.id === courseId); let modToOpen = course.modules[0] || null;
    if (targetModuleId) modToOpen = course.modules.find(m => m.id === targetModuleId) || modToOpen;
    setActiveCourse(course); setActiveModule(modToOpen); setAppMode('classroom');
  };

  const handlePostComment = async (e) => {
    e.preventDefault(); if (!commentText.trim()) return;
    const newComment = { id: `cmt_${Date.now()}`, user: `${session.data.name} (Instruktur)`, text: commentText, isAdmin: true, time: "Baru saja" };
    const updatedMods = activeCourse.modules.map(m => m.id === activeModule.id ? { ...m, comments: [...m.comments, newComment] } : m);
    await execDbAction(() => {
        const updatedC = courses.map(c => c.id === activeCourse.id ? { ...c, modules: updatedMods } : c);
        setCourses(updatedC); localStorage.setItem('edu_courses', JSON.stringify(updatedC));
    });
    setActiveCourse(prev => ({ ...prev, modules: updatedMods })); setActiveModule(prev => ({ ...prev, comments: [...prev.comments, newComment] })); 
    setCommentText(""); showToast("Balasan terkirim!");
  };

  if (!dbReady && appMode !== 'setup_db') return <div className="min-h-screen flex items-center justify-center"><h2 className="text-xl font-bold">Menghubungkan ke Database...</h2></div>;

  const safeLower = (str) => (str || '').toString().toLowerCase();
  const myAdmin = admins.find(a => String(a.id) === String(session.data.id)) || session.data;
  const myCourses = courses.filter(c => { const authorAdmin = admins.find(a => String(a.id) === String(c.authorId)); return authorAdmin && String(authorAdmin.username).trim().toLowerCase() === String(session.data.username).trim().toLowerCase(); });
  const filteredMyCourses = myCourses.filter(c => safeLower(c.title).includes(safeLower(searchCourse)) || safeLower(c.code).includes(safeLower(searchCourse)));
  const myNotifs = notifications.filter(n => n.courseId !== "REQ_UPGRADE" && String(n.adminId) === String(session.data.id));
  const unread = myNotifs.filter(n => !n.isRead).length;
  const myEnrollments = enrollments.filter(e => myCourses.some(c=>String(c.id) === String(e.courseId)));
  const filteredMyEnrs = myEnrollments.filter(enr => { const p = participants.find(x => String(x.id) === String(enr.participantId)); const c = courses.find(x => String(x.id) === String(enr.courseId)); return safeLower(p?.name).includes(safeLower(searchPart)) || safeLower(c?.title).includes(safeLower(searchPart)); });
  const hasPendingRequest = notifications.some(n => n.courseId === "REQ_UPGRADE" && n.moduleId === myAdmin.id && !n.isRead);

  if (appMode === 'admin_dashboard') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 animate-[fadeIn_200ms_ease-out]">
        {ConfirmModal()}{ManageExamModal()}{RequestQuotaModal()}{PricingModal()}{toast && <div className="fixed top-4 right-4 z-[100] bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2"><CheckCircle2 size={20}/><span>{toast}</span></div>}
        
        <header className="bg-slate-900 text-white px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between z-20 gap-4 shadow-md">
          <div className="flex items-center space-x-2 w-full md:w-auto justify-center md:justify-start"><Database size={28} className="text-indigo-400" /><div className="flex items-center flex-wrap justify-center gap-2"><h1 className="text-lg md:text-xl font-bold">EduLearn</h1><span className="bg-slate-800 text-indigo-400 text-[10px] md:text-xs px-2.5 py-1 rounded-md font-bold uppercase border border-slate-700">Instruktur</span></div></div>
          <div className="flex space-x-2 bg-slate-800 p-1.5 rounded-xl overflow-x-auto w-full md:w-auto snap-x">
            <button onClick={() => setAdminTab('courses')} className={`shrink-0 px-4 py-2 rounded-lg text-sm font-bold flex items-center ${adminTab==='courses'?'bg-indigo-600 text-white shadow-sm':'text-slate-300'}`}><Book size={18} className="mr-2"/> Kelas</button>
            <button onClick={() => setAdminTab('participants')} className={`shrink-0 px-4 py-2 rounded-lg text-sm font-bold flex items-center ${adminTab==='participants'?'bg-indigo-600 text-white shadow-sm':'text-slate-300'}`}><Users size={18} className="mr-2"/> Siswa</button>
            <button onClick={() => { setAdminTab('notifications'); markNotifsRead(); }} className={`shrink-0 px-4 py-2 rounded-lg text-sm font-bold flex items-center relative ${adminTab==='notifications'?'bg-indigo-600 text-white shadow-sm':'text-slate-300'}`}><MessageSquare size={18} className="mr-2"/> Forum {unread > 0 && <span className="absolute top-0.5 right-1 bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">{unread}</span>}</button>
            <button onClick={() => setAdminTab('info')} className={`shrink-0 px-4 py-2 rounded-lg text-sm font-bold flex items-center ${adminTab==='info'?'bg-indigo-600 text-white shadow-sm':'text-slate-300'}`}><Article size={18} className="mr-2"/> Papan Info</button>
            <button onClick={() => setAdminTab('profile')} className={`shrink-0 px-4 py-2 rounded-lg text-sm font-bold flex items-center ${adminTab==='profile'?'bg-indigo-600 text-white shadow-sm':'text-slate-300'}`}><UserIcon size={18} className="mr-2"/> Profil</button>
          </div>
          <div className="flex items-center justify-between gap-2 mt-2 md:mt-0">
              <span className="text-sm font-bold text-slate-300 block md:mr-2">{session.data.name}</span>
              {isSwitchableAccount() && (<button onClick={triggerRoleSwitch} className="px-3.5 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"><IconWrapper name="users-three" size={16} weight="fill" /><span className="hidden lg:inline">Ganti Peran</span></button>)}
              <button onClick={handleLogout} className="p-2.5 bg-slate-800 text-red-400 rounded-xl"><LogOut size={20} /></button>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex items-center"><div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mr-4"><IconWrapper name="book" size={26} weight="bold" /></div><div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sisa Kuota Kelas</p><h4 className="text-3xl font-black text-slate-800">{myAdmin.maxCourses || 0} Kelas</h4></div></div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex items-center"><div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mr-4"><IconWrapper name="users" size={26} weight="bold" /></div><div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sisa Kuota Siswa</p><h4 className="text-3xl font-black text-slate-800">{myAdmin.maxParticipants || 0} Siswa</h4></div></div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-center sm:col-span-2 lg:col-span-1 gap-2.5">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center lg:text-left">Butuh Penambahan Kuota?</p>
                  <div className="flex gap-2 w-full">
                      <button onClick={() => { if(hasPendingRequest) showToast("Sedang ditinjau!"); else setReqQuotaModal({ isOpen: true, reason: "", reqCourses: 5, reqParticipants: 50 }); }} className={`flex-1 font-extrabold py-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-sm ${hasPendingRequest ? 'bg-slate-100 text-slate-400 border border-slate-200' : 'bg-slate-900 text-white'}`}><IconWrapper name={hasPendingRequest ? "clock" : "paper-plane-right"} size={14} weight="bold"/><span>{hasPendingRequest ? "Tertunda" : "Ajukan Limit"}</span></button>
                      <button onClick={() => setShowPricingModal(true)} className="flex-1 bg-amber-500 text-slate-900 font-black py-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-md"><Coffee size={14} weight="bold"/><span>Traktir SenTools</span></button>
                  </div>
              </div>
          </div>

          {adminTab === 'courses' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
              <div className="xl:col-span-1 space-y-6 md:space-y-8">
                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
                  <h2 className="font-bold text-slate-800 mb-2 text-lg flex items-center"><PlusCircle size={22} className="mr-2 text-indigo-600" />Buka Kelas Baru</h2>
                  <form onSubmit={handleCreateCourse} className="space-y-4">
                    <div className="flex items-center gap-2">
                        <input name="code" id="crscode" required maxLength={10} className="flex-1 p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase font-bold text-sm" placeholder="Kode Unik"/>
                        <button type="button" onClick={()=>{document.getElementById('crscode').value = 'CR' + Math.floor(1000 + Math.random() * 9000).toString()}} className="w-14 h-[50px] bg-slate-100 rounded-xl flex items-center justify-center text-slate-500"><RefreshCw size={20}/></button>
                    </div>
                    <input name="title" required maxLength={100} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Judul Kelas Utama"/>
                    <input name="inst" defaultValue={session.data.name} required maxLength={50} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Nama Tampil Pengajar"/>
                    <input name="docLink" type="url" maxLength={255} className="w-full p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-800" placeholder="Link Materi Ekstra (Drive/PDF) - Opsional"/>
                    <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold mt-2">Posting Kelas</button>
                  </form>
                </div>
                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
                  <h2 className="font-bold text-slate-800 mb-6 text-lg flex items-center"><Video size={22} className="mr-2 text-indigo-600" />Upload Video Modul</h2>
                  <form onSubmit={handleCreateModule} className="space-y-4">
                    <select name="courseId" required className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" defaultValue=""><option value="" disabled>-- Pilih Kelas Tujuan --</option>{myCourses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select>
                    <input name="title" required maxLength={100} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Judul Sesi Video"/>
                    <input name="vidUrl" required type="url" maxLength={255} className="w-full p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-800" placeholder="Link YT / Drive Video"/>
                    <textarea name="desc" required maxLength={500} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl resize-none text-sm" rows="3" placeholder="Tulis deskripsi sesi..."></textarea>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold flex justify-center items-center mt-2"><PlayCircle size={20} className="mr-2"/> Simpan Modul</button>
                  </form>
                </div>
              </div>
              <div className="xl:col-span-2">
                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                        <h2 className="font-extrabold text-xl flex items-center"><BookOpen size={24} className="mr-3 text-indigo-600" />Katalog Kelas Anda</h2>
                        <div className="relative w-full sm:w-auto"><MagnifyingGlass size={18} className="absolute left-3 top-3.5 text-slate-400"/><input type="text" placeholder="Cari kursus..." value={searchCourse} onChange={e=>setSearchCourse(e.target.value)} className="w-full sm:w-64 pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"/></div>
                    </div>

                    {filteredMyCourses.map(course => (
                    <div key={course.id} className={`mb-8 border border-slate-100 rounded-2xl overflow-hidden shadow-sm ${!course.isActive ? 'opacity-60 grayscale-[30%]' : ''}`}>
                        <div className="bg-slate-50 border-b border-slate-100 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div><div className="flex gap-2 mb-2"><span className="font-mono font-black tracking-widest bg-white border border-indigo-100 text-indigo-700 px-3 py-1 rounded-full uppercase">{course.code}</span>{!course.isActive && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-bold">Tertutup</span>}</div><h3 className="font-extrabold text-xl mt-1">{course.title}</h3></div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <button onClick={() => openExamBuilder(course.id)} className="flex-1 bg-amber-100 text-amber-800 px-5 py-2.5 rounded-xl font-bold text-sm flex justify-center items-center"><CheckSquareOffset size={18} className="mr-1.5"/> Soal Ujian</button>
                                <button onClick={() => jumpToClassroom(course.id)} className="flex-1 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex justify-center items-center">Buka Kelas <ChevronRight size={16} className="ml-1"/></button>
                            </div>
                        </div>
                        <div className="p-5">
                            <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 px-2">Modul Video / Silabus</h4>
                            <div className="space-y-2">
                            {course.modules.map((m, i) => {
                                const hasGraduates = enrollments.some(e => String(e.courseId) === String(course.id) && e.isGraduated);
                                return (
                                <div key={m.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl">
                                    <div className="flex items-center"><div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs mr-3">{i+1}</div><span className="text-sm font-bold text-slate-700">{m.title}</span></div>
                                    {hasGraduates ? <button className="text-slate-400 p-2"><Lock size={18} weight="fill"/></button> : <button onClick={()=>handleDeleteModule(course.id, m.id)} className="text-slate-300 hover:text-red-500 p-2"><Trash2 size={18}/></button>}
                                </div>
                                );
                            })}
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {adminTab === 'participants' && (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 md:gap-8">
              <div className="xl:col-span-1 space-y-6 md:space-y-8">
                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 sm:p-8 rounded-3xl shadow-lg border border-indigo-500 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 text-white/10"><IconWrapper name="link" size={100} weight="fill"/></div>
                    <div className="relative z-10">
                        <h2 className="font-extrabold text-lg mb-2 flex items-center"><IconWrapper name="sparkle" size={20} className="mr-2 text-indigo-200" weight="fill"/> Generator Link</h2>
                        <a href="link.html" target="_blank" rel="noopener noreferrer" className="w-full bg-white text-indigo-700 font-black py-3.5 rounded-xl flex items-center justify-center gap-2 mt-4"><IconWrapper name="link" size={18} weight="bold"/> Buka Pembuat Link</a>
                    </div>
                </div>
                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
                  <h2 className="font-bold text-slate-800 mb-6 text-lg flex items-center"><PlusCircle size={22} className="mr-2 text-emerald-600" />Daftar Siswa Manual</h2>
                  <form onSubmit={handleRegisterParticipant} className="space-y-4">
                    <input name="name" required maxLength={60} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Nama Lengkap"/>
                    <input name="email" required type="email" maxLength={100} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Email (Akan di-email)"/>
                    <div className="flex gap-2">
                        <input name="code" id="ptcode" required maxLength={6} className="flex-1 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono" placeholder="PIN (6 Digit)"/>
                        <button type="button" onClick={()=>document.getElementById('ptcode').value = Math.floor(100000 + Math.random() * 900000).toString()} className="w-14 bg-slate-100 flex items-center justify-center rounded-xl"><RefreshCw size={20}/></button>
                    </div>
                    <select name="courseId" required className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" defaultValue=""><option value="" disabled>-- Daftarkan ke Kelas --</option>{myCourses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select>
                    <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold mt-2">Buat & Daftarkan</button>
                  </form>
                </div>
                <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
                  <h2 className="font-bold text-slate-800 mb-6 text-lg flex items-center"><Users size={22} className="mr-2 text-indigo-600" />Siswa Tersedia</h2>
                  <form onSubmit={handleEnrollExisting} className="space-y-4">
                    <input name="email" required type="email" maxLength={100} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Ketik Email Siswa" />
                    <select name="cId" required className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" defaultValue=""><option value="" disabled>-- Daftarkan ke Kelas --</option>{myCourses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold mt-2">Daftarkan Saja</button>
                  </form>
                </div>
              </div>
              <div className="xl:col-span-3 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <h2 className="font-extrabold text-slate-800 text-xl flex items-center"><GraduationCap size={24} className="mr-3 text-indigo-600" />Raport & Progress Siswa</h2>
                    <div className="relative w-full sm:w-auto"><MagnifyingGlass size={18} className="absolute left-3 top-3.5 text-slate-400"/><input type="text" placeholder="Cari nama siswa..." value={searchPart} onChange={e=>setSearchPart(e.target.value)} className="w-full sm:w-64 pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"/></div>
                </div>
                <div className="overflow-x-auto min-w-full"><table className="w-full text-left whitespace-nowrap"><thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider"><tr><th className="p-4 rounded-tl-xl">Siswa</th><th className="p-4">Pin Akses</th><th className="p-4">Kelas</th><th className="p-4">Track Belajar</th><th className="p-4">Nilai</th><th className="p-4 rounded-tr-xl">Lencana</th></tr></thead><tbody className="divide-y divide-slate-100 text-sm">
                    {filteredMyEnrs.map(enr => {
                      const part = participants.find(p => String(p.id) === String(enr.participantId)); const crs = courses.find(c => String(c.id) === String(enr.courseId)); const prog = calcProgress(enr, crs); if(!part || !crs) return null;
                      return (<tr key={enr.id} className="hover:bg-slate-50 transition">
                          <td className="p-4 font-bold text-slate-800">{part.name}</td><td className="p-4 font-mono text-slate-500 font-bold">{part.accessCode}</td><td className="p-4">{crs.title}</td>
                          <td className="p-4"><div className="flex items-center w-32"><div className="w-full bg-slate-200 rounded-full h-2.5 mr-3"><div className="h-2.5 rounded-full bg-emerald-500" style={{width:`${prog}%`}}></div></div><span className="font-bold text-xs text-slate-600">{prog}%</span></div></td>
                          <td className="p-4"><span className={`font-extrabold text-base ${enr.examScore >= (crs.exam?.minScore||0) ? 'text-emerald-600' : enr.examScore !== null ? 'text-red-500' : 'text-slate-300'}`}>{enr.examScore !== null ? enr.examScore : '--'}</span></td>
                          <td className="p-4">{enr.certDownloaded ? <span className="text-emerald-700 font-bold text-[10px] uppercase bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200">Sertifikat</span> : enr.isGraduated ? <span className="text-blue-700 font-bold text-[10px] uppercase bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">Lulus</span> : <span className="text-slate-500 font-bold text-[10px] uppercase bg-slate-100 px-3 py-1.5 rounded-lg">Proses</span>}</td>
                      </tr>)
                    })}
                </tbody></table></div>
              </div>
            </div>
          )}

          {adminTab === 'info' && (
            <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100 max-w-3xl mx-auto">
                <h2 className="font-extrabold text-slate-800 mb-3 text-2xl flex items-center"><Article size={28} className="mr-3 text-indigo-600" /> Papan Info Siswa</h2>
                <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b border-slate-200 pb-6">
                        <div><label className="font-extrabold text-slate-800 text-lg block">Sakelar Publikasi</label></div>
                        <button onClick={() => setInfoInstForm({...infoInstForm, show: !infoInstForm.show})} className={`flex items-center text-sm font-bold px-6 py-2.5 rounded-full w-full sm:w-auto justify-center ${infoInstForm.show ? 'bg-indigo-600 text-white' : 'bg-white border text-slate-500'}`}>
                            {infoInstForm.show ? <ToggleRight size={22} className="mr-2" weight="fill"/> : <ToggleLeft size={22} className="mr-2"/>} {infoInstForm.show ? 'ON' : 'OFF'}
                        </button>
                    </div>
                    <textarea value={infoInstForm.text} onChange={e => setInfoInstForm({...infoInstForm, text: e.target.value})} maxLength={1000} className="w-full p-5 border border-slate-200 rounded-2xl text-base resize-none mb-6" rows="5" placeholder="Cth: Jangan lupa kerjakan Quiz..."></textarea>
                    <button onClick={handleUpdateAdminInfo} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold">Terapkan Perubahan</button>
                </div>
            </div>
          )}

          {adminTab === 'profile' && (
            <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100 max-w-2xl mx-auto">
              <h2 className="font-extrabold text-slate-800 mb-3 text-2xl flex items-center"><UserIcon size={28} className="mr-3 text-indigo-600" /> Profil Publik & Apresiasi</h2>
              
              <div className="bg-indigo-50 p-6 md:p-8 rounded-3xl border border-indigo-100 mb-6">
                  <label className="text-xs font-bold text-indigo-800 uppercase block mb-3"><IconWrapper name="storefront" size={16} weight="fill" className="inline mr-1"/> Link Etalase Katalog Promo Anda</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                      <input type="text" readOnly value={`https://s-tools.id/edu/kelas.html?instructor=${session.data.username}`} className="flex-1 p-4 bg-white border border-indigo-200 rounded-2xl text-indigo-900 font-medium text-sm outline-none" />
                      <div className="flex gap-2 shrink-0">
                          <button type="button" onClick={() => { navigator.clipboard.writeText(`https://s-tools.id/edu/kelas.html?instructor=${session.data.username}`); showToast("Link Katalog disalin!"); }} className="bg-indigo-600 text-white px-5 py-4 rounded-2xl font-bold flex-1"><IconWrapper name="copy" size={18} weight="bold" /></button>
                      </div>
                  </div>
              </div>
              
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="bg-emerald-50 p-6 md:p-8 rounded-3xl border border-emerald-100">
                      <label className="text-xs font-bold text-emerald-800 uppercase block mb-3"><IconWrapper name="whatsapp-logo" size={16} weight="fill" className="inline mr-1"/> Nomor WhatsApp Interaksi</label>
                      <input type="text" maxLength={15} value={profileForm.whatsapp} onChange={e=>setProfileForm({...profileForm, whatsapp: e.target.value.replace(/[^0-9]/g, '')})} className="w-full p-4 border-0 rounded-2xl bg-white shadow-sm text-emerald-900 font-medium" placeholder="Cth: 628123456789 (Mulai dengan 62)" />
                  </div>
                  <div className="bg-amber-50 p-6 md:p-8 rounded-3xl border border-amber-100">
                      <label className="text-xs font-bold text-amber-800 uppercase block mb-3"><IconWrapper name="heart" size={16} weight="fill" className="inline mr-1"/> Tautan Apresiasi Kreator</label>
                      <input type="url" maxLength={255} value={profileForm.donationLink} onChange={e=>setProfileForm({...profileForm, donationLink: e.target.value})} className="w-full p-4 border-0 rounded-2xl bg-white shadow-sm text-amber-900 font-medium" placeholder="https://trakteer.id/nama-anda" />
                  </div>
                  <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-extrabold shadow-lg">Simpan Profil Publik</button>
              </form>
            </div>
          )}

          {adminTab === 'notifications' && (
            <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100 max-w-4xl mx-auto">
              <h2 className="font-extrabold text-slate-800 mb-8 text-2xl flex items-center"><MessageSquare size={28} className="mr-3 text-indigo-600" /> Forum Interaktif Siswa</h2>
              <div className="space-y-4">
                  {myNotifs.length === 0 ? <div className="text-center p-12"><p className="text-slate-400 font-medium">Kotak masuk sepi. Belum ada siswa yang berdiskusi.</p></div> : myNotifs.map(n => (
                      <div key={n.id} className={`flex flex-col sm:flex-row justify-between p-5 md:p-6 rounded-2xl border transition group ${n.isRead ? 'bg-white border-slate-200' : 'bg-indigo-50 border-indigo-200 shadow-sm'}`}>
                          <div className="mb-4 sm:mb-0"><div className="flex items-center mb-2"><span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span><p className="text-base font-bold text-slate-800 leading-snug">{n.text}</p></div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-4"><IconWrapper name="clock" size={12} className="inline mr-1 pb-0.5"/>{n.time}</p></div>
                          {n.courseId && <button onClick={() => jumpToClassroom(n.courseId, n.moduleId)} className="self-start sm:self-center shrink-0 w-full sm:w-auto bg-slate-900 text-white px-6 py-3 rounded-xl font-bold transition shadow-md">Balas di Kelas</button>}
                      </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (appMode === 'classroom' && activeCourse) {
    return (
      <div className="flex flex-col h-[100dvh] bg-slate-50 animate-[fadeIn_200ms_ease-out]">
        <header className="bg-white border-b px-4 py-4 flex items-center justify-between shadow-sm z-45 relative">
          <div className="flex items-center"><BookOpen size={24} className="text-indigo-600 mr-3"/><h1 className="text-xl font-bold">{activeCourse.title} <span className="text-xs font-normal text-slate-500">(Mode Pratinjau Pengajar)</span></h1></div>
          <button onClick={() => setAppMode('admin_dashboard')} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold flex items-center">Tutup Kelas <ArrowLeft size={16} className="ml-2"/></button>
        </header>
        <div className="flex flex-1 overflow-hidden relative">
          <aside className="w-80 bg-white border-r h-full flex flex-col z-10">
            <div className="p-6 border-b bg-slate-50/50"><h2 className="font-bold text-lg">Kurikulum Kelas</h2></div>
            <div className="overflow-y-auto flex-1 p-4 space-y-2">
              {activeCourse.modules.map((mod, index) => (
                <button key={mod.id} onClick={() => setActiveModule(mod)} className={`w-full text-left p-4 rounded-xl flex items-start space-x-3 border ${activeModule?.id === mod.id ? 'bg-indigo-50 border-indigo-200' : 'bg-white'}`}>
                    <PlayCircle size={20} className={activeModule?.id === mod.id ? 'text-indigo-600' : 'text-slate-400'} weight={activeModule?.id === mod.id ? 'fill' : 'regular'} />
                    <span className="text-sm font-bold truncate">{index + 1}. {mod.title}</span>
                </button>
              ))}
            </div>
          </aside>
          <main className="flex-1 overflow-y-auto bg-slate-50 relative p-8">
            {activeModule && (
              <div className="max-w-4xl mx-auto">
                {(() => {
                    const isDriveVideo = activeModule?.videoUrl && activeModule.videoUrl.includes('drive.google.com');
                    return (
                        <div className={`relative w-full rounded-3xl overflow-hidden shadow-xl bg-slate-900 mb-8 ring-1 ring-slate-200 transition-all ${isDriveVideo ? 'aspect-[4/3] sm:aspect-video min-h-[280px] sm:min-h-0' : 'aspect-video'}`}>
                            <iframe src={formatVideoUrl(activeModule.videoUrl)} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="absolute top-0 left-0 w-full h-full border-0"></iframe>
                            {isDriveVideo && (<div className="absolute top-0 right-0 w-16 h-16 bg-transparent cursor-default z-10" title="Fokus belajar di dalam kelas" />)}
                        </div>
                    );
                })()}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <h2 className="text-2xl font-bold mb-4">{activeModule.title}</h2><p className="text-slate-600 mb-10">{activeModule.description}</p>
                    <div className="pt-8 border-t border-slate-100">
                        <h3 className="text-xl font-bold mb-6 flex items-center"><MessageSquare className="mr-3 text-indigo-600"/> Ruang Diskusi</h3>
                        <form onSubmit={handlePostComment} className="mb-8 flex gap-4">
                            <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Balas pertanyaan siswa..." className="flex-1 px-5 py-4 rounded-xl border bg-slate-50" />
                            <button type="submit" disabled={!commentText.trim()} className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold">Kirim</button>
                        </form>
                        <div className="space-y-4">
                            {activeModule.comments.map(c => (<div key={c.id} className={`p-5 rounded-2xl border ${c.isAdmin ? 'bg-indigo-50 border-indigo-100' : 'bg-white'}`}><p className="font-bold text-sm mb-1">{c.user}</p><p className="text-slate-700">{c.text}</p></div>))}
                        </div>
                    </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  }
  return null;
}

ReactDOM.createRoot(document.getElementById('root')).render(<InstrukturApp />);
