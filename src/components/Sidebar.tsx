import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Search, 
  Stethoscope, 
  ClipboardList, 
  AlertTriangle, 
  BarChart3, 
  Settings, 
  LogOut,
  X,
  HeartHandshake
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { 
    activeTab, 
    setActiveTab, 
    patients, 
    emergencyAlerts, 
    logout,
    currentUser 
  } = useApp();

  const waitingCount = patients.filter(p => p.status === 'Waiting').length;
  const activeAlertsCount = emergencyAlerts.filter(a => a.status === 'Active').length;

  const navItems: { id: ActiveTab; label: string; icon: React.ElementType; badge?: number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Patients', icon: Users, badge: patients.length, badgeColor: 'bg-slate-100 text-slate-600' },
    { id: 'register', label: 'Register Patient', icon: UserPlus },
    { id: 'search', label: 'Search Patient', icon: Search },
    { id: 'triage', label: 'Patient Triage', icon: Stethoscope },
    { id: 'queue', label: 'Patient Queue', icon: ClipboardList, badge: waitingCount, badgeColor: 'bg-teal-50 text-teal-700' },
    { id: 'alerts', label: 'Emergency Alerts', icon: AlertTriangle, badge: activeAlertsCount, badgeColor: 'bg-rose-100 text-rose-700' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-2xs lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 tracking-wider">
            MAIN NAVIGATION
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 font-semibold shadow-2xs border border-teal-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-teal-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.5 text-[11px] font-bold rounded-md ${
                      item.badgeColor || 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Hospital Helper Card */}
        <div className="p-3 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-gradient-to-br from-teal-50/80 to-cyan-50/80 border border-teal-100/60 text-xs">
            <div className="flex items-center gap-2 text-teal-800 font-semibold mb-1">
              <HeartHandshake className="w-4 h-4 text-teal-600" />
              <span>SmartCare Hospital</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Designed for simple patient records, rapid retrieval & intelligent triage.
            </p>
          </div>

          <button
            onClick={logout}
            className="w-full mt-2 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
