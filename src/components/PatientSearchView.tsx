import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  User, 
  Phone, 
  ArrowRight, 
  X, 
  Stethoscope, 
  Clock, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TriageLevel, PatientStatus } from '../types';
import { DEPARTMENTS } from '../data/initialData';

export const PatientSearchView: React.FC = () => {
  const { patients, viewPatient, startTriageForPatient } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('ALL');

  const priorityBadges: Record<TriageLevel, { label: string; bg: string; text: string; dot: string }> = {
    RED: { label: 'Emergency', bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-600' },
    ORANGE: { label: 'Urgent', bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
    YELLOW: { label: 'Moderate', bg: 'bg-amber-50', text: 'text-amber-800', dot: 'bg-amber-500' },
    GREEN: { label: 'Low Priority', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  };

  const defaultBadge = priorityBadges.GREEN;

  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      // 1. Search Query (ID, Name, Phone, Disease/Condition, Department)
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchId = (p.id || '').toLowerCase().includes(q);
        const matchName = (p.name || '').toLowerCase().includes(q);
        const matchPhone = (p.phone || '').includes(q);
        const matchDept = (p.department || '').toLowerCase().includes(q);
        const matchHistory = (p.medicalHistory || '').toLowerCase().includes(q);
        const matchSymptoms = p.latestTriage?.symptoms?.some(s => (s || '').toLowerCase().includes(q));
        if (!matchId && !matchName && !matchPhone && !matchDept && !matchHistory && !matchSymptoms) {
          return false;
        }
      }

      // 2. Department Filter
      if (selectedDept !== 'ALL' && p.department !== selectedDept) {
        return false;
      }

      // 3. Priority Filter
      if (selectedPriority !== 'ALL' && p.priority !== selectedPriority) {
        return false;
      }

      // 4. Status Filter
      if (selectedStatus !== 'ALL' && p.status !== selectedStatus) {
        return false;
      }

      // 5. Age Group Filter
      if (selectedAgeGroup === 'UNDER_18' && p.age >= 18) return false;
      if (selectedAgeGroup === '18_TO_50' && (p.age < 18 || p.age > 50)) return false;
      if (selectedAgeGroup === 'OVER_50' && p.age <= 50) return false;

      return true;
    });
  }, [patients, searchQuery, selectedDept, selectedPriority, selectedStatus, selectedAgeGroup]);

  const hasActiveFilters = 
    searchQuery !== '' || 
    selectedDept !== 'ALL' || 
    selectedPriority !== 'ALL' || 
    selectedStatus !== 'ALL' || 
    selectedAgeGroup !== 'ALL';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDept('ALL');
    setSelectedPriority('ALL');
    setSelectedStatus('ALL');
    setSelectedAgeGroup('ALL');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Search Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quick Patient Search</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Fast retrieval of digital patient charts by name, unique ID, phone number, illness or medical department.
        </p>
      </div>

      {/* Prominent Search Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-teal-600 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search patient by name, ID or phone number (e.g. SC10021, Robert Chen, 555-890)"
            className="w-full pl-12 pr-10 py-3.5 text-sm text-slate-900 bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400 font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </span>

          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium text-xs focus:outline-hidden focus:border-teal-500"
          >
            <option value="ALL">All Departments</option>
            {DEPARTMENTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Urgency / Severity Filter */}
          <select
            value={selectedPriority}
            onChange={e => setSelectedPriority(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium text-xs focus:outline-hidden focus:border-teal-500"
          >
            <option value="ALL">All Urgencies</option>
            <option value="RED">🔴 RED – Emergency</option>
            <option value="ORANGE">🟠 ORANGE – Urgent</option>
            <option value="YELLOW">🟡 YELLOW – Moderate</option>
            <option value="GREEN">🟢 GREEN – Low Priority</option>
          </select>

          {/* Admission Status Filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium text-xs focus:outline-hidden focus:border-teal-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Waiting">Waiting</option>
            <option value="In Consultation">In Consultation</option>
            <option value="Under Observation">Under Observation</option>
            <option value="Admitted">Admitted</option>
            <option value="Discharged">Discharged</option>
          </select>

          {/* Age Group Filter */}
          <select
            value={selectedAgeGroup}
            onChange={e => setSelectedAgeGroup(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium text-xs focus:outline-hidden focus:border-teal-500"
          >
            <option value="ALL">All Ages</option>
            <option value="UNDER_18">Under 18</option>
            <option value="18_TO_50">18 – 50 years</option>
            <option value="OVER_50">Over 50 years</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium hover:underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-semibold text-slate-500">
          Showing <strong className="text-slate-800 tabular-nums">{filteredPatients.length}</strong> {filteredPatients.length === 1 ? 'patient' : 'patients'}
        </span>
        <span className="text-[11px] text-slate-400">
          Click "View Patient" to open the digital medical chart
        </span>
      </div>

      {/* Search Result Cards Grid */}
      {filteredPatients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map(patient => {
            const badge = priorityBadges[patient.priority] || defaultBadge;
            return (
              <div
                key={patient.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:border-teal-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top row: Patient Name, ID, Age */}
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {patient.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] font-mono font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-100">
                          {patient.id}
                        </span>
                        <span className="text-xs text-slate-500">· {patient.age} yrs ({(patient.gender || 'U').charAt(0)})</span>
                      </div>
                    </div>

                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0 ${badge.bg} ${badge.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      {badge.label}
                    </span>
                  </div>

                  {/* Middle row: Department, Status & Doctor */}
                  <div className="py-3 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Department:</span>
                      <span className="font-semibold text-slate-800">{patient.department}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Status:</span>
                      <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                        {patient.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Doctor:</span>
                      <span className="font-medium text-slate-700 truncate max-w-[150px]">
                        {patient.assignedDoctor || 'Unassigned'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">Phone:</span>
                      <span className="text-slate-600 text-[11px] font-mono">{patient.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Card Action Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => viewPatient(patient.id)}
                    className="flex-1 py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View Patient</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => startTriageForPatient(patient.id)}
                    className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-teal-700 rounded-xl transition-colors"
                    title="Triage this patient"
                  >
                    <Stethoscope className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
          <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No matching patients found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try searching with a different name, Patient ID (e.g. SC10021), or resetting the active filters.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl text-xs font-semibold transition-colors"
          >
            Clear Search Filters
          </button>
        </div>
      )}

    </div>
  );
};
