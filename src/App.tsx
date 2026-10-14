import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AuthView } from './components/AuthView';
import { DashboardView } from './components/DashboardView';
import { PatientListView } from './components/PatientListView';
import { PatientProfileView } from './components/PatientProfileView';
import { PatientRegistrationView } from './components/PatientRegistrationView';
import { PatientSearchView } from './components/PatientSearchView';
import { IntelligentTriageView } from './components/IntelligentTriageView';
import { QueueManagementView } from './components/QueueManagementView';
import { EmergencyAlertsView } from './components/EmergencyAlertsView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    currentUser, 
    isAuthenticated, 
    activeTab, 
    setActiveTab, 
    selectedPatientId, 
    setSelectedPatientId, 
    toast 
  } = useApp();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Global keyboard shortcut: Cmd+K / Ctrl+K jumps to search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setActiveTab('search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTab]);

  // If user is not authenticated, render Login / Register view
  if (!isAuthenticated || !currentUser) {
    return <AuthView />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Top Navbar */}
      <Navbar 
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} 
        isSidebarOpen={isSidebarOpen} 
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 min-w-0 px-4 sm:px-6 lg:px-8 py-6 pb-16">
          {activeTab === 'dashboard' && <DashboardView />}

          {activeTab === 'patients' && (
            selectedPatientId ? (
              <PatientProfileView 
                patientId={selectedPatientId} 
                onBack={() => setSelectedPatientId(null)} 
              />
            ) : (
              <PatientListView />
            )
          )}

          {activeTab === 'register' && <PatientRegistrationView />}

          {activeTab === 'search' && <PatientSearchView />}

          {activeTab === 'triage' && <IntelligentTriageView />}

          {activeTab === 'queue' && <QueueManagementView />}

          {activeTab === 'alerts' && <EmergencyAlertsView />}

          {activeTab === 'analytics' && <AnalyticsView />}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Floating System Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border text-xs font-semibold ${
            toast.type === 'warning'
              ? 'bg-amber-50 text-amber-900 border-amber-200'
              : toast.type === 'error'
              ? 'bg-rose-50 text-rose-900 border-rose-200'
              : toast.type === 'info'
              ? 'bg-sky-50 text-sky-900 border-sky-200'
              : 'bg-teal-50 text-teal-900 border-teal-200'
          }`}>
            {toast.type === 'warning' ? (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-4 h-4 text-sky-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("SmartCare caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-lg border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Application Notice</h2>
            <p className="text-xs text-slate-500 mt-2 mb-5 leading-relaxed">
              SmartCare encountered a display issue. Click below to refresh and load fresh hospital data.
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              Reset & Reload SmartCare
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
