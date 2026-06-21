import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';

const API_ENDPOINT = "https://api.s-tools.id";
const LOGIN_PORTAL_URL = "https://s-tools.id/edu/page-instruktur.html";

const _0xDbChunks = [
    "aHR0cHM6Ly9zY3JpcHQuZ29v",
    "Z2xlLmNvbS9tYWNyb3Mvcy9B",
    "S2Z5Y2J6RXdlUkQ2dTVmeGVH",
    "SEtOR0VJTFhZOWkzcXhibTdP",
    "QVlMZHRaeGxHdmdEOXhDb01D",
    "aUN3OGJDbmpDLXhad3cxbksv",
    "ZXhlYw=="
];
//const DEFAULT_SHEETS_URL = atob(_0xDbChunks.join(""));
const DEFAULT_SHEETS_URL = "https://lms.senrima-ms.workers.dev/";

const IconWrapper = ({ name, size = 24, className = "", weight="regular" }) => <i className={`ph${weight === 'fill' ? '-fill' : weight === 'duotone' ? '-duotone' : weight === 'bold' ? '-bold' : ''} ph-${name} ${className}`} style={{ fontSize: size }}></i>;
const ShieldCheck = (p) => <IconWrapper name="shield-check" {...p} />;
const X = (p) => <IconWrapper name="x" {...p} />;
const Database = (p) => <IconWrapper name="database" {...p} />;

