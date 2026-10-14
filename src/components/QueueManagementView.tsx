import React, { useState } from 'react';
import { 
  ClipboardList, 
  Clock, 
  UserCheck, 
  ArrowRight, 
  Filter, 
  CheckCircle2, 
  Building2, 
  Stethoscope, 
  Trash2, 
  Info,
  ChevronDown,
  Edit2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TriageLevel, PatientStatus, Patient } from '../types';
import { INITIAL_DOCTORS, DEPARTMENTS } from '../data/initialData';
import { Modal } from './Modal';

export const QueueManagementView: React.FC = () => {
  const { 
    patients, 
    updateQueueItem, 
    removeFromQueue, 
    viewPatient, 
    startTriageForPatient 
  } = useApp();

  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Edit Doctor / Dept modal state
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [editDoctor, setEditDoctor] = useState('');
  const [editDept, setEditDept] = useState('');
  const [editStatus, setEditStatus] = useState<PatientStatus>('Waiting');
  const [editPriority, setEditPriority] = useState<TriageLevel>('GREEN');

  const priorityOrder: Record<TriageLevel, number> = {
    RED: 1,
    ORANGE: 2,
    YELLOW: 3,
    GREEN: 4,
  };

  const priorityBadges: Record<TriageLevel, { label: string; bg: string; text: string; dot: string }> = {
    RED: { label: 'Emergency', bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-600' },
    ORANGE: { label: 'Urgent', bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
    YELLOW: { label: 'Moderate', bg: 'bg-amber-50', text: 'text-amber-800', dot: 'bg-amber-500' },
    GREEN: { label: 'Low Priority', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  };

  const defaultBadge = { label: 'Low Priority', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' };

  // Filter only active queue patients (exclude already discharged unless filtered)
  const filteredQueue = patients
    .filter(p => {
      if (statusFilter === 'ALL') {
        return p.status !== 'Discharged';
      }
      return p.status === statusFilter;
    })
    .filter(p => {
      if (deptFilter === 'ALL') return true;
      return p.department === deptFilter;
    })
    // Strictly arrange according to urgency: RED -> ORANGE -> YELLOW -> GREEN
    .sort((a, b) => {
      const diff = (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
      if (diff !== 0) return diff;
      return (b.waitingTimeMinutes || 0) - (a.waitingTimeMinutes || 0);
    });

  const handleOpenEdit = (p: Patient) => {
    setSelectedPatient(p);
    setEditDoctor(p.assignedDoctor || INITIAL_DOCTORS[0].name);
    setEditDept(p.department);
    setEditStatus(p.status);
    setEditPriority(p.priority);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    updateQueueItem(selectedPatient.id, {
      assignedDoctor: editDoctor,
      department: editDept,
      status: editStatus,
      priority: editPriority,
    });

    setSelectedPatient(null);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Title & Urgency Arranged Announcement */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Queue</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time outpatient and clinical consultation queue with priority-based flow.
          </p>
        </div>

        {/* Priority Legend Notice */}
        <div className="p-3 bg-teal-50 border border-teal-200 rounded-2xl flex items-center gap-2.5 text-xs text-teal-900">
          <Info className="w-4 h-4 text-teal-700 shrink-0" />
          <span className="font-semibold">
            Patients are arranged according to urgency: 🔴 Emergency First → 🟠 Urgent → 🟡 Moderate → 🟢 Low Priority.
          </span>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Queue:</span>
          </span>

          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium text-xs focus:outline-hidden focus:border-teal-500"
          >
            <option value="ALL">All Departments</option>
            {DEPARTMENTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium text-xs focus:outline-hidden focus:border-teal-500"
          >
            <option value="ALL">Active Patients in Queue</option>
            <option value="Waiting">Waiting</option>
            <option value="In Consultation">In Consultation</option>
            <option value="Under Observation">Under Observation</option>
            <option value="Admitted">Admitted</option>
            <option value="Discharged">Discharged / Completed</option>
          </select>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Total in queue: <strong className="text-slate-900 tabular-nums">{filteredQueue.length}</strong>
        </span>
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Urgency / Priority</th>
                <th className="py-3.5 px-4">Patient Name & ID</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Waiting Time</th>
                <th className="py-3.5 px-4">Assigned Doctor</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredQueue.map(patient => {
                const badge = priorityBadges[patient.priority] || defaultBadge;
                return (
                  <tr 
                    key={patient.id} 
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Priority */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${badge.dot}`} />
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                      </div>
                    </td>

                    {/* Name & ID */}
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-bold text-slate-900 block leading-tight">{patient.name}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-[11px] text-teal-700 font-semibold">{patient.id}</span>
                          <span className="text-[11px] text-slate-400">· {patient.age} yrs</span>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-700">
                      {patient.department}
                    </td>

                    {/* Waiting Time */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="flex items-center gap-1 font-semibold text-slate-700 tabular-nums">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {patient.waitingTimeMinutes} mins
                      </span>
                    </td>

                    {/* Assigned Doctor */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {patient.assignedDoctor ? (
                        <span className="text-slate-800 font-medium">{patient.assignedDoctor}</span>
                      ) : (
                        <span className="text-slate-400 italic">Not Assigned</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        patient.status === 'Waiting'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : patient.status === 'In Consultation'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : patient.status === 'Admitted'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {patient.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(patient)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium transition-colors text-[11px] flex items-center gap-1"
                          title="Assign Doctor, Department or update status"
                        >
                          <Edit2 className="w-3 h-3 text-slate-500" />
                          <span>Assign / Update</span>
                        </button>

                        <button
                          onClick={() => viewPatient(patient.id)}
                          className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg font-semibold transition-colors text-[11px]"
                        >
                          Chart
                        </button>

                        <button
                          onClick={() => removeFromQueue(patient.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Complete consultation & remove from queue"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}

              {filteredQueue.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                    No patients currently matching the selected queue filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Doctor / Department / Status Modal */}
      {selectedPatient && (
        <Modal
          isOpen={!!selectedPatient}
          onClose={() => setSelectedPatient(null)}
          title={`Manage Queue: ${selectedPatient.name} (${selectedPatient.id})`}
        >
          <form onSubmit={handleSaveModal} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assign Doctor
              </label>
              <select
                value={editDoctor}
                onChange={e => setEditDoctor(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              >
                {INITIAL_DOCTORS.map(doc => (
                  <option key={doc.name} value={doc.name}>
                    {doc.name} — {doc.department} {doc.available ? '(Available)' : '(In Surgery)'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assign Department
              </label>
              <select
                value={editDept}
                onChange={e => setEditDept(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Update Status
              </label>
              <select
                value={editStatus}
                onChange={e => setEditStatus(e.target.value as PatientStatus)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              >
                <option value="Waiting">Waiting in Queue</option>
                <option value="In Triage">In Triage Assessment</option>
                <option value="In Consultation">In Consultation with Doctor</option>
                <option value="Under Observation">Under Observation</option>
                <option value="Admitted">Admitted to Inpatient Ward</option>
                <option value="Discharged">Discharged / Consultation Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Urgency Priority
              </label>
              <select
                value={editPriority}
                onChange={e => setEditPriority(e.target.value as TriageLevel)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              >
                <option value="RED">🔴 RED – Emergency (Immediate)</option>
                <option value="ORANGE">🟠 ORANGE – Urgent (&lt; 15 mins)</option>
                <option value="YELLOW">🟡 YELLOW – Moderate (&lt; 45 mins)</option>
                <option value="GREEN">🟢 GREEN – Low Priority (Routine)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedPatient(null)}
                className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl"
              >
                Save Queue Assignment
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
