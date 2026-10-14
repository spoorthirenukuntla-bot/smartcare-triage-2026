import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Activity, 
  Heart, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  ShieldAlert, 
  Info, 
  UserCheck, 
  Flame, 
  Wind, 
  Clock,
  Sparkles,
  ClipboardCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateTriage, TriageResult } from '../utils/triageCalculator';
import { VitalSigns, TriageLevel } from '../types';

export const IntelligentTriageView: React.FC = () => {
  const { 
    patients, 
    selectedPatientId, 
    saveTriageAssessment, 
    viewPatient, 
    setActiveTab 
  } = useApp();

  // Selected patient for triage
  const [patientId, setPatientId] = useState<string>(selectedPatientId || patients[0]?.id || '');

  // Step 1: Symptoms
  const availableSymptoms = [
    { id: 'Chest pain', label: 'Chest pain', icon: '❤️' },
    { id: 'Breathing difficulty', label: 'Breathing difficulty', icon: '🫁' },
    { id: 'Fever', label: 'Fever', icon: '🌡️' },
    { id: 'Head injury', label: 'Head injury', icon: '🤕' },
    { id: 'Stomach pain', label: 'Stomach pain', icon: '🤢' },
    { id: 'Dizziness', label: 'Dizziness', icon: '💫' },
    { id: 'Cough', label: 'Cough', icon: '🗣️' },
    { id: 'Vomiting', label: 'Vomiting', icon: '🤮' },
    { id: 'Other', label: 'Other', icon: '➕' },
  ];

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');

  // Step 2: Vital Signs
  const [heartRate, setHeartRate] = useState<number | ''>(76);
  const [bpSys, setBpSys] = useState<number | ''>(120);
  const [bpDia, setBpDia] = useState<number | ''>(80);
  const [oxygenLevel, setOxygenLevel] = useState<number | ''>(98);
  const [temperature, setTemperature] = useState<number | ''>(98.6);

  // Step 3: Result & Calculation
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // If selectedPatientId changes from context, sync local patientId
  useEffect(() => {
    if (selectedPatientId) {
      setPatientId(selectedPatientId);
      const found = patients.find(p => p.id === selectedPatientId);
      if (found?.latestTriage) {
        setSelectedSymptoms(found.latestTriage.symptoms);
        setCustomSymptom(found.latestTriage.customSymptom || '');
        setHeartRate(found.latestTriage.vitals.heartRate);
        setBpSys(found.latestTriage.vitals.bloodPressureSys);
        setBpDia(found.latestTriage.vitals.bloodPressureDia);
        setOxygenLevel(found.latestTriage.vitals.oxygenLevel);
        setTemperature(found.latestTriage.vitals.temperature);
      }
    }
  }, [selectedPatientId, patients]);

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleRunTriage = (e: React.FormEvent) => {
    e.preventDefault();

    const vitals: VitalSigns = {
      heartRate: Number(heartRate) || 75,
      bloodPressureSys: Number(bpSys) || 120,
      bloodPressureDia: Number(bpDia) || 80,
      oxygenLevel: Number(oxygenLevel) || 98,
      temperature: Number(temperature) || 98.6,
    };

    const result = calculateTriage(selectedSymptoms, customSymptom, vitals);
    setTriageResult(result);
  };

  const handleApplyToQueue = () => {
    if (!triageResult || !patientId) return;

    const vitals: VitalSigns = {
      heartRate: Number(heartRate) || 75,
      bloodPressureSys: Number(bpSys) || 120,
      bloodPressureDia: Number(bpDia) || 80,
      oxygenLevel: Number(oxygenLevel) || 98,
      temperature: Number(temperature) || 98.6,
    };

    saveTriageAssessment(patientId, {
      symptoms: selectedSymptoms,
      customSymptom: customSymptom.trim() || undefined,
      vitals,
      urgencyLevel: triageResult.level,
      recommendedDepartment: triageResult.recommendedDepartment,
      triageReason: triageResult.reasons.join('; '),
    });

    setSavedSuccess(true);
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setCustomSymptom('');
    setHeartRate(76);
    setBpSys(120);
    setBpDia(80);
    setOxygenLevel(98);
    setTemperature(98.6);
    setTriageResult(null);
    setSavedSuccess(false);
  };

  const targetPatient = patients.find(p => p.id === patientId);

  const urgencyVisuals: Record<TriageLevel, { bg: string; border: string; text: string; badge: string }> = {
    RED: {
      bg: 'bg-rose-50',
      border: 'border-rose-300',
      text: 'text-rose-900',
      badge: 'bg-rose-600 text-white',
    },
    ORANGE: {
      bg: 'bg-orange-50',
      border: 'border-orange-300',
      text: 'text-orange-900',
      badge: 'bg-orange-500 text-white',
    },
    YELLOW: {
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      text: 'text-amber-900',
      badge: 'bg-amber-500 text-white',
    },
    GREEN: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-300',
      text: 'text-emerald-900',
      badge: 'bg-emerald-600 text-white',
    },
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Title & Simple Explanation */}
      <div className="bg-gradient-to-r from-teal-50 via-sky-50 to-teal-50 rounded-3xl p-6 sm:p-7 border border-teal-100">
        <div className="flex items-start gap-3.5">
          <div className="p-3 bg-teal-600 text-white rounded-2xl shadow-xs shrink-0">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Triage</h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              Answer a few questions about the patient's symptoms and vital signs. SmartCare will help identify the urgency level and suggest the most appropriate hospital department.
            </p>
          </div>
        </div>
      </div>

      {/* Main Triage Workspace */}
      <form onSubmit={handleRunTriage} className="space-y-6">
        
        {/* Patient Selection Box */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-900">
                Select Patient to Evaluate
              </label>
              <span className="text-[11px] text-slate-500">
                Choose an existing registered patient from the hospital database
              </span>
            </div>

            <div className="w-full sm:w-72">
              <select
                value={patientId}
                onChange={e => {
                  setPatientId(e.target.value);
                  setTriageResult(null);
                  setSavedSuccess(false);
                }}
                className="w-full px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-500"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id}) · {p.age} yrs · {p.priority}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {targetPatient && (
            <div className="mt-3 text-xs text-slate-600 flex flex-wrap items-center gap-3">
              <span>Patient: <strong className="text-slate-800">{targetPatient.name}</strong></span>
              <span>·</span>
              <span>Age: {targetPatient.age} yrs</span>
              <span>·</span>
              <span>History: {targetPatient.medicalHistory || 'None'}</span>
              <span>·</span>
              <span>Allergies: <span className="text-rose-700 font-medium">{targetPatient.allergies || 'None'}</span></span>
            </div>
          )}
        </div>

        {/* Step 1 – Symptoms */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
          <div className="pb-3 border-b border-slate-100 mb-4">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center">1</span>
              <span>Step 1 – Symptoms</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select all symptoms that the patient is currently experiencing.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {availableSymptoms.map(sym => {
              const isSelected = selectedSymptoms.includes(sym.id);
              return (
                <button
                  key={sym.id}
                  type="button"
                  onClick={() => toggleSymptom(sym.id)}
                  className={`p-3 rounded-2xl border text-xs font-medium flex items-center gap-2.5 transition-all text-left ${
                    isSelected
                      ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-2xs ring-1 ring-teal-400 font-semibold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-base">{sym.icon}</span>
                  <span className="truncate">{sym.label}</span>
                </button>
              );
            })}
          </div>

          {selectedSymptoms.includes('Other') && (
            <div className="mt-4 animate-in fade-in">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Describe Additional Symptoms
              </label>
              <input
                type="text"
                value={customSymptom}
                onChange={e => setCustomSymptom(e.target.value)}
                placeholder="e.g. Skin rash, Twisted ankle, Eye pain..."
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-500"
              />
            </div>
          )}
        </div>

        {/* Step 2 – Vital Signs */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
          <div className="pb-3 border-b border-slate-100 mb-4">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 text-xs font-bold flex items-center justify-center">2</span>
              <span>Step 2 – Vital Signs</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter current readings. Normal healthy ranges are shown below each field for clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Heart Rate */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Heart Rate (Pulse)
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="30"
                  max="240"
                  value={heartRate}
                  onChange={e => setHeartRate(e.target.value === '' ? '' : parseInt(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">bpm</span>
              </div>
              <span className="text-[11px] text-slate-500 block mt-1.5">Normal: 60 – 100 bpm</span>
            </div>

            {/* Blood Pressure */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Blood Pressure (Sys / Dia)
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  required
                  min="50"
                  max="260"
                  value={bpSys}
                  onChange={e => setBpSys(e.target.value === '' ? '' : parseInt(e.target.value))}
                  placeholder="120"
                  className="w-1/2 px-2.5 py-2 text-sm font-bold text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-500"
                />
                <span className="text-slate-400 font-bold">/</span>
                <input
                  type="number"
                  required
                  min="30"
                  max="160"
                  value={bpDia}
                  onChange={e => setBpDia(e.target.value === '' ? '' : parseInt(e.target.value))}
                  placeholder="80"
                  className="w-1/2 px-2.5 py-2 text-sm font-bold text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-500"
                />
              </div>
              <span className="text-[11px] text-slate-500 block mt-1.5">Normal: 90–120 / 60–80</span>
            </div>

            {/* Oxygen Level */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Oxygen Level (SpO2)
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="50"
                  max="100"
                  value={oxygenLevel}
                  onChange={e => setOxygenLevel(e.target.value === '' ? '' : parseInt(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">%</span>
              </div>
              <span className="text-[11px] text-slate-500 block mt-1.5">Normal: 95 – 100%</span>
            </div>

            {/* Temperature */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Body Temperature
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  required
                  min="90"
                  max="110"
                  value={temperature}
                  onChange={e => setTemperature(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-teal-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">°F</span>
              </div>
              <span className="text-[11px] text-slate-500 block mt-1.5">Normal: 97.0 – 99.5 °F</span>
            </div>

          </div>

          <div className="mt-5 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
            >
              Reset Inputs
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Evaluate Triage Urgency</span>
            </button>
          </div>
        </div>

      </form>

      {/* Step 3 – Risk Result & Department Recommendation */}
      {triageResult && (
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-sm space-y-6 animate-in fade-in zoom-in-95 ${urgencyVisuals[triageResult.level].bg} ${urgencyVisuals[triageResult.level].border}`}>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/10">
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 block mb-1">
                STEP 3 – RISK RESULT
              </span>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-xl text-xs font-black tracking-wide ${urgencyVisuals[triageResult.level].badge}`}>
                  {triageResult.title}
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {triageResult.description}
                </span>
              </div>
            </div>

            {/* Department Recommendation Box */}
            <div className="p-3.5 bg-white/90 rounded-2xl border border-slate-200/80 shadow-2xs sm:text-right">
              <span className="text-[11px] font-semibold text-slate-500 block">
                Suggested Hospital Unit
              </span>
              <span className="text-sm font-bold text-teal-800 block mt-0.5">
                Recommended Department: {triageResult.recommendedDepartment}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Final department assignment should be confirmed by healthcare staff.
              </span>
            </div>
          </div>

          {/* Clinical Urgency Findings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="bg-white/80 p-4 rounded-2xl border border-black/5">
              <h4 className="text-xs font-bold text-slate-900 mb-2">Key Triage Triggers:</h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {triageResult.reasons.map((r, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-teal-600 mt-0.5">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/80 p-4 rounded-2xl border border-black/5">
              <h4 className="text-xs font-bold text-slate-900 mb-2">Immediate Protocol Checklist:</h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {triageResult.immediateSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Mandatory Disclaimer Box */}
          <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-amber-900 text-xs">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Medical Disclaimer:</strong> This is a prototype/demo triage system, not a real medical diagnosis system. This result is only a preliminary priority suggestion and does not replace a qualified healthcare professional.
            </p>
          </div>

          {/* Action Confirmation Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-600">
              {savedSuccess ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Triage successfully applied to patient queue!
                </span>
              ) : (
                <span>Click below to save this priority and auto-sort into queue.</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleApplyToQueue}
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
              >
                <ClipboardCheck className="w-4 h-4" />
                <span>Save & Assign to Patient Queue</span>
              </button>

              <button
                type="button"
                onClick={() => viewPatient(patientId)}
                className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                View Patient Chart
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('queue')}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Go to Queue
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
