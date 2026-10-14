import React from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  Clock, 
  AlertCircle, 
  BedDouble, 
  Activity,
  HeartPulse
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TriageLevel } from '../types';
import { DEPARTMENTS } from '../data/initialData';

export const AnalyticsView: React.FC = () => {
  const { patients } = useApp();

  const total = patients.length;
  const redCount = patients.filter(p => p.priority === 'RED').length;
  const orangeCount = patients.filter(p => p.priority === 'ORANGE').length;
  const yellowCount = patients.filter(p => p.priority === 'YELLOW').length;
  const greenCount = patients.filter(p => p.priority === 'GREEN').length;

  const waitingCount = patients.filter(p => p.status === 'Waiting').length;
  const admittedCount = patients.filter(p => p.status === 'Admitted').length;

  // Department counts
  const deptCounts: Record<string, number> = {};
  DEPARTMENTS.forEach(d => {
    deptCounts[d] = 0;
  });
  patients.forEach(p => {
    deptCounts[p.department] = (deptCounts[p.department] || 0) + 1;
  });

  const maxDeptCount = Math.max(...Object.values(deptCounts), 1);

  // Daily registrations (mock recent 7 days trend combined with real registrations)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
  const dailyData = [12, 18, 15, 22, 19, 14, total];
  const maxDaily = Math.max(...dailyData);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hospital Analytics</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time patient census, severity distribution, and clinic workload metrics.
        </p>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-400">Total Patients</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-3xl font-extrabold text-slate-900 tabular-nums">{total}</span>
            <Users className="w-6 h-6 text-teal-600" />
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Active SmartCare records</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-400">Emergency Patients</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-3xl font-extrabold text-rose-600 tabular-nums">{redCount}</span>
            <AlertCircle className="w-6 h-6 text-rose-500" />
          </div>
          <span className="text-[11px] text-rose-600 font-medium mt-1 block">Priority RED cases</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-400">Patients Waiting</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-3xl font-extrabold text-sky-600 tabular-nums">{waitingCount}</span>
            <Clock className="w-6 h-6 text-sky-500" />
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Pending doctor consultation</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-400">Admitted Patients</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-3xl font-extrabold text-indigo-600 tabular-nums">{admittedCount}</span>
            <BedDouble className="w-6 h-6 text-indigo-500" />
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Currently occupying beds</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Patients by Severity / Priority */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-600" />
                <span>Patients by Triage Severity</span>
              </h3>
              <span className="text-xs text-slate-400">Live Breakdown</span>
            </div>

            <div className="space-y-3.5">
              {/* RED */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-rose-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                    RED – Emergency (Immediate)
                  </span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {redCount} ({total > 0 ? Math.round((redCount / total) * 100) : 0}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${total > 0 ? (redCount / total) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* ORANGE */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-orange-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                    ORANGE – Urgent (&lt; 15 mins)
                  </span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {orangeCount} ({total > 0 ? Math.round((orangeCount / total) * 100) : 0}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${total > 0 ? (orangeCount / total) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* YELLOW */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-amber-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    YELLOW – Moderate (&lt; 45 mins)
                  </span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {yellowCount} ({total > 0 ? Math.round((yellowCount / total) * 100) : 0}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${total > 0 ? (yellowCount / total) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* GREEN */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    GREEN – Low Priority (Routine)
                  </span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {greenCount} ({total > 0 ? Math.round((greenCount / total) * 100) : 0}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${total > 0 ? (greenCount / total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500">
            Triage distribution prioritizes care so critical emergencies are never delayed.
          </div>
        </div>

        {/* Chart 2: Patients by Department */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-teal-600" />
                <span>Patients by Department</span>
              </h3>
              <span className="text-xs text-slate-400">Capacity Load</span>
            </div>

            <div className="space-y-2.5">
              {DEPARTMENTS.slice(0, 6).map(dept => {
                const count = deptCounts[dept] || 0;
                const percentage = Math.round((count / maxDeptCount) * 100);
                return (
                  <div key={dept}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">{dept}</span>
                      <span className="font-bold text-slate-900 tabular-nums">{count} patients</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-teal-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 6)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-500">
            Auto-assigned from intelligent triage symptoms and clinician intake.
          </div>
        </div>

      </div>

      {/* Daily Patient Registrations Trend Bar Chart */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              <span>Daily Patient Registrations</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Patient volume intake over the past 7 days</p>
          </div>
          <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-xl">
            This Week
          </span>
        </div>

        {/* Visual Bar Graph */}
        <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-6 pt-6">
          {days.map((day, idx) => {
            const val = dailyData[idx];
            const heightPercent = Math.round((val / (maxDaily + 5)) * 100);
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[11px] font-bold text-slate-600 tabular-nums group-hover:text-teal-700 transition-colors">
                  {val}
                </span>
                <div className="w-full max-w-[44px] bg-slate-100 rounded-t-xl overflow-hidden h-36 flex items-end">
                  <div 
                    className={`w-full rounded-t-xl transition-all duration-500 group-hover:opacity-90 ${
                      day === 'Today'
                        ? 'bg-gradient-to-t from-teal-600 to-cyan-500'
                        : 'bg-teal-500/80'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className={`text-xs font-medium ${day === 'Today' ? 'font-bold text-teal-800' : 'text-slate-500'}`}>
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
