export type UserRole = 'patient' | 'doctor' | 'nurse' | 'receptionist';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department?: string;
  avatar?: string;
}

export type TriageLevel = 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN';

export type PatientStatus = 
  | 'Waiting' 
  | 'In Triage' 
  | 'In Consultation' 
  | 'Under Observation' 
  | 'Admitted' 
  | 'Discharged';

export interface VitalSigns {
  heartRate: number; // bpm (normal: 60-100)
  bloodPressureSys: number; // mmHg (normal: 90-120)
  bloodPressureDia: number; // mmHg (normal: 60-80)
  oxygenLevel: number; // SpO2 % (normal: 95-100)
  temperature: number; // °F (normal: 97.0 - 99.5)
}

export interface TriageAssessment {
  id: string;
  timestamp: string;
  symptoms: string[];
  customSymptom?: string;
  vitals: VitalSigns;
  urgencyLevel: TriageLevel;
  recommendedDepartment: string;
  triageReason: string;
  assessedBy: string;
}

export interface PatientVisit {
  id: string;
  date: string;
  reason: string;
  doctor: string;
  department: string;
  treatmentNotes: string;
  prescriptions?: string[];
  vitalsSummary?: string;
}

export interface Patient {
  id: string; // e.g. SC10021
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  address: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  medicalHistory: string;
  currentMedicines: string;
  allergies: string;
  registeredAt: string;
  status: PatientStatus;
  department: string;
  priority: TriageLevel;
  waitingTimeMinutes: number;
  assignedDoctor?: string;
  latestTriage?: TriageAssessment;
  visits: PatientVisit[];
  roomNumber?: string;
}

export interface EmergencyAlert {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  riskLevel: 'RED';
  mainSymptoms: string[];
  recommendedDepartment: string;
  timestamp: string;
  status: 'Active' | 'Attending' | 'Resolved';
  assignedDoctor?: string;
  alertNotes?: string;
}

export type ActiveTab = 
  | 'dashboard' 
  | 'patients' 
  | 'register' 
  | 'search' 
  | 'triage' 
  | 'queue' 
  | 'alerts' 
  | 'analytics' 
  | 'settings';
