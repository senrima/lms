import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import '../index.css';

// URL Cloudflare Worker Anda
const DEFAULT_SHEETS_URL = "https://lms.senrima-ms.workers.dev/?kunci=RAHASIA-S-TOOLS";

const IconWrapper = ({ name, size = 24, className = "", weight="regular" }) => (
    <i className={`ph${weight === 'fill' ? '-fill' : weight === 'duotone' ? '-duotone' : weight === 'bold' ? '-bold' : ''} ph-${name} ${className}`} style={{ fontSize: size }}></i>
);

function AuthApp() {
    const [loginMode, setLoginMode] = useState('siswa');
    const [userId, setUserId] = useState('');
    const [passKey, setPassKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const session = sessionStorage.getItem('edu_session');
        if (session) {
            try {
                const parsed = JSON.parse(session);
                if (parsed.role === 'super_admin') window.location.href = 'super.html';
                else if (parsed.role === 'admin') window.location.href = 'instruktur.html';
                else if (parsed.role === 'participant') window.location.href = 'siswa.html';
            } catch (e) {
                sessionStorage.removeItem('edu_session');
            }
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!userId || !passKey) {
            setErrorMsg("Harap lengkapi semua kolom.");
            return;
        }

        setIsLoading(true);
        setErrorMsg('');

        try {
            const payload = loginMode === 'siswa'
                ? { action: "login", loginType: "siswa", email: userId.trim().toLowerCase(), pin: passKey.trim() }
                : { action: "login", loginType: "admin", username: userId.trim().toLowerCase(), password: passKey };

            const respons = await fetch(DEFAULT_SHEETS_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const hasil = await respons.json();

            if (hasil.status === "success") {
                sessionStorage.setItem('edu_session', JSON.stringify({ role: hasil.role, data: hasil.data }));
                if (hasil.role === "super_admin") window.location.href = 'super.html';
                else if (hasil.role === "admin") window.location.href = 'instruktur.html';
                else window.location.href = 'siswa.html';
            } else {
                setErrorMsg(hasil.message || "Login ditolak oleh server.");
            }
        } catch (error) {
            setErrorMsg("Gagal menghubungi server. Periksa koneksi internet Anda.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans animate-[fadeIn_0.3s_ease-out]">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-6 -mt-6 text-white/5"><IconWrapper name="shield-check" size={150} weight="fill" /></div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-indigo-500/30">
                            <IconWrapper name="graduation-cap" size={36} weight="fill" />
                        </div>
                        <h1 className="text-2xl font-black text-white tracking-tight">EduLearn</h1>
                        <p className="text-indigo-200 text-sm font-bold tracking-widest uppercase mt-1">by SenTools</p>
                    </div>
                </div>

                <div className="p-8">
                    <div className="flex bg-slate-100 p-1.5 rounded-xl mb-8">
                        <button 
                            type="button"
                            onClick={() => { setLoginMode('siswa'); setUserId(''); setPassKey(''); setErrorMsg(''); }} 
                            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${loginMode === 'siswa' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Peserta Didik
                        </button>
                        <button 
                            type="button"
                            onClick={() => { setLoginMode('admin'); setUserId(''); setPassKey(''); setErrorMsg(''); }} 
                            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${loginMode === 'admin' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Pengajar
                        </button>
                    </div>

                    {errorMsg && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 animate-[fadeIn_0.2s_ease-out]">
                            <IconWrapper name="warning-circle" size={20} weight="fill" className="shrink-0 mt-0.5" />
                            <p className="text-sm font-bold">{errorMsg}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                {loginMode === 'siswa' ? 'Alamat Email' : 'Username'}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <IconWrapper name={loginMode === 'siswa' ? "envelope-simple" : "user"} size={20} weight="bold" />
                                </div>
                                <input 
                                    type={loginMode === 'siswa' ? "email" : "text"} 
                                    value={userId} 
                                    onChange={(e) => setUserId(e.target.value)} 
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition" 
                                    placeholder={loginMode === 'siswa' ? "email@contoh.com" : "Masukkan username"} 
                                    required 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                {loginMode === 'siswa' ? 'PIN Akses (6 Digit)' : 'Kata Sandi'}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <IconWrapper name={loginMode === 'siswa' ? "key" : "lock"} size={20} weight="bold" />
                                </div>
                                <input 
                                    type="password" 
                                    value={passKey} 
                                    onChange={(e) => setPassKey(e.target.value)} 
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition" 
                                    placeholder={loginMode === 'siswa' ? "••••••" : "Masukkan kata sandi"} 
                                    required 
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading} 
                            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-4 rounded-xl font-black text-base shadow-lg shadow-indigo-200 transition transform active:scale-95 flex items-center justify-center"
                        >
                            {isLoading ? (
                                <IconWrapper name="spinner-gap" size={24} weight="bold" className="animate-spin" />
                            ) : (
                                <>
                                    <span>Masuk ke Sistem</span>
                                    <IconWrapper name="sign-in" size={20} weight="bold" className="ml-2" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
                <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-400">
                        <IconWrapper name="lock-key" size={14} className="inline mr-1" weight="fill" />
                        Akses diamankan dengan S-Tools ID
                    </p>
                </div>
            </div>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AuthApp />);
