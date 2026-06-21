import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';

const _0xDbChunks = ["aHR0cHM6Ly9zY3JpcHQuZ29v", "Z2xlLmNvbS9tYWNyb3Mvcy9B", "S2Z5Y2J6RXdlUkQ2dTVmeGVH", "SEtOR0VJTFhZOWkzcXhibTdP", "QVlMZHRaeGxHdmdEOXhDb01D", "aUN3OGJDbmpDLXhad3cxbksv", "ZXhlYw=="];
const DEFAULT_SHEETS_URL = atob(_0xDbChunks.join(""));
const LOGIN_PORTAL_URL = "https://s-tools.id/edu/page-instruktur.html";

if (localStorage.getItem('edu_sheets_url') !== DEFAULT_SHEETS_URL) {
    localStorage.setItem('edu_sheets_url', DEFAULT_SHEETS_URL);
}

const IconWrapper = ({ name, size = 24, className = "", weight="regular" }) => <i className={`ph${weight === 'fill' ? '-fill' : weight === 'duotone' ? '-duotone' : weight === 'bold' ? '-bold' : ''} ph-${name} ${className}`} style={{ fontSize: size }}></i>;
const BookOpen = (p) => <IconWrapper name="book-open" {...p} />; const LogOut = (p) => <IconWrapper name="sign-out" {...p} />; const Video = (p) => <IconWrapper name="video" {...p} />; const UserIcon = (p) => <IconWrapper name="user" {...p} />; const PlayCircle = (p) => <IconWrapper name="play-circle" {...p} />; const Award = (p) => <IconWrapper name="medal" {...p} />; const Bell = (p) => <IconWrapper name="bell" {...p} />; const Article = (p) => <IconWrapper name="article" {...p} />; const Heart = (p) => <IconWrapper name="heart" {...p} />; const X = (p) => <IconWrapper name="x" {...p} />; const EnvelopeSimple = (p) => <IconWrapper name="envelope-simple" {...p} />; const Coffee = (p) => <IconWrapper name="coffee" {...p} />; const Sparkle = (p) => <IconWrapper name="sparkle" {...p} />; const CheckCircle2 = (p) => <IconWrapper name="check-circle" {...p} />; const Menu = (p) => <IconWrapper name="list" {...p} />; const ArrowLeft = (p) => <IconWrapper name="arrow-left" {...p} />; const Lock = (p) => <IconWrapper name="lock" {...p} />; const CheckSquareOffset = (p) => <IconWrapper name="check-square-offset" {...p} />; const Book = (p) => <IconWrapper name="book" {...p} />; const ChevronRight = (p) => <IconWrapper name="caret-right" {...p} />; const MessageSquare = (p) => <IconWrapper name="chat-circle" {...p} />; const RefreshCw = (p) => <IconWrapper name="arrows-clockwise" {...p} />; const Download = (p) => <IconWrapper name="download" {...p} />; const AlertCircle = (p) => <IconWrapper name="warning-circle" {...p} />; const Database = (p) => <IconWrapper name="database" {...p} />;

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

