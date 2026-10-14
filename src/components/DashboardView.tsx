import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  AlertCircle, 
  BedDouble, 
  UserPlus, 
  Search, 
  FolderHeart, 
  Stethoscope, 
  ClipboardList, 
  ArrowRight, 
  AlertTriangle,
  ChevronRight,
  Activity,
  HeartPulse,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TriageLevel } from '../types';
import doctorTeamImg from '../assets/images/smartcare_doctor_team_1791252497019.jpg';

export const DashboardView: React.FC = () => {
  const { 
    patients, 
    emergencyAlerts, 
    setActiveTab, 
    viewPatient, 
    startTriageForPatient,
    currentUser,
    acknowledgeAlert 
  } = useApp();

  const [imgError, setImgError] = useState(false);

  const totalPatients = patients.length;
  const waitingPatients = patients.filter(p => p.status === 'Waiting');
  const criticalPatients = patients.filter(p => p.priority === 'RED');
  const admittedPatients = patients.filter(p => p.status === 'Admitted');
  const activeAlerts = emergencyAlerts.filter(a => a.status === 'Active');

  const priorityOrder: Record<string, number> = {
    RED: 1,
    ORANGE: 2,
    YELLOW: 3,
    GREEN: 4,
  };

  const priorityBadges: Record<string, { label: string; bg: string; text: string; dot: string }> = {
    RED: { label: 'Emergency', bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-600' },
    ORANGE: { label: 'Urgent', bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
    YELLOW: { label: 'Moderate', bg: 'bg-amber-50', text: 'text-amber-800', dot: 'bg-amber-500' },
    GREEN: { label: 'Low Priority', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  };

  const defaultBadge = priorityBadges.GREEN;

  // Patients sorted by urgency for quick snapshot (safe against missing fields)
  const queueSorted = [...patients]
    .filter(p => p.status === 'Waiting' || p.status === 'In Consultation')
    .sort((a, b) => {
      const pDiff = (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
      if (pDiff !== 0) return pDiff;
      return (b.waitingTimeMinutes || 0) - (a.waitingTimeMinutes || 0);
    });

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-800 rounded-3xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none hidden md:block">
          {!imgError ? (
            <img 
              src={doctorTeamImg} 
              alt="Medical Team"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-teal-900/30" />
          )}
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-teal-100 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-teal-200" />
            <span>SmartCare Live Hospital Overview</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Hello, {currentUser?.name || 'Staff Member'} 👋
          </h1>
          <p className="text-sm text-teal-100/90 mt-1.5 leading-relaxed">
            Welcome to the SmartCare central board. Monitor patient flow, review urgent triage alerts, and quickly organize care across all hospital departments.
          </p>
        </div>
      </div>

      {/* Emergency Alert Banner (Noticeable if active alerts exist) */}
      {activeAlerts.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-rose-100 text-rose-700 rounded-xl mt-0.5 sm:mt-0 animate-pulse">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-200/70 px-2 py-0.5 rounded-md">
                    🔴 EMERGENCY ALERT
                  </span>
                  <span className="text-xs text-rose-800 font-medium">
                    {activeAlerts.length} {activeAlerts.length === 1 ? 'patient needs' : 'patients need'} immediate attention
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Critical patient requires immediate attention.
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Latest: <strong>{activeAlerts[0]?.patientName}</strong> ({activeAlerts[0]?.patientId}) — Symptoms: {(activeAlerts[0]?.mainSymptoms || []).join(', ')} — Suggested: <strong>{activeAlerts[0]?.recommendedDepartment}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                onClick={() => {
                  acknowledgeAlert(activeAlerts[0].id);
                  viewPatient(activeAlerts[0].patientId);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl shadow-xs transition-colors"
              >
                View Patient
              </button>
              <button
                onClick={() => setActiveTab('alerts')}
                className="px-3 py-2 text-xs font-medium text-rose-700 hover:bg-rose-100 rounded-xl transition-colors"
              >
                All Alerts ({activeAlerts.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4 Large Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Card 1: Total Patients */}
        <div 
          onClick={() => setActiveTab('patients')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-teal-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Patients</span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-slate-900 tabular-nums">
              {totalPatients}
            </span>
            <span className="text-xs text-slate-500 block mt-1">
              Registered in SmartCare
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-teal-700 font-medium">
            <span>View all records</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Waiting Patients */}
        <div 
          onClick={() => setActiveTab('queue')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-teal-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Waiting Patients</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-slate-900 tabular-nums">
              {waitingPatients.length}
            </span>
            <span className="text-xs text-slate-500 block mt-1">
              Currently in waiting lounge
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-sky-700 font-medium">
            <span>Manage queue</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Critical Patients */}
        <div 
          onClick={() => setActiveTab('alerts')}
          className={`bg-white rounded-2xl p-5 border shadow-xs transition-all cursor-pointer group ${
            criticalPatients.length > 0 
              ? 'border-rose-200 hover:border-rose-300 hover:shadow-md' 
              : 'border-slate-200/80 hover:border-teal-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Critical Patients</span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform ${
              criticalPatients.length > 0 ? 'bg-rose-50 text-rose-600 animate-pulse' : 'bg-slate-50 text-slate-400'
            }`}>
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-slate-900 tabular-nums">
              {criticalPatients.length}
            </span>
            <span className="text-xs text-slate-500 block mt-1">
              {criticalPatients.length > 0 ? 'Priority RED emergency' : 'No emergency cases'}
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-rose-700 font-medium">
            <span>Check emergency alerts</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Admitted Patients */}
        <div 
          onClick={() => setActiveTab('patients')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-teal-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Admitted Patients</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <BedDouble className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-slate-900 tabular-nums">
              {admittedPatients.length}
            </span>
            <span className="text-xs text-slate-500 block mt-1">
              Occupying hospital beds
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-700 font-medium">
            <span>View bed distribution</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

      {/* Quick Actions Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Quick Actions</h2>
            <p className="text-xs text-slate-500">Common everyday hospital workflows for reception and clinical staff</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          
          <button
            onClick={() => setActiveTab('register')}
            className="flex flex-col items-center text-center p-4 rounded-2xl bg-teal-50/50 hover:bg-teal-50 border border-teal-100 text-slate-800 hover:text-teal-900 transition-all hover:scale-[1.02] shadow-2xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center mb-2.5 shadow-xs group-hover:scale-110 transition-transform">
              <UserPlus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold">Register New Patient</span>
            <span className="text-[11px] text-slate-500 mt-0.5">Create digital ID</span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className="flex flex-col items-center text-center p-4 rounded-2xl bg-sky-50/50 hover:bg-sky-50 border border-sky-100 text-slate-800 hover:text-sky-900 transition-all hover:scale-[1.02] shadow-2xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center mb-2.5 shadow-xs group-hover:scale-110 transition-transform">
              <Search className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold">Search Patient</span>
            <span className="text-[11px] text-slate-500 mt-0.5">By Name, ID or Phone</span>
          </button>

          <button
            onClick={() => setActiveTab('patients')}
            className="flex flex-col items-center text-center p-4 rounded-2xl bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 text-slate-800 hover:text-indigo-900 transition-all hover:scale-[1.02] shadow-2xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-2.5 shadow-xs group-hover:scale-110 transition-transform">
              <FolderHeart className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold">Check Patient Records</span>
            <span className="text-[11px] text-slate-500 mt-0.5">Timeline & History</span>
          </button>

          <button
            onClick={() => setActiveTab('triage')}
            className="flex flex-col items-center text-center p-4 rounded-2xl bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100 text-slate-800 hover:text-emerald-900 transition-all hover:scale-[1.02] shadow-2xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-2.5 shadow-xs group-hover:scale-110 transition-transform">
              <Stethoscope className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold">Start Triage</span>
            <span className="text-[11px] text-slate-500 mt-0.5">Assess Urgency</span>
          </button>

          <button
            onClick={() => setActiveTab('queue')}
            className="flex flex-col items-center text-center p-4 rounded-2xl bg-amber-50/50 hover:bg-amber-50 border border-amber-100 text-slate-800 hover:text-amber-900 transition-all hover:scale-[1.02] shadow-2xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-2.5 shadow-xs group-hover:scale-110 transition-transform">
              <ClipboardList className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold">View Queue</span>
            <span className="text-[11px] text-slate-500 mt-0.5">Ordered by Urgency</span>
          </button>

        </div>
      </div>

      {/* Two Columns: Urgent Patient Queue Snapshot & Hospital Live Ticker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Queue Snapshot (Urgency arranged) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Active Queue Snapshot</h3>
                <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                  Ordered by Urgency
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Patients are arranged automatically: Red (First) → Orange → Yellow → Green</p>
            </div>
            
            <button
              onClick={() => setActiveTab('queue')}
              className="text-xs text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1 hover:underline"
            >
              <span>Full Queue ({queueSorted.length})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {queueSorted.slice(0, 5).map(patient => {
              const badge = priorityBadges[patient.priority] || defaultBadge;
              return (
                <div 
                  key={patient.id} 
                  className="py-3.5 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full shrink-0 ${badge.dot}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{patient.name}</span>
                        <span className="text-[11px] font-mono text-slate-400 font-semibold">{patient.id}</span>
                        <span className="text-[11px] text-slate-500">· {patient.age} yrs</span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-medium text-slate-700">{patient.department}</span>
                        <span>·</span>
                        <span>Doc: {patient.assignedDoctor || 'Unassigned'}</span>
                        <span>·</span>
                        <span>Wait: {patient.waitingTimeMinutes} mins</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${badge.bg} ${badge.text}`}>
                      {badge.label}
                    </span>
                    <button
                      onClick={() => viewPatient(patient.id)}
                      className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors border border-slate-200"
                    >
                      View
                    </button>
                  </div>
                </div>
              );
            })}

            {queueSorted.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-500">
                No patients currently waiting in the active queue.
              </div>
            )}
          </div>
        </div>

        {/* Quick Triage & Department Helper */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50/60 rounded-3xl p-5 border border-teal-100 text-slate-800">
            <div className="flex items-center gap-2 text-teal-800 font-bold text-sm mb-1">
              <HeartPulse className="w-4 h-4 text-teal-600" />
              <span>Intelligent Triage Guide</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              SmartCare standardizes priority assessment to ensure that acute chest pain and oxygen dips are noticed before routine coughs.
            </p>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/80 border border-teal-100">
                <span className="font-semibold text-rose-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                  RED – Emergency
                </span>
                <span className="text-[11px] text-slate-500">Immediate</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/80 border border-teal-100">
                <span className="font-semibold text-orange-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  ORANGE – Urgent
                </span>
                <span className="text-[11px] text-slate-500">&lt; 15 mins</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/80 border border-teal-100">
                <span className="font-semibold text-amber-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  YELLOW – Moderate
                </span>
                <span className="text-[11px] text-slate-500">&lt; 45 mins</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/80 border border-teal-100">
                <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  GREEN – Low Priority
                </span>
                <span className="text-[11px] text-slate-500">Routine</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('triage')}
              className="w-full mt-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Launch Triage Evaluator</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
