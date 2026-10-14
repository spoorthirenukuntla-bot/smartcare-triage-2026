import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download } from 'lucide-react';
import { Html5QrcodeScanner } from "html5-qrcode";
import { 
  UserPlus, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  Stethoscope, 
  Eye, 
  Edit3, 
  LayoutDashboard,
  ShieldCheck,
  User,
  Heart,
  Pill,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Patient } from '../types';

export const PatientRegistrationView: React.FC = () => {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scannedPatientId, setScannedPatientId] = useState("");
  const { addPatient, viewPatient, startTriageForPatient, setActiveTab } = useApp();

  // Registration Form State
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [bloodGroup, setBloodGroup] = useState<'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'>('O+');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [currentMedicines, setCurrentMedicines] = useState('');
  const [allergies, setAllergies] = useState('');

  // Registered patient success result
  const [registeredPatient, setRegisteredPatient] = useState<Patient | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !age) {
      return;
    }

    const newPatient = addPatient({
      name: name.trim(),
      age: Number(age),
      gender,
      phone: phone.trim(),
      address: address.trim() || 'Not specified',
      bloodGroup,
      medicalHistory: medicalHistory.trim() || 'No chronic conditions recorded',
      currentMedicines: currentMedicines.trim() || 'None',
      allergies: allergies.trim() || 'No known allergies',
      status: 'Waiting',
      department: 'General Medicine',
    });

    setRegisteredPatient(newPatient);
  };

  const handleResetForm = () => {
    setName('');
    setAge('');
    setGender('Male');
    setPhone('');
    setAddress('');
    setBloodGroup('O+');
    setMedicalHistory('');
    setCurrentMedicines('');
    setAllergies('');
    setRegisteredPatient(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Registration</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quickly enroll a new patient, record medical background, and auto-generate an official SmartCare Patient ID.
          </p>
        </div>

        {registeredPatient && (
          <button
            onClick={handleResetForm}
            className="self-start sm:self-auto px-3.5 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Register Another Patient</span>
          </button>
        )}
      </div>

      {/* Success State Screen */}
      {registeredPatient ? (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-teal-100 shadow-sm text-center animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Patient registered successfully.
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            A permanent digital medical file has been assigned. You can now start triage, view records, or manage the queue.
          </p>

          {/* Generated ID Badge Box */}
          <div className="my-6 p-4 max-w-sm mx-auto bg-gradient-to-r from-teal-50 via-sky-50 to-teal-50 border border-teal-200 rounded-2xl">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Official Patient ID
            </span>
            <span className="text-3xl font-extrabold text-teal-800 tracking-tight font-mono block mt-1">
              {registeredPatient.id}
            </span>
            <div className="mt-2 text-xs text-slate-700 font-medium">
              {registeredPatient.name} · {registeredPatient.age} yrs · {registeredPatient.gender} · {registeredPatient.bloodGroup}
            </div>
          </div>
          
{/* Patient QR Code */}
<div className="my-6 p-4 bg-white border border-slate-200 rounded-2xl">
  <h3 className="text-sm font-bold text-slate-900 mb-3 text-center">
    Patient QR Code
  </h3>

  <div id="patient-qr-code" className="flex justify-center">
    <QRCodeSVG
      value={registeredPatient.id}
      size={200}
      level="M"
      includeMargin
    />
  </div>

  <p className="text-xs text-slate-500 mt-3 text-center">
    Scan this code to identify the patient.
  </p>

  <div className="flex justify-center">
    <button
      type="button"
      onClick={() => {
        const svg = document.querySelector(
          '#patient-qr-code svg'
        );

        if (!svg) return;

        const blob = new Blob(
          [new XMLSerializer().serializeToString(svg)],
          { type: 'image/svg+xml;charset=utf-8' }
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = `patient-${registeredPatient.id}-qr.svg`;
        link.click();

        URL.revokeObjectURL(url);
      }}
      className="mt-3 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold"
    >
      <Download className="w-4 h-4 inline mr-2" />
      Download QR Code
    </button>
    <button
  type="button"
  onClick={() => setShowQRScanner(!showQRScanner)}
  className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold"
>
  {showQRScanner ? "Close QR Scanner" : "Scan QR Code"}
</button>
{showQRScanner && (
  <div className="mt-4 rounded-xl border border-blue-200 bg-white p-4">
    <h3 className="mb-3 text-lg font-semibold text-slate-800">
      Scan Patient QR Code
    </h3>
    <div id="patient-qr-reader" className="w-full" />
    <p className="mt-2 text-sm text-slate-500">
      Allow camera access and point it at the patient's QR code.
    </p>
  </div>
)}
  </div>
</div>
          {/* Four Requested Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => viewPatient(registeredPatient.id)}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>View Patient</span>
            </button>

            <button
              onClick={() => startTriageForPatient(registeredPatient.id)}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-2"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Start Triage</span>
            </button>

            <button
              onClick={() => {
                // Switch back to edit mode in form
                setName(registeredPatient.name);
                setAge(registeredPatient.age);
                setGender(registeredPatient.gender);
                setPhone(registeredPatient.phone);
                setAddress(registeredPatient.address);
                setBloodGroup(registeredPatient.bloodGroup);
                setMedicalHistory(registeredPatient.medicalHistory);
                setCurrentMedicines(registeredPatient.currentMedicines);
                setAllergies(registeredPatient.allergies);
                setRegisteredPatient(null);
              }}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Details</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      ) : (
        /* Patient Form */
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          
          {/* Section: Basic Demographics */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <User className="w-4 h-4 text-teal-600" />
              <span>1. Basic Personal Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Patient Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Age <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="125"
                  value={age}
                  onChange={e => setAge(e.target.value === '' ? '' : parseInt(e.target.value))}
                  placeholder="e.g. 42"
                  className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Gender <span className="text-rose-500">*</span>
                </label>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value as 'Male' | 'Female' | 'Other')}
                  className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Blood Group
                </label>
                <select
                  value={bloodGroup}
                  onChange={e => setBloodGroup(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Residential Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Street name, apartment, city, state"
                  className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
                />
              </div>

            </div>
          </div>

          {/* Section: Medical Background */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Heart className="w-4 h-4 text-teal-600" />
              <span>2. Medical History & Current Care</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Medical History
                </label>
                <textarea
                  rows={3}
                  value={medicalHistory}
                  onChange={e => setMedicalHistory(e.target.value)}
                  placeholder="e.g. Asthma, Hypertension, Past surgeries..."
                  className="w-full px-3.5 py-2 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
                />
                <span className="text-[11px] text-slate-400">Past conditions or diagnoses</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Current Medicines
                </label>
                <textarea
                  rows={3}
                  value={currentMedicines}
                  onChange={e => setCurrentMedicines(e.target.value)}
                  placeholder="e.g. Lisinopril 10mg once daily, Multivitamins..."
                  className="w-full px-3.5 py-2 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
                />
                <span className="text-[11px] text-slate-400">Prescription or over-the-counter drugs</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Allergies
                </label>
                <textarea
                  rows={3}
                  value={allergies}
                  onChange={e => setAllergies(e.target.value)}
                  placeholder="e.g. Penicillin, Latex, Peanuts (or 'None')..."
                  className="w-full px-3.5 py-2 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
                />
                <span className="text-[11px] text-slate-400">Drug or environmental allergies</span>
              </div>

            </div>
          </div>

          {/* Submit button bar */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              * A unique <strong>Patient ID (e.g. SC10028)</strong> will be generated automatically.
            </span>

            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Complete Registration</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
