import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Stethoscope, 
  ArrowRight, 
  Filter, 
  Calendar, 
  Clock, 
  ChevronRight,
  Heart
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TriageLevel } from '../types';

export const PatientListView: React.FC = () => {
  const { patients, viewPatient, startTriageForPatient, setActiveTab } = useApp();
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const priorityBadges: Record<TriageLevel, { label: string; bg: string; text: string; dot: string }> = {
    RED: { label: 'Emergency', bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-600' },
    ORANGE: { label: 'Urgent', bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
    YELLOW: { label: 'Moderate', bg: 'bg-amber-50', text: 'text-amber-800', dot: 'bg-amber-500' },
    GREEN: { label: 'Low Priority', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  };

  const defaultBadge = priorityBadges.GREEN;

  const filtered = patients.filter(p => {
    if (selectedStatus !== 'ALL' && p.status !== selectedStatus) return false;
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      return (
        (p.name || '').toLowerCase().includes(q) ||
        (p.id || '').toLowerCase().includes(q) ||
        (p.phone || '').includes(q) ||
        (p.department || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete list of all registered patients, digital medical records, and recent hospital visits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('register')}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register New Patient</span>
          </button>
        </div>
      </div>

      {/* Filter and Quick Search bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
            placeholder="Quick filter by name, ID or department..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Status:</span>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs focus:outline-hidden focus:border-teal-500"
          >
            <option value="ALL">All Statuses ({patients.length})</option>
            <option value="Waiting">Waiting</option>
            <option value="In Consultation">In Consultation</option>
            <option value="Under Observation">Under Observation</option>
            <option value="Admitted">Admitted</option>
            <option value="Discharged">Discharged</option>
          </select>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Patient ID</th>
                <th className="py-3.5 px-4">Patient Name</th>
                <th className="py-3.5 px-4">Age / Gender</th>
                <th className="py-3.5 px-4">Blood Group</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Triage Urgency</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map(patient => {
                const badge = priorityBadges[patient.priority] || defaultBadge;
                return (
                  <tr key={patient.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-teal-800 whitespace-nowrap">
                      {patient.id}
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {patient.name}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                      {patient.age} yrs · {patient.gender}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-800 text-[11px]">
                        {patient.bloodGroup}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-slate-700 font-medium">
                      {patient.department}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                        <span className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {patient.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => viewPatient(patient.id)}
                          className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-colors text-[11px] flex items-center gap-1"
                        >
                          <span>View Chart</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => startTriageForPatient(patient.id)}
                          className="p-1 text-slate-400 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                          title="Start Triage"
                        >
                          <Stethoscope className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500 text-xs">
                    No patients match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
