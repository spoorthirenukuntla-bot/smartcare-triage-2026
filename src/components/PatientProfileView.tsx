import React, { useState } from 'react';
import { 
  User, 
  Heart, 
  Pill, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  Stethoscope, 
  Edit3, 
  Plus, 
  ArrowLeft, 
  CheckCircle2, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  FileText,
  Activity,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Modal } from './Modal';
import { INITIAL_DOCTORS, DEPARTMENTS } from '../data/initialData';
import { Patient, TriageLevel } from '../types';

interface PatientProfileViewProps {
  patientId: string;
  onBack: () => void;
}

export const PatientProfileView: React.FC<PatientProfileViewProps> = ({ patientId, onBack }) => {
  const { 
    patients, 
    updatePatient, 
    deletePatient, 
    addPatientVisit, 
    startTriageForPatient,
    currentUser,
    setActiveTab 
  } = useApp();

  const patient = patients.find(p => p.id === patientId);

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddVisitModalOpen, setIsAddVisitModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(patient?.name || '');
  const [editAge, setEditAge] = useState(patient?.age || 30);
  const [editGender, setEditGender] = useState(patient?.gender || 'Male');
  const [editPhone, setEditPhone] = useState(patient?.phone || '');
  const [editAddress, setEditAddress] = useState(patient?.address || '');
  const [editBloodGroup, setEditBloodGroup] = useState(patient?.bloodGroup || 'O+');
  const [editHistory, setEditHistory] = useState(patient?.medicalHistory || '');
  const [editMeds, setEditMeds] = useState(patient?.currentMedicines || '');
  const [editAllergies, setEditAllergies] = useState(patient?.allergies || '');

  // Add visit form state
  const [visitReason, setVisitReason] = useState('');
  const [visitDoctor, setVisitDoctor] = useState(INITIAL_DOCTORS[0].name);
  const [visitDept, setVisitDept] = useState('Cardiology');
  const [visitNotes, setVisitNotes] = useState('');
  const [visitPrescriptions, setVisitPrescriptions] = useState('');

  if (!patient) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
        <p className="text-sm text-slate-500">Patient not found or removed.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to Patient List
        </button>
      </div>
    );
  }

  const priorityBadges: Record<TriageLevel, { label: string; bg: string; text: string; dot: string }> = {
    RED: { label: 'Emergency (RED)', bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-600' },
    ORANGE: { label: 'Urgent (ORANGE)', bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
    YELLOW: { label: 'Moderate (YELLOW)', bg: 'bg-amber-50', text: 'text-amber-800', dot: 'bg-amber-500' },
    GREEN: { label: 'Low Priority (GREEN)', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  };

  const currentPriority = priorityBadges[patient.priority] || priorityBadges.GREEN;

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePatient(patient.id, {
      name: editName,
      age: Number(editAge),
      gender: editGender,
      phone: editPhone,
      address: editAddress,
      bloodGroup: editBloodGroup,
      medicalHistory: editHistory,
      currentMedicines: editMeds,
      allergies: editAllergies,
    });
    setIsEditModalOpen(false);
  };

  const handleAddVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitReason.trim()) return;

    addPatientVisit(patient.id, {
      reason: visitReason.trim(),
      doctor: visitDoctor,
      department: visitDept,
      treatmentNotes: visitNotes.trim() || 'Consultation concluded without additional complications.',
      prescriptions: visitPrescriptions.trim() ? visitPrescriptions.split(',').map(s => s.trim()) : undefined,
    });

    setVisitReason('');
    setVisitNotes('');
    setVisitPrescriptions('');
    setIsAddVisitModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    deletePatient(patient.id);
    setIsDeleteModalOpen(false);
    onBack();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Back button & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Patients</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => startTriageForPatient(patient.id)}
            className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Start Triage</span>
          </button>

          <button
            onClick={() => setIsAddVisitModalOpen(true)}
            className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Visit</span>
          </button>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Record</span>
          </button>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            title="Delete Record"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white flex items-center justify-center text-xl font-bold shadow-sm">
              {(patient.name || 'P').charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {patient.name}
                </h1>
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 bg-teal-50 text-teal-800 rounded-md border border-teal-200">
                  {patient.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                <span>{patient.age} years old</span>
                <span>·</span>
                <span>{patient.gender}</span>
                <span>·</span>
                <span>Registered: {patient.registeredAt}</span>
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${currentPriority.dot}`} />
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${currentPriority.bg} ${currentPriority.text}`}>
                {currentPriority.label}
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              Status: <strong className="text-slate-700">{patient.status}</strong>
            </span>
          </div>
        </div>

        {/* Patient Information Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 block">Blood Group</span>
            <span className="text-base font-bold text-slate-900 mt-0.5 block">{patient.bloodGroup}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 block">Phone</span>
            <span className="text-xs font-bold text-slate-900 mt-1 block truncate">{patient.phone}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 block">Department</span>
            <span className="text-xs font-bold text-slate-900 mt-1 block truncate">{patient.department}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 block">Assigned Doctor</span>
            <span className="text-xs font-bold text-slate-900 mt-1 block truncate">
              {patient.assignedDoctor || 'None currently assigned'}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Address: {patient.address}</span>
        </div>
      </div>

      {/* Medical Information Cards (History, Medicines, Allergies) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Medical History */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-2 pb-2 border-b border-slate-100">
            <Heart className="w-4 h-4 text-teal-600" />
            <span>Medical History</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed min-h-[48px]">
            {patient.medicalHistory || 'No prior chronic conditions recorded.'}
          </p>
        </div>

        {/* Card 2: Current Medicines */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-2 pb-2 border-b border-slate-100">
            <Pill className="w-4 h-4 text-sky-600" />
            <span>Current Medicines</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed min-h-[48px]">
            {patient.currentMedicines || 'No regular medications.'}
          </p>
        </div>

        {/* Card 3: Allergies */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-700 mb-2 pb-2 border-b border-slate-100">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Allergies</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed min-h-[48px]">
            {patient.allergies || 'No known allergies (NKDA).'}
          </p>
        </div>

      </div>

      {/* Latest Triage Assessment Summary if present */}
      {patient.latestTriage && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900">Latest Triage Assessment</h3>
              <span className="text-[11px] text-slate-500">· {patient.latestTriage.timestamp}</span>
            </div>
            <button
              onClick={() => startTriageForPatient(patient.id)}
              className="text-xs text-teal-700 hover:text-teal-800 font-semibold"
            >
              Re-Assess Triage
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <div className="p-3 rounded-xl bg-slate-50">
              <span className="text-[11px] text-slate-500 block">Heart Rate</span>
              <span className="text-sm font-bold text-slate-900">{patient.latestTriage.vitals.heartRate} bpm</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50">
              <span className="text-[11px] text-slate-500 block">Blood Pressure</span>
              <span className="text-sm font-bold text-slate-900">
                {patient.latestTriage.vitals.bloodPressureSys}/{patient.latestTriage.vitals.bloodPressureDia} mmHg
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50">
              <span className="text-[11px] text-slate-500 block">Oxygen (SpO2)</span>
              <span className="text-sm font-bold text-slate-900">{patient.latestTriage.vitals.oxygenLevel}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50">
              <span className="text-[11px] text-slate-500 block">Temperature</span>
              <span className="text-sm font-bold text-slate-900">{patient.latestTriage.vitals.temperature} °F</span>
            </div>
          </div>

          <div className="mt-3 p-3 bg-teal-50/60 rounded-xl text-xs text-slate-700">
            <strong>Triage findings:</strong> {patient.latestTriage.triageReason}
          </div>
        </div>
      )}

      {/* Patient Timeline: Previous Visits */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>Patient Timeline — Previous Visits</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Chronological record of clinic and hospital consultations</p>
          </div>

          <button
            onClick={() => setIsAddVisitModalOpen(true)}
            className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Visit</span>
          </button>
        </div>

        {(patient.visits || []).length > 0 ? (
          <div className="relative mt-6 pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {(patient.visits || []).map((visit, idx) => (
              <div key={visit.id || idx} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-teal-600 border-2 border-white shadow-2xs" />

                <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900">{visit.reason}</span>
                    <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {visit.date}
                    </span>
                  </div>

                  <div className="text-[11px] text-teal-700 font-semibold mt-1">
                    {visit.doctor} · {visit.department}
                  </div>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {visit.treatmentNotes}
                  </p>

                  {visit.prescriptions && visit.prescriptions.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex flex-wrap gap-1.5 items-center">
                      <span className="text-[11px] font-semibold text-slate-500">Prescriptions:</span>
                      {visit.prescriptions.map((rx, rIdx) => (
                        <span key={rIdx} className="text-[11px] bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-700">
                          {rx}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">No previous visits recorded yet for this patient.</p>
            <button
              onClick={() => setIsAddVisitModalOpen(true)}
              className="mt-3 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-xs font-semibold transition-colors"
            >
              + Record First Consultation
            </button>
          </div>
        )}

      </div>

      {/* Edit Patient Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Patient Information"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Age</label>
              <input
                type="number"
                required
                value={editAge}
                onChange={e => setEditAge(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Gender</label>
              <select
                value={editGender}
                onChange={e => setEditGender(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
              <input
                type="text"
                value={editPhone}
                onChange={e => setEditPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Blood Group</label>
              <select
                value={editBloodGroup}
                onChange={e => setEditBloodGroup(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Address</label>
              <input
                type="text"
                value={editAddress}
                onChange={e => setEditAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Medical History</label>
              <textarea
                rows={2}
                value={editHistory}
                onChange={e => setEditHistory(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Current Medicines</label>
              <textarea
                rows={2}
                value={editMeds}
                onChange={e => setEditMeds(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Allergies</label>
              <textarea
                rows={2}
                value={editAllergies}
                onChange={e => setEditAllergies(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Visit Modal */}
      <Modal
        isOpen={isAddVisitModalOpen}
        onClose={() => setIsAddVisitModalOpen(false)}
        title="Record New Visit / Consultation"
      >
        <form onSubmit={handleAddVisit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Reason for Visit <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={visitReason}
              onChange={e => setVisitReason(e.target.value)}
              placeholder="e.g. Follow-up consultation, Sudden abdominal pain, Prescription refill"
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Attending Doctor</label>
              <select
                value={visitDoctor}
                onChange={e => setVisitDoctor(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              >
                {INITIAL_DOCTORS.map(doc => (
                  <option key={doc.name} value={doc.name}>{doc.name} ({doc.department})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Department</label>
              <select
                value={visitDept}
                onChange={e => setVisitDept(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Clinical Notes & Treatment Summary
            </label>
            <textarea
              rows={3}
              value={visitNotes}
              onChange={e => setVisitNotes(e.target.value)}
              placeholder="Doctor's findings, diagnostic advice, orders given, recovery plan..."
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Prescriptions (comma-separated)
            </label>
            <input
              type="text"
              value={visitPrescriptions}
              onChange={e => setVisitPrescriptions(e.target.value)}
              placeholder="e.g. Amoxicillin 500mg, Paracetamol 650mg PRN"
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddVisitModalOpen(false)}
              className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl"
            >
              Save Visit
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Patient Record Removal"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to delete the record for <strong>{patient.name}</strong> ({patient.id})? This will remove all visit timelines and active queue entries.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
            >
              Keep Record
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl"
            >
              Delete Record
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
