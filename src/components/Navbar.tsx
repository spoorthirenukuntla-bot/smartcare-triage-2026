import React, { useState } from 'react';
import { 
  HeartPulse, 
  Bell, 
  Menu, 
  X, 
  Plus, 
  Search, 
  User as UserIcon, 
  ChevronDown, 
  LogOut, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { 
    currentUser, 
    logout, 
    switchRole, 
    emergencyAlerts, 
    setActiveTab, 
    activeTab,
    patients 
  } = useApp();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const activeAlerts = emergencyAlerts.filter(a => a.status === 'Active');

  const roleLabels: Record<UserRole, { title: string; color: string }> = {
    doctor: { title: 'Doctor', color: 'bg-teal-50 text-teal-700 border-teal-200' },
    nurse: { title: 'Nurse / Triage', color: 'bg-sky-50 text-sky-700 border-sky-200' },
    receptionist: { title: 'Receptionist', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    patient: { title: 'Patient', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  };

  const currentRoleInfo = currentUser ? roleLabels[currentUser.role] : null;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Zone: Hamburger for mobile + Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white shadow-sm shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                  SmartCare
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium hidden sm:inline -mt-0.5">
                  Hospital Management & Triage
                </span>
              </div>
            </button>
          </div>

          {/* Center Zone: Quick Search trigger button & fast status */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setActiveTab('search')}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors w-64 text-left"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">Search by name, ID or phone...</span>
              <kbd className="ml-auto text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-400 font-mono">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Zone: Emergency Alerts, Quick Actions, Role Switcher & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Emergency Alert indicator */}
            <button
              onClick={() => setActiveTab('alerts')}
              className={`relative p-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeAlerts.length > 0
                  ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={`${activeAlerts.length} Active Emergency Alerts`}
            >
              <Bell className={`w-5 h-5 ${activeAlerts.length > 0 ? 'text-rose-600 animate-bounce' : 'text-slate-500'}`} />
              {activeAlerts.length > 0 && (
                <span className="flex items-center gap-1 text-xs font-bold text-rose-700">
                  <span className="hidden sm:inline">Emergency</span>
                  <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold">
                    {activeAlerts.length}
                  </span>
                </span>
              )}
            </button>

            {/* Quick Action: Register Patient button */}
            <button
              onClick={() => setActiveTab('register')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Patient</span>
            </button>

            {/* Role Switcher Pill */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${currentRoleInfo?.color || 'bg-slate-100 text-slate-700 border-slate-200'}`}
                >
                  <span className="truncate max-w-[100px] sm:max-w-none">{currentRoleInfo?.title}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isRoleMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400">
                      SWITCH USER ROLE
                    </div>
                    {(['doctor', 'nurse', 'receptionist', 'patient'] as UserRole[]).map(role => (
                      <button
                        key={role}
                        onClick={() => {
                          switchRole(role);
                          setIsRoleMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          currentUser.role === role ? 'font-semibold text-teal-700 bg-teal-50/50' : 'text-slate-700'
                        }`}
                      >
                        <span className="capitalize">{role}</span>
                        {currentUser.role === role && <span className="text-teal-600">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Avatar / Logout Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                  aria-label="User Profile Menu"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm shadow-2xs">
                    {currentUser.avatar || '👤'}
                  </div>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-800 truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        setActiveTab('settings');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Hospital Settings
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 transition-colors border-t border-slate-100 mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : null}

          </div>

        </div>
      </div>
    </header>
  );
};