const generateCertHtml = (pName, cTitle, instName, graduatedAt) => {
  let formattedDate = graduatedAt ? new Date(graduatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('id-ID');
  return `<div class="cert-container" style="background: #fff; padding: 15px; border-radius: 10px; max-width: 900px; width: 100%; margin: 0 auto; box-sizing: border-box; text-align: center;"><div class="cert-border" style="border: 4px double #0f172a; padding: 40px 60px; min-height: 480px; position: relative; background-color: #ffffff;"><div class="header-brand" style="margin-bottom: 35px; text-align: center;"><span class="brand-edu" style="font-family: 'Inter', sans-serif; font-weight: 800; font-size: 28px; letter-spacing: -0.5px; color: #4f46e5;">EduLearn</span><span class="brand-by" style="font-family: 'Playfair Display', serif; font-style: italic; font-weight: 400; font-size: 18px; color: #64748b; margin-left: 6px;">by SenTools</span></div><div class="title" style="color: #0f172a; font-size: 48px; font-weight: 700; text-transform: uppercase; margin-bottom: 20px; letter-spacing: 4px; font-family: 'Playfair Display', serif;">Sertifikat Kelulusan</div><div class="subtitle" style="color: #475569; font-style: italic; font-size: 18px; margin-bottom: 20px; font-family: 'Playfair Display', serif;">Diberikan dengan bangga kepada:</div><div class="name" style="font-size: 42px; color: #1d4ed8; font-weight: 700; margin: 10px 0; border-bottom: 2px solid #cbd5e1; display: inline-block; padding: 0 40px 10px; font-family: 'Playfair Display', serif;">${pName}</div><div class="course-label" style="color: #475569; font-size: 18px; margin: 30px 0 10px; font-style: italic; font-family: 'Playfair Display', serif;">Atas keberhasilannya menyelesaikan kursus:</div><div class="course-name" style="font-size: 32px; color: #0f172a; font-weight: 700; line-height: 1.3; margin-bottom: 20px; font-family: 'Playfair Display', serif;">${cTitle}</div><div class="date-issued" style="color: #64748b; font-size: 16px; margin-bottom: 40px; font-style: italic; font-family: 'Playfair Display', serif;">Diberikan pada: ${formattedDate}</div><div class="footer" style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 50px; padding-bottom: 30px; font-family: 'Playfair Display', serif;"><div class="signature-block" style="width: 250px; text-align: center;"><div class="signature" style="font-family: 'Great Vibes', cursive; font-size: 36px; color: #0f172a; border-bottom: 1px solid #94a3b8; margin-bottom: 5px; padding-bottom: 5px; white-space: nowrap; overflow: hidden;">${instName}</div><div class="instructor-name" style="font-size: 16px; font-weight: bold; color: #0f172a;">${instName}</div><div class="instructor-title" style="font-size: 14px; color: #64748b;">Instruktur Utama</div></div><div class="signature-block" style="width: 250px; text-align: center;"><div class="signature" style="font-family: 'Great Vibes', cursive; font-size: 36px; color: #0f172a; border-bottom: 1px solid #94a3b8; margin-bottom: 5px; padding-bottom: 5px; white-space: nowrap; overflow: hidden;">SenTools</div><div class="instructor-name" style="font-size: 16px; font-weight: bold; color: #0f172a;">Sistem Manajemen</div><div class="instructor-title" style="font-size: 14px; color: #64748b;">EduLearn by SenTools</div></div></div></div></div>`;
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

function SiswaApp() {
  const [dbMode] = useState(() => localStorage.getItem('edu_db_mode') || 'sheets');
  const [dbReady, setDbReady] = useState(false);
  const [setupError, setSetupError] = useState("");
  const [session, setSession] = useState(() => JSON.parse(sessionStorage.getItem('edu_session')) || null);
  
  const [admins, setAdmins] = useState([]);
  const [courses, setCourses] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [appMode, setAppMode] = useState('part_dashboard');
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [classroomMode, setClassroomMode] = useState('video');
  const [studentAnswers, setStudentAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, message: "", onConfirm: null });
  const [showSupportPanel, setShowSupportPanel] = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    if (!session || session.role !== 'participant') window.location.href = 'index.html';
  }, [session]);

  useEffect(() => {
    if (appMode === 'setup_db') return;
    if (dbMode === 'local') {
      setAdmins(JSON.parse(localStorage.getItem('edu_admins')) || []);
      setCourses(normalizeCourses(JSON.parse(localStorage.getItem('edu_courses')) || []));
      setParticipants(JSON.parse(localStorage.getItem('edu_participants')) || []);
      setEnrollments(JSON.parse(localStorage.getItem('edu_enrollments')) || []);
      setNotifications(JSON.parse(localStorage.getItem('edu_notifications')) || []);
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
    setSession(null); sessionStorage.removeItem('edu_session');
    setClassroomMode('video'); setStudentAnswers({}); 
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
              <button onClick={() => setConfirmDialog({ isOpen: false })} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold">Tutup</button>
              {confirmDialog.onConfirm && <button onClick={confirmDialog.onConfirm} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold">Lanjutkan</button>}
          </div>
        </div>
      </div>
    );
  };

  const jumpToClassroom = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    if (!course.isActive) {
        showToast("Akses Ditolak: Kursus dinonaktifkan.");
        setConfirmDialog({ isOpen: true, message: "Kelas ini telah dinonaktifkan oleh SenTools.", onConfirm: () => setConfirmDialog({isOpen:false}) });
        return;
    }

    let modToOpen = course.modules[0] || null; setClassroomMode('video');
    let myEnr = enrollments.find(e => String(e.participantId) === String(session.data.id) && String(e.courseId) === String(courseId));
    
    if (myEnr) {
        if(myEnr.isGraduated) setClassroomMode('result');
        else {
            let compList = Array.isArray(myEnr.completedModules) ? myEnr.completedModules : [];
            if(typeof myEnr.completedModules === 'string') { try { compList = JSON.parse(myEnr.completedModules); } catch(e) {} }
            modToOpen = course.modules.find(m => !compList.includes(m.id)) || course.modules[course.modules.length - 1];
        }
    }
    if(!modToOpen && classroomMode === 'video') return showToast("Belum ada materi!"); 
    setActiveCourse(course); setActiveModule(modToOpen); setAppMode('classroom');
  };

  const handlePostComment = async (e) => {
    e.preventDefault(); if (!commentText.trim()) return;
    const authorName = session.data.name;
    const newComment = { id: `cmt_${Date.now()}`, user: authorName, text: commentText, isAdmin: false, time: "Baru saja" };
    const latestCourse = courses.find(c => c.id === activeCourse.id) || activeCourse;
    const updatedMods = latestCourse.modules.map(m => m.id === activeModule.id ? { ...m, comments: [...m.comments, newComment] } : m);
    
    await execDbAction(() => {
        const updatedC = courses.map(c => c.id === activeCourse.id ? { ...c, modules: updatedMods } : c);
        setCourses(updatedC); localStorage.setItem('edu_courses', JSON.stringify(updatedC));
        const updatedN = [{ id: `n_${Date.now()}`, adminId: activeCourse.authorId, text: `${authorName} bertanya di "${activeCourse.title}"`, isRead: false, time: "Baru saja", courseId: activeCourse.id, moduleId: activeModule.id }, ...notifications];
        setNotifications(updatedN); localStorage.setItem('edu_notifications', JSON.stringify(updatedN));
    });
    
    setActiveCourse(prev => ({ ...prev, modules: updatedMods }));
    setActiveModule(prev => ({ ...prev, comments: [...prev.comments, newComment] })); 
    setCommentText(""); showToast("Komentar terkirim!");
  };

  const handleCompleteModule = async () => {
    const cMods = activeCourse.modules; const cIdx = cMods.findIndex(m => m.id === activeModule.id); const isLast = cIdx === cMods.length - 1;
    let myEnr = enrollments.find(e => String(e.participantId) === String(session.data.id) && String(e.courseId) === String(activeCourse.id));
    let compList = Array.isArray(myEnr.completedModules) ? myEnr.completedModules : [];
    if(typeof myEnr.completedModules === 'string') { try { compList = JSON.parse(myEnr.completedModules); } catch(e) {} }

    if (!compList.includes(activeModule.id)) {
      const newComps = [...compList, activeModule.id];
      await execDbAction(() => {
          const updatedE = enrollments.map(en => String(en.id) === String(myEnr.id) ? { ...en, completedModules: newComps } : en);
          setEnrollments(updatedE); localStorage.setItem('edu_enrollments', JSON.stringify(updatedE));
      });
      if (!isLast) { setActiveModule(cMods[cIdx + 1]); showToast("Lanjut materi."); } else setClassroomMode('exam');
    } else {
      if (!isLast) setActiveModule(cMods[cIdx + 1]); else setClassroomMode('exam');
    }
  };

  const submitExam = async () => {
    let correct = 0; activeCourse.exam.questions.forEach((q, i) => { if(studentAnswers[i] === q.answer) correct++; });
    const finalScore = correct * 10; const isPassed = finalScore >= activeCourse.exam.minScore;
    let myEnr = enrollments.find(e => String(e.participantId) === String(session.data.id) && String(e.courseId) === String(activeCourse.id));
    const todayDateStr = new Date().toISOString(); 
    
    await execDbAction(() => {
            const updatedE = enrollments.map(en => String(en.id) === String(myEnr.id) ? { ...en, examScore: finalScore, isGraduated: isPassed, graduatedAt: isPassed ? todayDateStr : en.graduatedAt } : en);
            setEnrollments(updatedE); localStorage.setItem('edu_enrollments', JSON.stringify(updatedE));
    });
    
    setClassroomMode('result');
    if(isPassed) {
        showToast("Selamat, Ujian Lulus!");
        triggerEmail({ tujuan: session.data.email, subjek: `Selamat! Kelulusan Kelas: ${activeCourse.title}`, namaPengguna: session.data.name, isiPesanInti: `Sertifikat digital Anda telah diterbitkan.` });
    } else { showToast(`Nilai ${finalScore}. Minimal ${activeCourse.exam.minScore}.`); }
  };

  const handleDownloadCert = async () => {
    const myEnr = enrollments.find(e => String(e.participantId) === String(session.data.id) && String(e.courseId) === String(activeCourse.id));
    const instructorData = admins.find(a => String(a.id) === String(activeCourse.authorId));
    await execDbAction(() => {
        const updatedE = enrollments.map(en => String(en.id) === String(myEnr.id) ? { ...en, certDownloaded: true } : en);
        setEnrollments(updatedE); localStorage.setItem('edu_enrollments', JSON.stringify(updatedE));
    });

    const certContent = generateCertHtml(session.data.name, activeCourse.title, instructorData?.name || activeCourse.instructor, myEnr.graduatedAt);
    const blob = new Blob([certContent], { type: 'text/html' }); const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = `Sertifikat-${activeCourse.title.replace(/\s+/g, '-')}.html`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url);
    showToast("Sertifikat berhasil diunduh!");
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

  if (appMode === 'part_dashboard') {
    let myEnrs = enrollments.filter(e => String(e.participantId) === String(session.data.id));
    const superAdmin = admins.find(a => a.isSuper === true || a.isSuper === 'true' || a.isSuper === 'TRUE');
    const myInstructors = admins.filter(a => myEnrs.some(e => { const c = courses.find(crs => String(crs.id) === String(e.courseId)); return c && String(c.authorId) === String(a.id); }));

    return (
      <div className="min-h-screen flex flex-col bg-slate-50 animate-[fadeIn_200ms_ease-out] pb-10">
        {ConfirmModal()}{toast && <div className="fixed top-4 right-4 z-[100] bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2"><CheckCircle2 size={20}/><span>{toast}</span></div>}
        
        <header className="bg-white border-b px-4 md:px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
          <div className="flex items-center text-indigo-600"><div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mr-3"><BookOpen size={24} weight="fill"/></div><h1 className="text-xl md:text-2xl font-extrabold tracking-tight hidden sm:block">EduLearn</h1></div>
          <div className="flex items-center bg-slate-50 px-2 py-1.5 rounded-full border border-slate-200 gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">{session.data.name.charAt(0)}</div>
              <p className="text-sm font-bold text-slate-700 mr-2 pr-2 border-r border-slate-300 hidden md:block">{session.data.name}</p>
              {isSwitchableAccount() && (
                <button onClick={triggerRoleSwitch} className="px-3.5 py-1.5 bg-slate-200 hover:bg-indigo-600 text-slate-700 hover:text-white rounded-full text-xs font-bold transition flex items-center gap-1.5 shadow-sm"><IconWrapper name="users-three" size={16} weight="fill" /><span className="hidden lg:inline">Ganti Peran</span></button>
              )}
              <button onClick={handleLogout} className="p-1.5 text-slate-400 hover:text-red-500 rounded-full transition"><LogOut size={20} weight="bold"/></button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-3xl p-8 md:p-10 mb-8 md:mb-10 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 text-white/10"><Sparkle size={200} weight="fill"/></div>
              <div className="relative z-10"><h2 className="text-3xl md:text-5xl font-extrabold mb-3 tracking-tight">Halo, {session.data.name.split(' ')[0]}!</h2><p className="text-indigo-100 text-base md:text-xl max-w-2xl font-medium leading-relaxed">Siap untuk melanjutkan petualangan belajarmu hari ini? Pilih kelas di bawah dan raih target kelulusanmu!</p></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
              <div className="lg:col-span-2">
                  <div className="flex items-center mb-6"><h3 className="text-2xl font-extrabold text-slate-800 flex-1">Perjalanan Kelasmu</h3><span className="bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-widest">{myEnrs.length} Terdaftar</span></div>
                  
                  {myEnrs.length === 0 ? <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center"><div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm"><Book size={40} className="text-slate-300"/></div><h4 className="text-xl font-bold text-slate-700 mb-2">Belum ada kelas</h4><p className="text-slate-500">Gunakan email ini untuk didaftarkan ke kelas oleh instruktur Anda.</p></div> : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                    {myEnrs.map(enr => {
                      const course = courses.find(c => String(c.id) === String(enr.courseId)); if (!course) return null; const prog = calcProgress(enr, course);
                      return (
                        <div key={enr.id} className={`bg-white rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 hover:border-indigo-100 transition-all duration-300 transform hover:-translate-y-1 p-6 md:p-8 flex flex-col relative overflow-hidden group ${!course.isActive ? 'opacity-70 grayscale-[30%]' : ''}`}>
                          {!course.isActive && <div className="absolute top-5 right-5 z-20"><span className="bg-red-50 text-red-600 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest border border-red-200 shadow-sm">Nonaktif</span></div>}
                          {enr.isGraduated && <div className="absolute top-6 right-[-35px] w-[150px] transform rotate-45 bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-widest py-1.5 text-center shadow-md z-10">LULUS!</div>}

                          <div className="flex items-center justify-start gap-4 mb-5 relative z-10 pr-16">
                              <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner shrink-0 group-hover:scale-110 transition-transform"><Video size={28} weight="duotone"/></div>
                              <span className="font-mono text-sm md:text-base font-black tracking-widest bg-indigo-100 border border-indigo-200 text-indigo-800 px-3 py-1.5 rounded-xl uppercase shadow-sm">{course.code}</span>
                          </div>
                          <h3 className="text-xl font-extrabold mb-1 text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                          <p className="text-sm text-slate-500 mb-8 flex-1 font-medium flex items-center"><UserIcon size={14} className="mr-1.5"/> {course.instructor}</p>
                          
                          <div className="mb-6"><div className="flex justify-between items-end mb-2"><span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Pencapaian</span><span className={`text-sm font-extrabold ${prog===100?'text-emerald-600':'text-indigo-600'}`}>{prog}%</span></div><div className="w-full bg-slate-100 rounded-full h-3 shadow-inner overflow-hidden"><div className="h-full rounded-full bg-emerald-500" style={{width:`${prog}%`}}></div></div></div>
                          <button onClick={() => jumpToClassroom(course.id)} className={`w-full py-4 rounded-xl font-bold flex items-center justify-center shadow-md transition-all active:scale-95 ${enr.isGraduated ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-900 hover:bg-indigo-600 text-white'}`}>{enr.isGraduated ? <Award size={20} className="mr-2" weight="fill"/> : <PlayCircle size={20} className="mr-2"/>} <span>{enr.isGraduated ? 'Buka Sertifikat' : 'Lanjutkan Belajar'}</span></button>
                        </div>
                      );
                    })}
                  </div>
                  )}
              </div>

              <div className="lg:col-span-1 space-y-6">
                  {superAdmin?.showInfo2 && superAdmin?.info2 && (
                      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-3xl shadow-lg shadow-blue-200 text-white relative overflow-hidden"><div className="absolute -top-4 -right-4 text-white/10"><Bell size={100} weight="fill"/></div><div className="relative z-10"><div className="flex items-center mb-4"><div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3 backdrop-blur-sm"><Bell size={16} weight="bold"/></div><h3 className="font-bold text-sm uppercase tracking-widest text-blue-100">Info Pusat</h3></div><p className="text-base font-medium leading-relaxed">{superAdmin.info2}</p></div></div>
                  )}
                  {myInstructors.filter(i => i.showInfo3 && i.info3).length > 0 && (
                      <div className="bg-white border border-amber-100 rounded-3xl shadow-sm overflow-hidden"><div className="bg-amber-50 p-5 border-b border-amber-100"><h3 className="font-extrabold text-amber-900 flex items-center"><Article size={20} className="mr-2 text-amber-500" weight="fill"/> Pengumuman Instruktur</h3></div><div className="p-5 space-y-4">{myInstructors.filter(i => i.showInfo3 && i.info3).map(inst => (<div key={inst.id} className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-1 before:bg-amber-400 before:rounded-full"><p className="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest mb-1">{inst.name}</p><p className="text-sm text-slate-700 font-medium leading-relaxed">{inst.info3}</p></div>))}</div></div>
                  )}
                  {!(superAdmin?.showInfo2 && superAdmin?.info2) && myInstructors.filter(i => i.showInfo3 && i.info3).length === 0 && (
                      <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center shadow-sm"><div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300"><Bell size={24}/></div><h3 className="font-bold text-slate-700">Papan Informasi</h3><p className="text-sm text-slate-400 mt-2">Tidak ada pengumuman penting saat ini. Fokus belajar!</p></div>
                  )}
              </div>
          </div>
          
          <div className="mt-12 text-center">
              <button onClick={() => setShowSupportPanel(!showSupportPanel)} className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-full hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 overflow-hidden"><span className="relative flex items-center gap-2">{showSupportPanel ? <X size={20} weight="bold"/> : <Heart size={20} weight="fill" className="text-pink-200 animate-pulse"/>}{showSupportPanel ? 'Sembunyikan Panel Bantuan' : 'Pusat Bantuan & Apresiasi SenTools ✨'}</span></button>
          </div>

          {showSupportPanel && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto shadow-sm animate-[fadeIn_0.4s_ease-out]">
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm flex flex-col">
                      <h3 className="text-xl font-extrabold text-slate-800 mb-1">Suara Anda</h3>
                      <p className="text-sm text-slate-500 mb-6">Kirimkan masukan langsung ke pengembang sistem.</p>
                      <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.target); triggerEmail({ tujuan: "me@mail.s-tools.id", subjek: `[Suara Anda] ${fd.get('subject')}`, namaPengguna: session.data.name, isiPesanInti: `<b>Siswa:</b> ${session.data.name}<br><b>Pesan:</b><br>${fd.get('message').replace(/\n/g, '<br>')}` }); showToast("Pesan berhasil dikirim!"); e.target.reset(); }} className="space-y-4 flex-1 flex flex-col">
                          <input name="email" required type="email" defaultValue={session.data.email} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500 transition text-sm" placeholder="Email Anda" />
                          <input name="subject" required type="text" maxLength={100} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500 transition text-sm" placeholder="Subjek / Topik" />
                          <textarea name="message" required maxLength={500} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500 transition resize-none text-sm flex-1 min-h-[100px]" placeholder="Tulis pesan Anda di sini..."></textarea>
                          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold transition flex items-center justify-center gap-2"><EnvelopeSimple size={18} weight="bold"/> Kirim Pesan</button>
                      </form>
                  </div>
                  <div className="bg-slate-900 rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-lg shadow-slate-800/50">
                      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-pink-400 mb-6 backdrop-blur-sm z-10"><Heart size={32} weight="fill"/></div>
                      <h3 className="text-2xl font-extrabold text-white mb-3 z-10 tracking-wide">Dukung SenTools</h3>
                      <p className="text-sm text-slate-300 mb-8 max-w-xs z-10 leading-relaxed">Dukungan Anda membantu kami terus mengembangkan platform pendidikan.</p>
                      <a href="https://s-tools.id/payment/apresiasi.html" target="_blank" rel="noopener noreferrer" className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3.5 rounded-full font-bold transition shadow-lg shadow-pink-500/30 flex items-center gap-2 z-10 transform hover:scale-105 active:scale-95"><Coffee size={20} weight="fill"/> Berikan Apresiasi</a>
                      <div className="absolute -bottom-10 -right-10 text-white/5 z-0"><Heart size={150} weight="fill"/></div>
                  </div>
              </div>
          )}
        </main>
      </div>
    );
  }

  if (appMode === 'classroom' && session && activeCourse) {
    const myEnr = enrollments.find(e => String(e.participantId) === String(session.data.id) && String(e.courseId) === String(activeCourse.id));
    const prog = calcProgress(myEnr, activeCourse);
    const instructorData = admins.find(a => String(a.id) === String(activeCourse.authorId));

    return (
      <div className="flex flex-col h-[100dvh] bg-slate-50 animate-[fadeIn_200ms_ease-out]">
        {ConfirmModal()}<div className="fixed top-4 right-4 z-[100] bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2" style={{display: toast ? 'flex' : 'none'}}><CheckCircle2 size={20} /><span>{toast}</span></div>
        
        <header className="bg-white border-b px-4 py-3 md:py-4 flex items-center justify-between shrink-0 shadow-sm z-45 relative">
          <div className="flex items-center min-w-0 pr-4">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 mr-3 shrink-0 transition"><Menu size={20} weight="bold"/></button>
              <div className="flex items-center text-indigo-600 shrink-0 hidden sm:flex"><BookOpen size={24} weight="fill" className="mr-3"/></div>
              <h1 className="text-lg md:text-xl font-extrabold truncate text-slate-800"><span className="font-mono font-black text-xs md:text-sm bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg mr-3 shadow-sm align-middle">{activeCourse.code}</span>{activeCourse.title}</h1>
          </div>
          <button onClick={() => setAppMode('part_dashboard')} className="shrink-0 flex items-center text-sm bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold transition shadow-md"><span className="hidden sm:inline">Tutup Kelas</span><ArrowLeft size={16} className="sm:ml-2" weight="bold"/></button>
        </header>

        <div className="flex flex-1 overflow-hidden relative">
          {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsSidebarOpen(false)}></div>}
          
          <aside className={`fixed lg:static w-[85%] sm:w-80 bg-white border-r h-full z-50 lg:z-10 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <div className="p-6 border-b bg-slate-50/50 flex justify-between items-center">
                <div><h2 className="font-extrabold text-slate-800 text-lg">Kurikulum Sesi</h2><div className="mt-4 flex items-center w-full max-w-[200px]"><div className="w-full bg-slate-200 rounded-full h-1.5 mr-3 overflow-hidden"><div className="bg-emerald-500 h-full rounded-full transition-all duration-700" style={{ width: `${prog}%` }}></div></div><span className="text-[10px] font-extrabold text-slate-500">{prog}%</span></div></div>
                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-800 p-2"><X size={24} weight="bold"/></button>
            </div>
            <div className="overflow-y-auto flex-1 p-3 sm:p-4">
              <div className="space-y-1.5">
              {activeCourse.modules.map((mod, index) => {
                const isComp = myEnr?.completedModules.includes(mod.id);
                const isUnlck = index === 0 || myEnr?.completedModules.includes(activeCourse.modules[index - 1].id);
                return (<button key={mod.id} disabled={!isUnlck} onClick={() => { setClassroomMode('video'); setActiveModule(mod); setIsSidebarOpen(false); }} className={`w-full text-left p-4 rounded-2xl flex items-start space-x-3 transition-all border ${!isUnlck ? 'opacity-60 bg-slate-50 border-transparent cursor-not-allowed' : activeModule?.id === mod.id && classroomMode==='video' ? 'bg-indigo-50 border-indigo-200 shadow-sm ring-1 ring-indigo-500/20' : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm'}`}>
                    {!isUnlck ? <Lock size={20} className="text-slate-400 shrink-0" weight="fill" /> : isComp ? <CheckCircle2 size={20} className="text-emerald-500 shrink-0" weight="fill" /> : <PlayCircle size={20} className={`shrink-0 ${activeModule?.id === mod.id && classroomMode==='video' ? 'text-indigo-600' : 'text-slate-400'}`} weight={activeModule?.id === mod.id && classroomMode==='video' ? 'fill' : 'regular'} />}
                    <div className="flex-1 min-w-0"><p className={`text-sm font-bold leading-snug truncate ${!isUnlck ? 'text-slate-500' : activeModule?.id === mod.id && classroomMode==='video' ? 'text-indigo-900' : 'text-slate-700'}`}>{index + 1}. {mod.title}</p></div>
                </button>);
              })}
              </div>
              {prog === 100 && activeCourse.exam && (
                  <button onClick={() => { setIsSidebarOpen(false); setClassroomMode(myEnr?.isGraduated ? 'result' : 'exam'); }} className={`w-full mt-6 p-5 rounded-2xl flex items-center space-x-3 font-extrabold border-2 transition hover:shadow-md transform active:scale-95 ${myEnr?.isGraduated ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'}`}>{myEnr?.isGraduated ? <Award size={24} className="shrink-0" weight="fill"/> : <CheckSquareOffset size={24} className="shrink-0" weight="fill"/>}<span className="truncate">{myEnr?.isGraduated ? 'Sertifikat Anda' : 'Mulai Ujian Akhir!'}</span></button>
              )}
            </div>
          </aside>

          <main className="flex-1 overflow-y-auto bg-slate-50 relative z-10 w-full">
            <div className="max-w-4xl mx-auto p-4 md:p-8 lg:p-10">
              {classroomMode === 'video' && activeModule && (
                  <div className="animate-[fadeIn_0.3s_ease-out]">
                    {activeCourse.docLink && (
                        <div className="mb-6 md:mb-8 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 p-5 md:p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm">
                            <div className="mb-4 sm:mb-0"><h3 className="font-extrabold text-emerald-900 flex items-center text-lg"><Book size={22} className="mr-2 text-emerald-600" weight="fill"/> Dokumen Pendamping</h3><p className="text-sm text-emerald-700 mt-1 max-w-lg">Buka dan baca dokumen ini sebelum atau saat memutar video materi.</p></div>
                            <a href={activeCourse.docLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-xl font-bold flex items-center justify-center shadow-lg shadow-emerald-200 transition transform active:scale-95 whitespace-nowrap">Akses Dokumen <ChevronRight size={18} className="ml-2" weight="bold"/></a>
                        </div>
                    )}

                    {(() => {
                        const isDriveVideo = activeModule?.videoUrl && activeModule.videoUrl.includes('drive.google.com');
                        return (
                            <div className={`relative w-full rounded-3xl overflow-hidden shadow-xl bg-slate-900 mb-6 md:mb-8 ring-1 ring-slate-200 transition-all ${isDriveVideo ? 'aspect-[4/3] sm:aspect-video min-h-[280px] sm:min-h-0' : 'aspect-video'}`}>
                                <iframe src={formatVideoUrl(activeModule.videoUrl)} title={activeModule.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen className="absolute top-0 left-0 w-full h-full border-0"></iframe>
                                {isDriveVideo && (<div className="absolute top-0 right-0 w-16 h-16 bg-transparent cursor-default z-10" title="Fokus belajar di dalam kelas" />)}
                            </div>
                        );
                    })()}

                    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100">
                        <h2 className="text-2xl md:text-3xl font-extrabold mb-4 text-slate-900">{activeModule.title}</h2><p className="text-slate-600 text-base md:text-lg leading-relaxed">{activeModule.description}</p>
                        
                        <div className="mt-8 md:mt-10 pt-8 border-t border-slate-100 flex justify-end">
                            <button onClick={handleCompleteModule} className={`w-full sm:w-auto flex justify-center items-center px-8 py-4 rounded-2xl font-extrabold transition shadow-lg transform active:scale-95 text-sm md:text-base ${myEnr?.completedModules.includes(activeModule.id) ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'}`}>
                                <span className="mr-2">{myEnr?.completedModules.includes(activeModule.id) ? 'Lanjutkan ke Materi Berikut' : 'Tandai Selesai & Lanjutkan'}</span>
                                {myEnr?.completedModules.includes(activeModule.id) ? <ChevronRight size={20} weight="bold"/> : <CheckCircle2 size={20} weight="bold"/>}
                            </button>
                        </div>

                        <div className="mt-12 md:mt-16 pt-8 md:pt-12 border-t border-slate-100">
                            <h3 className="text-xl md:text-2xl font-extrabold mb-6 flex items-center text-slate-900"><MessageSquare className="mr-3 text-indigo-600" weight="fill"/> Ruang Diskusi</h3>
                            <form onSubmit={handlePostComment} className="mb-8 flex flex-col sm:flex-row gap-3 md:gap-4">
                                <input type="text" maxLength={500} value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder={"Ada yang kurang jelas? Tanyakan di sini..."} className="flex-1 px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition text-base" />
                                <button type="submit" disabled={!commentText.trim()} className="bg-slate-900 hover:bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold disabled:bg-slate-200 disabled:text-slate-400 transition shadow-md w-full sm:w-auto flex justify-center items-center shrink-0">Kirim</button>
                            </form>
                            <div className="space-y-4">
                                {activeModule.comments.length === 0 ? <div className="text-center py-10 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200"><MessageSquare size={32} className="mx-auto text-slate-300 mb-3"/><p className="text-slate-400 font-medium">Jadilah yang pertama memulai diskusi!</p></div> : activeModule.comments.map(c => (<div key={c.id} className={`p-5 md:p-6 rounded-3xl border ${c.isAdmin ? 'bg-indigo-50 border-indigo-100' : 'bg-white border-slate-100 shadow-sm'}`}><div className="flex items-center mb-2"><div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs mr-3">{c.user.charAt(0)}</div><div><p className="font-extrabold text-sm text-slate-800 flex items-center">{c.user} {c.isAdmin && <span className="ml-2 text-[9px] bg-indigo-600 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">Pengajar</span>}</p></div></div><p className="text-base text-slate-700 leading-relaxed ml-11">{c.text}</p></div>))}
                            </div>
                        </div>
                    </div>
                  </div>
              )}

              {classroomMode === 'exam' && activeCourse.exam && (
                  <div className="bg-white rounded-3xl p-6 md:p-12 shadow-xl border border-slate-100 animate-[fadeIn_0.3s_ease-out]">
                      <div className="text-center mb-8 border-b border-slate-100 pb-6"><div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner"><CheckSquareOffset size={32} weight="fill"/></div><h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Ujian Akhir Kelas</h2><p className="text-slate-500 text-sm md:text-base">Nilai kelulusan minimal: <b className="text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">{activeCourse.exam.minScore} Poin</b></p></div>
                      <div className="mb-8"><div className="flex justify-between items-center mb-2"><span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progres Pengerjaan</span><span className="text-xs font-extrabold text-indigo-600">Soal {currentQuestionIndex + 1} dari {activeCourse.exam.questions.length}</span></div><div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden shadow-inner"><div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${((currentQuestionIndex + 1) / activeCourse.exam.questions.length) * 100}%` }}></div></div></div>
                      <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-200/60"><div className="flex flex-wrap justify-center gap-2">
                              {activeCourse.exam.questions.map((_, idx) => {
                                  const isAnswered = studentAnswers[idx] !== undefined; const isActive = idx === currentQuestionIndex;
                                  return (<button key={idx} onClick={() => setCurrentQuestionIndex(idx)} className={`w-10 h-10 rounded-xl font-bold text-sm transition-all flex items-center justify-center border-2 ${isActive ? 'bg-indigo-600 text-white border-indigo-600 ring-4 ring-indigo-100' : isAnswered ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}>{idx + 1}</button>);
                              })}
                      </div></div>

                      {(() => {
                          const q = activeCourse.exam.questions[currentQuestionIndex]; if (!q) return null;
                          return (
                              <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 relative mb-8">
                                  <div className="absolute top-0 left-6 -mt-3 bg-indigo-600 text-white font-bold text-xs px-4 py-1 rounded-full uppercase tracking-widest shadow-sm">Soal {currentQuestionIndex + 1}</div>
                                  <h3 className="font-extrabold text-lg md:text-xl mb-6 text-slate-900 mt-2 leading-relaxed">{q.q}</h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                      {q.options.map((opt, optIdx) => (
                                          <label key={optIdx} className={`flex items-center p-4 md:p-5 border-2 rounded-2xl cursor-pointer transition-all transform active:scale-[0.98] ${studentAnswers[currentQuestionIndex] === optIdx ? 'bg-indigo-50 border-indigo-500 shadow-md shadow-indigo-100' : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}>
                                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mr-4 transition ${studentAnswers[currentQuestionIndex] === optIdx ? 'border-indigo-600' : 'border-slate-300'}`}>{studentAnswers[currentQuestionIndex] === optIdx && (<div className="w-3 h-3 bg-indigo-600 rounded-full"></div>)}</div>
                                              <input type="radio" name={`q_${currentQuestionIndex}`} value={optIdx} onChange={() => setStudentAnswers({...studentAnswers, [currentQuestionIndex]: optIdx})} checked={studentAnswers[currentQuestionIndex] === optIdx} className="hidden" />
                                              <span className={`font-bold text-base md:text-lg ${studentAnswers[currentQuestionIndex] === optIdx ? 'text-indigo-900' : 'text-slate-700'}`}>{opt}</span>
                                          </label>
                                      ))}
                                  </div>
                              </div>
                          );
                      })()}

                      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-200">
                          <button onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))} disabled={currentQuestionIndex === 0} className="w-full sm:w-auto px-6 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"><ArrowLeft size={18} weight="bold" /><span>Sebelumnya</span></button>
                          {currentQuestionIndex < activeCourse.exam.questions.length - 1 ? (
                              <button onClick={() => setCurrentQuestionIndex(prev => prev + 1)} className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 active:scale-95"><span>Selanjutnya</span><ChevronRight size={18} weight="bold" /></button>
                          ) : (
                              <button onClick={submitExam} disabled={Object.keys(studentAnswers).length < activeCourse.exam.questions.length} className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-indigo-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-xl font-extrabold text-base shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2"><span>Serahkan Jawaban</span><CheckSquareOffset size={20} weight="bold" /></button>
                          )}
                      </div>
                  </div>
              )}

              {classroomMode === 'result' && (
                  <div className="bg-white rounded-3xl p-8 md:p-16 shadow-2xl border border-slate-100 text-center max-w-2xl mx-auto mt-6 md:mt-12 relative overflow-hidden animate-[fadeIn_0.5s_ease-out]">
                      <div className={`absolute top-0 left-0 w-full h-3 ${myEnr?.isGraduated ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-red-400 to-rose-500'}`}></div>
                      <div className={`w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner ${myEnr?.isGraduated ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>{myEnr?.isGraduated ? <Award size={56} weight="fill"/> : <X size={56} weight="bold"/>}</div>
                      <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">{myEnr?.isGraduated ? 'Luar Biasa, Anda Lulus!' : 'Belum Berhasil, Coba Lagi!'}</h2>
                      <p className="text-slate-500 mb-10 text-lg md:text-xl font-medium">Skor Pencapaian Akhir: <span className={`font-black text-3xl ml-2 ${myEnr?.isGraduated ? 'text-emerald-600' : 'text-red-600'}`}>{myEnr?.examScore}</span><span className="text-slate-400 text-base"> / {(activeCourse.exam?.questions?.length || 10) * 10}</span></p>
                      
                      {!myEnr?.isGraduated ? (
                          <button onClick={()=>{setClassroomMode('exam'); setStudentAnswers({});}} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 md:py-5 rounded-2xl font-extrabold text-lg shadow-xl shadow-slate-200 transition transform active:scale-95 flex justify-center items-center"><RefreshCw size={24} className="mr-2" weight="bold"/> Kerjakan Ulang Ujian</button>
                      ) : (
                          <div className="space-y-4">
                              <button onClick={handleDownloadCert} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 md:py-5 rounded-2xl font-extrabold text-lg shadow-xl shadow-emerald-200 transition transform active:scale-95 flex items-center justify-center"><Download size={24} className="mr-3" weight="bold"/> Unduh Sertifikat Resmi</button>
                              {instructorData?.donationLink && (<a href={instructorData.donationLink} target="_blank" rel="noopener noreferrer" className="w-full bg-amber-50 hover:bg-amber-100 text-amber-700 border-2 border-amber-200 py-4 md:py-5 rounded-2xl font-bold transition flex items-center justify-center shadow-sm"><Coffee size={24} className="mr-3" weight="fill"/> Berikan Apresiasi Instruktur</a>)}
                          </div>
                      )}
                  </div>
              )}
            </div>
          </main>
        </div>
      </div>
    );
  }
  return null;
}

ReactDOM.createRoot(document.getElementById('root')).render(<SiswaApp />);