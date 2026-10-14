import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Building2, 
  Phone, 
  ShieldCheck, 
  RotateCcw, 
  Bell, 
  User, 
  Check, 
  Info,
  HeartPulse
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

export const SettingsView: React.FC = () => {
  const { 
    currentUser, 
    switchRole, 
    resetDemoData, 
    showToast 
  } = useApp();

  const [hospitalName, setHospitalName] = useState('SmartCare Memorial General Hospital');
  const [emergencyPhone, setEmergencyPhone] = useState('+1 (555) 911-CARE (2273)');
  const [address, setAddress] = useState('100 Medical Center Parkway, Metro Health District');
  const [audioAlerts, setAudioAlerts] = useState(true);
  const [autoQueueSort, setAutoQueueSort] = useState(true);

  const handleSaveHospitalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Hospital configuration saved successfully', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System & Hospital Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure hospital facility parameters, emergency contact routing, and user roles.
        </p>
      </div>

      {/* User Role Testing Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
          <User className="w-4 h-4 text-teal-600" />
          <span>Active User & Role Testing</span>
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div>
            <span className="text-xs font-bold text-slate-900 block">{currentUser?.name}</span>
            <span className="text-[11px] text-slate-500">{currentUser?.email} · {currentUser?.role.toUpperCase()}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(['doctor', 'nurse', 'receptionist', 'patient'] as UserRole[]).map(r => (
              <button
                key={r}
                onClick={() => switchRole(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                  currentUser?.role === r
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hospital Information Form */}
      <form onSubmit={handleSaveHospitalInfo} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
          <Building2 className="w-4 h-4 text-teal-600" />
          <span>Hospital Profile</span>
        </h3>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Hospital / Clinic Name</label>
          <input
            type="text"
            value={hospitalName}
            onChange={e => setHospitalName(e.target.value)}
            className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Emergency Trauma Hotline</label>
            <input
              type="text"
              value={emergencyPhone}
              onChange={e => setEmergencyPhone(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Facility Address</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-500"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            Save Hospital Info
          </button>
        </div>
      </form>

      {/* System Triage & Queue Preferences */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
          <Bell className="w-4 h-4 text-teal-600" />
          <span>Triage & Queue Workflow Preferences</span>
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Automatic Urgency Queue Sorting</span>
              <span className="text-[11px] text-slate-500">
                Keep RED emergencies and ORANGE urgent cases at the top of the waiting list automatically.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAutoQueueSort(!autoQueueSort)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${autoQueueSort ? 'bg-teal-600' : 'bg-slate-300'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${autoQueueSort ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Emergency Alerts Banner Alerting</span>
              <span className="text-[11px] text-slate-500">
                Display prominent banner when SpO2 &lt; 90% or acute chest pain is flagged.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAudioAlerts(!audioAlerts)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${audioAlerts ? 'bg-teal-600' : 'bg-slate-300'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${audioAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Demo Reset Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-900 block">Reset Demo Sample Records</span>
          <span className="text-[11px] text-slate-500">
            Restore original patient cases (Robert Chen, Maria Garcia, David Kim, etc.) and clear local changes.
          </span>
        </div>

        <button
          onClick={resetDemoData}
          className="px-4 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Records</span>
        </button>
      </div>

    </div>
  );
};