function AuthApp() {
  const [dbMode] = useState(() => localStorage.getItem('edu_db_mode') || 'sheets');
  const [dbReady, setDbReady] = useState(false);
  const [setupError, setSetupError] = useState("");
  
  const [admins, setAdmins] = useState([]);
  const [participants, setParticipants] = useState([]);

  const [appMode, setAppMode] = useState('auth'); 
  const [authStatus, setAuthStatus] = useState("Menginisiasi Keamanan Sistem...");
  const [loginMatches, setLoginMatches] = useState(null);

  useEffect(() => {
    if (dbMode === 'local') {
      setAdmins(JSON.parse(localStorage.getItem('edu_admins')) || []);
      setParticipants(JSON.parse(localStorage.getItem('edu_participants')) || []);
      setDbReady(true);
    } else if (dbMode === 'sheets') {
      const url = localStorage.getItem('edu_sheets_url') || DEFAULT_SHEETS_URL;
      if(!url) { setAppMode('setup_db'); return; }
      const fetchUrl = url + (url.includes('?') ? '&' : '?') + 'nocache=' + new Date().getTime();
      fetch(fetchUrl)
        .then(res => { if(!res.ok) throw new Error("Network error"); return res.json(); })
        .then(data => {
            if(data.admins) {
                const uniqueAdmins = Array.from(new Map(data.admins.map(a => [a.id, a])).values());
                setAdmins(uniqueAdmins); localStorage.setItem('edu_admins', JSON.stringify(uniqueAdmins));
            }
            if(data.participants) {
                setParticipants(data.participants); localStorage.setItem('edu_participants', JSON.stringify(data.participants));
            }
            setDbReady(true);
        })
        .catch(e => { 
            let errorMsg = "Database belum terkoneksi. Silakan periksa jaringan internet Anda atau coba lagi nanti.";
            if (e.toString().includes("Failed to fetch") || e.toString().includes("Network error")) {
                errorMsg = "Koneksi ke Database diblokir oleh browser (CORS). Anda HARUS memperbarui Deployment GAS dengan memilih 'Versi Baru' (New Version) pada opsi Kelola Penerapan.";
            }
            setSetupError(errorMsg); setAppMode('setup_db'); 
        });
    }
  }, [dbMode]);

  useEffect(() => {
      if (appMode === 'auth' && dbReady) {
          const performSSO = async () => {
              setAuthStatus("Memverifikasi Keamanan Sistem S-Tools ID...");
              const localToken = localStorage.getItem('sessionToken');
              const headers = { 'Content-Type': 'application/json' };
              if (localToken) headers['x-auth-token'] = localToken;

              try {
                  const response = await fetch(API_ENDPOINT, {
                      method: 'POST',
                      headers: headers,
                      credentials: 'include', 
                      body: JSON.stringify({ kontrol: 'proteksi', action: 'getDashboardData' })
                  });
                  const result = await response.json();
                  
                  if (result.status === 'success' && result.userData) {
                      setAuthStatus("Akses diterima! Membuka gerbang EduLearn...");
                      const ssoEmail = String(result.userData.email || result.userData.username || '').trim().toLowerCase();
                      
                      const adminFound = admins.find(a => (a.email && String(a.email).trim().toLowerCase() === ssoEmail) || String(a.username).trim().toLowerCase() === ssoEmail);
                      
                      if (adminFound) {
                          if (!adminFound.isActive) { 
                              setAuthStatus("Akses ditolak: Akun Instruktur Anda dinonaktifkan oleh Sistem."); 
                              return; 
                          }
                          const adminEmail = adminFound.email ? String(adminFound.email).trim().toLowerCase() : `${String(adminFound.username).trim().toLowerCase()}@edulearn.local`;
                          let matchedPart = participants.find(p => p.email.trim().toLowerCase() === adminEmail);
                          if (!matchedPart) {
                              matchedPart = { id: 'p_virtual_' + adminFound.username, name: adminFound.name || adminFound.username, email: adminEmail, accessCode: adminFound.password };
                          }
                          const roles = [];
                          const isItSuper = adminFound.isSuper === true || adminFound.isSuper === 'true' || adminFound.isSuper === 'TRUE';
                          if (isItSuper) { roles.push({ id: 'super_admin', label: 'Super Admin', desc: 'Akses penuh ke semua kontrol.', icon: 'shield-check', color: 'from-amber-500 to-orange-600', url: 'super.html' }); }
                          roles.push({ id: 'admin', label: 'Instruktur', desc: 'Kelola kelas Anda sendiri.', icon: 'chalkboard-teacher', color: 'from-indigo-500 to-indigo-700', url: 'instruktur.html' });
                          roles.push({ id: 'participant', label: 'Peserta Belajar', desc: 'Masuk ke ruang belajar.', icon: 'graduation-cap', color: 'from-emerald-500 to-teal-600', url: 'siswa.html' });

                          setLoginMatches({ admin: adminFound, participant: matchedPart, roles });
                          setAppMode('role_selection');
                          return;
                      }

                      const partFound = participants.find(p => p.email.trim().toLowerCase() === ssoEmail);
                      if (partFound) {
                          const sessData = { role: 'participant', data: partFound };
                          sessionStorage.setItem('edu_session', JSON.stringify(sessData));
                          window.location.href = 'siswa.html';
                          return;
                      }

                      setAuthStatus(`Akses ditolak: Email (${ssoEmail}) belum terdaftar.`);
                  } else {
                      throw new Error("Sesi tidak valid");
                  }
              } catch (error) {
                  setAuthStatus("Sesi ditolak. Mengarahkan Anda ke S-Tools ID...");
                  localStorage.removeItem('sessionToken');
                  setTimeout(() => {
                      window.location.href = LOGIN_PORTAL_URL + "?redirect=" + encodeURIComponent(window.location.href);
                  }, 1500);
              }
          };
          
          performSSO();
      }
  }, [appMode, dbReady, admins, participants]);

  const handleSelectRole = (role) => {
    let sessData = null;
    if (role.id === 'super_admin') { sessData = { role: 'super_admin', data: loginMatches.admin }; } 
    else if (role.id === 'admin') { sessData = { role: 'admin', data: loginMatches.admin }; } 
    else { sessData = { role: 'participant', data: loginMatches.participant }; }
    
    sessionStorage.setItem('edu_session', JSON.stringify(sessData));
    window.location.href = role.url;
  };

  const handleCancel = () => {
      setLoginMatches(null);
      setAppMode('auth');
      window.location.href = LOGIN_PORTAL_URL;
  };

  if (!dbReady && appMode !== 'setup_db') {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
              <div className="animate-spin text-indigo-600 mb-4"><IconWrapper name="spinner-gap" size={48} weight="bold" /></div>
              <h2 className="text-xl font-bold text-slate-700">Menghubungkan ke Database...</h2>
          </div>
      );
  }

  if (appMode === 'setup_db') {
      return (
          <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
              <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100 text-center">
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Database size={32} weight="fill" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900">Koneksi Database Gagal</h2>
                  <p className="text-slate-500 mt-2 mb-6">{setupError || "Gagal menghubungi database Google Sheets."}</p>
                  <button onClick={() => window.location.reload()} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg">Coba Lagi</button>
              </div>
          </div>
      );
  }

  if (appMode === 'auth') {
      return (
          <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
              <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-md border border-slate-100 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100"><div className="h-full bg-indigo-600 animate-pulse w-full"></div></div>
                  <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner relative">
                      <ShieldCheck size={48} weight="fill" className={authStatus.includes('ditolak') ? 'text-red-500' : 'animate-bounce'} />
                      {!authStatus.includes('ditolak') && <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin"></div>}
                  </div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Keamanan Sistem</h1>
                  <p className="text-slate-500 font-medium mb-6 text-sm px-4">{authStatus}</p>
                  
                  {authStatus && authStatus.includes('ditolak') && (
                      <div className="mt-6 flex flex-col gap-3">
                          <button onClick={() => window.location.href = LOGIN_PORTAL_URL + "?redirect=" + encodeURIComponent(window.location.href)} className="w-full bg-indigo-600 text-white px-4 py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">Login S-Tools ID</button>
                      </div>
                  )}
              </div>
          </div>
      );
  }

  if (appMode === 'role_selection' && loginMatches) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
              <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-lg border border-slate-100">
                  <div className="text-center mb-8">
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Pilih Akses Peran</h2>
                      <p className="text-slate-500 mt-2 text-sm">Sistem mendeteksi bahwa akun Anda memiliki beberapa otorisasi. Sebagai apa Anda ingin masuk hari ini?</p>
                  </div>
                  <div className="space-y-4">
                      {loginMatches.roles.map(role => (
                          <button key={role.id} onClick={() => handleSelectRole(role)} className="w-full text-left p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md transition-all flex items-center group bg-white">
                              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center text-white shrink-0 mr-5 shadow-inner group-hover:scale-105 transition-transform`}>
                                  <IconWrapper name={role.icon} size={28} weight="fill" />
                              </div>
                              <div>
                                  <h3 className="font-extrabold text-lg text-slate-800 group-hover:text-indigo-700 transition-colors">{role.label}</h3>
                                  <p className="text-xs text-slate-500 font-medium mt-0.5 leading-relaxed">{role.desc}</p>
                              </div>
                          </button>
                      ))}
                  </div>
                  <button onClick={handleCancel} className="w-full mt-6 py-3 text-slate-500 hover:text-red-500 font-bold text-sm transition flex items-center justify-center gap-1.5"><X size={16} weight="bold"/> Batal & Kembali</button>
              </div>
          </div>
      );
  }

  return null;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AuthApp />);
