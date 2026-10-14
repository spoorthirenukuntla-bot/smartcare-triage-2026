import React, { useState } from 'react';
import { 
  HeartPulse, 
  Mail, 
  Phone, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Stethoscope,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import hospitalHeroImg from '../assets/images/smartcare_hospital_hero_1791252479496.jpg';

export const AuthView: React.FC = () => {
  const { login, register, showToast } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('emily.watson@smartcare.hospital');
  const [loginPassword, setLoginPassword] = useState('••••••••');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('nurse');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      showToast('Please enter your email or phone number', 'warning');
      return;
    }
    login(loginIdentifier);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPhone.trim()) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    register(regName, regEmail, regPhone, regRole);
  };

  const handleOneClickDemo = (identifier: string, role: UserRole) => {
    login(identifier, role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50/50 to-sky-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Decorative healthcare ambient background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-teal-200/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-sky-200/30 blur-3xl" />
      </div>

      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-teal-100/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Visual / Brand Showcase Panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-teal-700 via-teal-800 to-cyan-900 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            {!imgError ? (
              <img 
                src={hospitalHeroImg} 
                alt="SmartCare Hospital" 
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-teal-800 to-cyan-950" />
            )}
          </div>

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-teal-300 shadow-inner">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight text-white block">SmartCare</span>
                <span className="text-xs text-teal-200 font-medium">Hospital Management & Triage</span>
              </div>
            </div>

            <div className="mt-10 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
                “Efficient Patient Data Organization & Intelligent Triage”
              </h2>
              <p className="text-sm text-teal-100/90 leading-relaxed">
                SmartCare empowers patients, doctors, nurses, and receptionists with clear records, rapid retrieval, and intelligent preliminary triage urgency guidance.
              </p>
            </div>
          </div>

          {/* Key Value Points */}
          <div className="relative z-10 mt-8 pt-6 border-t border-teal-600/50 space-y-3">
            <div className="flex items-center gap-2.5 text-xs text-teal-100">
              <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0" />
              <span>Easy digital records without complicated medical jargon</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-teal-100">
              <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0" />
              <span>Color-coded triage: Red, Orange, Yellow, and Green</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-teal-100">
              <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0" />
              <span>Instant queue prioritization for urgent medical needs</span>
            </div>
          </div>
        </div>

        {/* Right Form Panel: Login / Register */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-white">
          
          {/* Header Switcher */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {mode === 'login' ? 'Welcome to SmartCare' : 'Create an Account'}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {mode === 'login' 
                  ? 'Sign in to access patient records, triage, and queue management.' 
                  : 'Join SmartCare as a patient, doctor, nurse, or receptionist.'}
              </p>
            </div>

            {/* Mode toggle button */}
            <div className="flex p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  mode === 'login'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  mode === 'register'
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {/* Quick Demo Logins for instant evaluation */}
          <div className="my-5 p-3.5 rounded-2xl bg-teal-50/70 border border-teal-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-teal-900 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                ONE-CLICK DEMO ACCESS
              </span>
              <span className="text-[10px] text-teal-700">Click any role to test immediately</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleOneClickDemo('emily.watson@smartcare.hospital', 'doctor')}
                className="px-2.5 py-1.5 bg-white hover:bg-teal-100/60 border border-teal-200 text-teal-800 rounded-xl text-xs font-medium text-center transition-colors shadow-2xs"
              >
                👩‍⚕️ Doctor
              </button>
              <button
                type="button"
                onClick={() => handleOneClickDemo('sarah.nurse@smartcare.hospital', 'nurse')}
                className="px-2.5 py-1.5 bg-white hover:bg-teal-100/60 border border-teal-200 text-teal-800 rounded-xl text-xs font-medium text-center transition-colors shadow-2xs"
              >
                🧑‍⚕️ Nurse
              </button>
              <button
                type="button"
                onClick={() => handleOneClickDemo('david.frontdesk@smartcare.hospital', 'receptionist')}
                className="px-2.5 py-1.5 bg-white hover:bg-teal-100/60 border border-teal-200 text-teal-800 rounded-xl text-xs font-medium text-center transition-colors shadow-2xs"
              >
                👨‍💼 Receptionist
              </button>
              <button
                type="button"
                onClick={() => handleOneClickDemo('robert.chen@email.com', 'patient')}
                className="px-2.5 py-1.5 bg-white hover:bg-teal-100/60 border border-teal-200 text-teal-800 rounded-xl text-xs font-medium text-center transition-colors shadow-2xs"
              >
                👤 Patient
              </button>
            </div>
          </div>

          {/* Form */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Email Address or Phone Number
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={e => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. emily.watson@smartcare.hospital or phone number"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs text-teal-600 hover:text-teal-700 font-medium hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Login to SmartCare</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="text-teal-700 font-semibold hover:underline"
                  >
                    Register here
                  </button>
                </span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="e.g. Dr. Alan Grant"
                    className="w-full pl-9 pr-3.5 py-2 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-9 pr-3.5 py-2 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={e => setRegPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-9 pr-3.5 py-2 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* User Type Selection */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Select User Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['patient', 'doctor', 'nurse', 'receptionist'] as UserRole[]).map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setRegRole(role)}
                      className={`p-2 rounded-xl border text-xs font-medium capitalize text-center transition-all ${
                        regRole === role
                          ? 'border-teal-600 bg-teal-50 text-teal-800 font-semibold ring-1 ring-teal-500'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {role === 'patient' && '👤 '}
                      {role === 'doctor' && '👩‍⚕️ '}
                      {role === 'nurse' && '🧑‍⚕️ '}
                      {role === 'receptionist' && '👨‍💼 '}
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="Create password"
                    className="w-full px-3.5 py-2 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={e => setRegConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3.5 py-2 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Register Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-1">
                <span className="text-xs text-slate-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-teal-700 font-semibold hover:underline"
                  >
                    Login here
                  </button>
                </span>
              </div>
            </form>
          )}

        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Reset Your Password</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
              Enter your registered email address or phone number. We will send a secure link to reset your password.
            </p>

            {forgotSent ? (
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-800 mb-4">
                ✓ Password reset instructions have been sent to <strong>{forgotEmail || 'your email'}</strong>.
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  placeholder="Enter email or phone"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (forgotEmail.trim()) {
                      setForgotSent(true);
                      setTimeout(() => {
                        setShowForgotModal(false);
                        setForgotSent(false);
                      }, 2500);
                    }
                  }}
                  className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Send Reset Link
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setShowForgotModal(false);
                setForgotSent(false);
              }}
              className="w-full mt-2 py-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
