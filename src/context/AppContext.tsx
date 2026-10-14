import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Patient, 
  EmergencyAlert, 
  User, 
  UserRole, 
  ActiveTab, 
  TriageAssessment, 
  PatientVisit, 
  PatientStatus, 
  TriageLevel 
} from '../types';
import { 
  INITIAL_PATIENTS, 
  INITIAL_USERS, 
  INITIAL_ALERTS 
} from '../data/initialData';

interface AppContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (identifier: string, role?: UserRole) => boolean;
  register: (name: string, email: string, phone: string, role: UserRole) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  
  // Navigation
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;
  viewPatient: (patientId: string) => void;
  startTriageForPatient: (patientId?: string) => void;

  // Patients
  patients: Patient[];
  addPatient: (data: Omit<Patient, 'id' | 'registeredAt' | 'visits' | 'waitingTimeMinutes' | 'status' | 'priority' | 'department'> & { department?: string; status?: PatientStatus }) => Patient;
  updatePatient: (patientId: string, updates: Partial<Patient>) => void;
  deletePatient: (patientId: string) => void;
  addPatientVisit: (patientId: string, visit: Omit<PatientVisit, 'id' | 'date'>) => void;

  // Triage & Queue
  saveTriageAssessment: (patientId: string, assessment: Omit<TriageAssessment, 'id' | 'timestamp' | 'assessedBy'>) => void;
  updateQueueItem: (patientId: string, updates: { assignedDoctor?: string; department?: string; status?: PatientStatus; priority?: TriageLevel }) => void;
  removeFromQueue: (patientId: string) => void;

  // Alerts
  emergencyAlerts: EmergencyAlert[];
  resolveAlert: (alertId: string) => void;
  acknowledgeAlert: (alertId: string, doctorName?: string) => void;

  // Toast / System info
  toast: { message: string; type: 'success' | 'warning' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'warning' | 'info' | 'error') => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PATIENTS: 'smartcare_patients_v1',
  ALERTS: 'smartcare_alerts_v1',
  USER: 'smartcare_current_user_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. User & Authentication
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved && saved !== 'undefined') {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.id) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    // Return null initially so the first page is the Login page as requested in requirement 1!
    return null;
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      if (saved && saved !== 'undefined') {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(p => ({
            ...p,
            priority: p.priority || 'GREEN',
            status: p.status || 'Waiting',
            visits: Array.isArray(p.visits) ? p.visits : [],
            department: p.department || 'General Medicine',
            waitingTimeMinutes: typeof p.waitingTimeMinutes === 'number' ? p.waitingTimeMinutes : 5,
          }));
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PATIENTS;
  });

  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ALERTS);
      if (saved && saved !== 'undefined') {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map(a => ({
            ...a,
            mainSymptoms: Array.isArray(a.mainSymptoms) ? a.mainSymptoms : [],
            status: a.status || 'Active',
            riskLevel: 'RED' as const,
          }));
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ALERTS;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | 'info' | 'error' } | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    } catch (e) {
      console.error(e);
    }
  }, [patients]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(emergencyAlerts));
    } catch (e) {
      console.error(e);
    }
  }, [emergencyAlerts]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  const showToast = (message: string, type: 'success' | 'warning' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Auth functions
  const login = (identifier: string, role?: UserRole): boolean => {
    // If empty, return false
    if (!identifier.trim()) return false;

    // Check if matches an existing sample user or create custom user
    const existing = INITIAL_USERS.find(
      u => u.email.toLowerCase() === identifier.toLowerCase() || u.phone === identifier
    );

    if (existing) {
      setCurrentUser(existing);
    } else {
      const defaultRole = role || 'receptionist';
      const newUser: User = {
        id: `USR-${Date.now().toString().slice(-4)}`,
        name: identifier.includes('@') ? identifier.split('@')[0] : 'Healthcare Staff',
        email: identifier.includes('@') ? identifier : `${identifier}@smartcare.hospital`,
        phone: identifier.includes('@') ? '+1 (555) 000-1122' : identifier,
        role: defaultRole,
        department: defaultRole === 'doctor' ? 'Cardiology' : defaultRole === 'nurse' ? 'Triage' : 'Front Desk',
        avatar: defaultRole === 'doctor' ? '👩‍⚕️' : defaultRole === 'nurse' ? '🧑‍⚕️' : defaultRole === 'patient' ? '👤' : '👨‍💼',
      };
      setCurrentUser(newUser);
    }

    setActiveTab('dashboard');
    showToast('Welcome back to SmartCare!', 'success');
    return true;
  };

  const register = (name: string, email: string, phone: string, role: UserRole): boolean => {
    const newUser: User = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name,
      email,
      phone,
      role,
      department: role === 'doctor' ? 'Cardiology' : role === 'nurse' ? 'Triage' : role === 'receptionist' ? 'Admissions' : undefined,
      avatar: role === 'doctor' ? '👩‍⚕️' : role === 'nurse' ? '🧑‍⚕️' : role === 'patient' ? '👤' : '👨‍💼',
    };
    setCurrentUser(newUser);
    setActiveTab('dashboard');
    showToast(`Account created successfully as ${role.toUpperCase()}. Welcome!`, 'success');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setSelectedPatientId(null);
    showToast('You have been logged out safely.', 'info');
  };

  const switchRole = (role: UserRole) => {
    const matched = INITIAL_USERS.find(u => u.role === role);
    if (matched) {
      setCurrentUser(matched);
      showToast(`Switched view to ${matched.name} (${role.toUpperCase()})`, 'info');
    } else if (currentUser) {
      const updated = { ...currentUser, role };
      setCurrentUser(updated);
      showToast(`Role updated to ${role.toUpperCase()}`, 'info');
    }
  };

  const viewPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveTab('patients');
  };

  const startTriageForPatient = (patientId?: string) => {
    if (patientId) {
      setSelectedPatientId(patientId);
    }
    setActiveTab('triage');
  };

  // Add Patient
  const addPatient = (
    data: Omit<Patient, 'id' | 'registeredAt' | 'visits' | 'waitingTimeMinutes' | 'status' | 'priority' | 'department'> & {
      department?: string;
      status?: PatientStatus;
    }
  ): Patient => {
    // Generate sequential ID: e.g. SC10028
    const existingNumbers = patients
      .map(p => {
        const num = parseInt(p.id.replace('SC', ''), 10);
        return isNaN(num) ? 0 : num;
      })
      .filter(n => n > 0);

    const nextNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 10028;
    const newId = `SC${nextNum}`;

    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newPatient: Patient = {
      ...data,
      id: newId,
      registeredAt: formattedDate,
      status: data.status || 'Waiting',
      department: data.department || 'General Medicine',
      priority: 'GREEN',
      waitingTimeMinutes: 5,
      visits: [],
    };

    setPatients(prev => [newPatient, ...prev]);
    showToast(`Patient ${newPatient.name} registered with ID: ${newId}`, 'success');
    return newPatient;
  };

  const updatePatient = (patientId: string, updates: Partial<Patient>) => {
    setPatients(prev =>
      prev.map(p => {
        if (p.id === patientId) {
          return { ...p, ...updates };
        }
        return p;
      })
    );
    showToast('Patient details updated successfully', 'success');
  };

  const deletePatient = (patientId: string) => {
    setPatients(prev => prev.filter(p => p.id !== patientId));
    setEmergencyAlerts(prev => prev.filter(a => a.patientId !== patientId));
    if (selectedPatientId === patientId) {
      setSelectedPatientId(null);
    }
    showToast('Patient record removed', 'info');
  };

  const addPatientVisit = (patientId: string, visitData: Omit<PatientVisit, 'id' | 'date'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newVisit: PatientVisit = {
      ...visitData,
      id: `V-${Date.now().toString().slice(-4)}`,
      date: today,
    };

    setPatients(prev =>
      prev.map(p => {
        if (p.id === patientId) {
          return {
            ...p,
            visits: [newVisit, ...p.visits],
          };
        }
        return p;
      })
    );

    showToast('Visit record added to patient timeline', 'success');
  };

  const saveTriageAssessment = (
    patientId: string,
    assessmentData: Omit<TriageAssessment, 'id' | 'timestamp' | 'assessedBy'>
  ) => {
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const assessor = currentUser?.name || 'SmartCare Triage Nurse';

    const triageRecord: TriageAssessment = {
      ...assessmentData,
      id: `TR-${Date.now().toString().slice(-4)}`,
      timestamp: formattedDate,
      assessedBy: assessor,
    };

    let targetPatientName = '';
    let targetPatientAge = 40;

    setPatients(prev =>
      prev.map(p => {
        if (p.id === patientId) {
          targetPatientName = p.name;
          targetPatientAge = p.age;
          return {
            ...p,
            priority: assessmentData.urgencyLevel,
            department: assessmentData.recommendedDepartment,
            latestTriage: triageRecord,
            status: assessmentData.urgencyLevel === 'RED' ? 'Waiting' : p.status,
          };
        }
        return p;
      })
    );

    // If RED Emergency, automatically raise an Emergency Alert
    if (assessmentData.urgencyLevel === 'RED') {
      const newAlert: EmergencyAlert = {
        id: `ALT-${Date.now().toString().slice(-4)}`,
        patientId,
        patientName: targetPatientName || 'Patient',
        age: targetPatientAge,
        riskLevel: 'RED',
        mainSymptoms: assessmentData.symptoms,
        recommendedDepartment: assessmentData.recommendedDepartment,
        timestamp: formattedDate,
        status: 'Active',
        alertNotes: assessmentData.triageReason,
      };

      setEmergencyAlerts(prev => [newAlert, ...prev.filter(a => a.patientId !== patientId)]);
      showToast('CRITICAL ALERT: Emergency triage flagged. Emergency team notified.', 'warning');
    } else {
      showToast(`Triage assessment saved: Priority ${assessmentData.urgencyLevel}`, 'success');
    }
  };

  const updateQueueItem = (
    patientId: string,
    updates: {
      assignedDoctor?: string;
      department?: string;
      status?: PatientStatus;
      priority?: TriageLevel;
    }
  ) => {
    setPatients(prev =>
      prev.map(p => {
        if (p.id === patientId) {
          return { ...p, ...updates };
        }
        return p;
      })
    );
    showToast('Queue status updated', 'success');
  };

  const removeFromQueue = (patientId: string) => {
    setPatients(prev =>
      prev.map(p => {
        if (p.id === patientId) {
          return { ...p, status: 'Discharged' };
        }
        return p;
      })
    );
    showToast('Patient marked as completed & discharged from queue', 'info');
  };

  const resolveAlert = (alertId: string) => {
    setEmergencyAlerts(prev =>
      prev.map(a => {
        if (a.id === alertId) {
          return { ...a, status: 'Resolved' };
        }
        return a;
      })
    );
    showToast('Emergency alert resolved', 'success');
  };

  const acknowledgeAlert = (alertId: string, doctorName?: string) => {
    setEmergencyAlerts(prev =>
      prev.map(a => {
        if (a.id === alertId) {
          return {
            ...a,
            status: 'Attending',
            assignedDoctor: doctorName || currentUser?.name || 'On-duty Physician',
          };
        }
        return a;
      })
    );
    showToast('Emergency response team is attending to the patient', 'info');
  };

  const resetDemoData = () => {
    setPatients(INITIAL_PATIENTS);
    setEmergencyAlerts(INITIAL_ALERTS);
    setSelectedPatientId(null);
    localStorage.removeItem(STORAGE_KEYS.PATIENTS);
    localStorage.removeItem(STORAGE_KEYS.ALERTS);
    showToast('Reset to original sample data successfully', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        register,
        logout,
        switchRole,
        activeTab,
        setActiveTab,
        selectedPatientId,
        setSelectedPatientId,
        viewPatient,
        startTriageForPatient,
        patients,
        addPatient,
        updatePatient,
        deletePatient,
        addPatientVisit,
        saveTriageAssessment,
        updateQueueItem,
        removeFromQueue,
        emergencyAlerts,
        resolveAlert,
        acknowledgeAlert,
        toast,
        showToast,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
