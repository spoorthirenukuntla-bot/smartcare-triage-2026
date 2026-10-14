import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  User, 
  ArrowRight, 
  Stethoscope, 
  Clock, 
  ShieldAlert, 
  HeartHandshake,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_DOCTORS } from '../data/initialData';

export const EmergencyAlertsView: React.FC = () => {
  const { 
    emergencyAlerts, 
    viewPatient, 
    resolveAlert, 
    acknowledgeAlert,
    currentUser 
  } = useApp();

  const activeAlerts = emergencyAlerts.filter(a => a.status !== 'Resolved');
  const resolvedAlerts = emergencyAlerts.filter(a => a.status === 'Resolved');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Emergency Alerts</h1>
            {activeAlerts.length > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Active high-urgency notifications automatically flagged for immediate resuscitation, trauma, or cardiology response.
          </p>
        </div>

        <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <span>{activeAlerts.length} Critical Cases Active</span>
        </div>
      </div>

      {/* Active Alerts List */}
      <div className="space-y-4">
        {activeAlerts.map(alert => (
          <div
            key={alert.id}
            className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-rose-200 shadow-sm relative overflow-hidden transition-all hover:border-rose-300"
          >
            {/* Top red header accent */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-rose-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                      🔴 EMERGENCY ALERT
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {alert.timestamp}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    Critical patient requires immediate attention.
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  alert.status === 'Attending'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-600 text-white'
                }`}>
                  {alert.status === 'Attending' ? 'Staff Attending' : 'Requires Immediate Action'}
                </span>
              </div>
            </div>

            {/* Alert Content: Patient Name, ID, Risk Level, Symptoms, Recommended Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-4">
              
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 block">Patient Name</span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">{alert.patientName}</span>
                <span className="text-[11px] font-mono font-semibold text-teal-700">{alert.patientId}</span>
              </div>

              <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-100">
                <span className="text-[11px] font-semibold text-rose-600 block">Risk Level</span>
                <span className="text-sm font-black text-rose-700 block mt-0.5">RED – Critical Emergency</span>
                <span className="text-[11px] text-rose-600">Immediate response</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 block">Main Symptoms</span>
                <span className="text-xs font-bold text-slate-800 block mt-0.5 truncate">
                  {(alert.mainSymptoms || []).join(', ')}
                </span>
                <span className="text-[11px] text-slate-500">From triage intake</span>
              </div>

              <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-100">
                <span className="text-[11px] font-semibold text-teal-700 block">Recommended Department</span>
                <span className="text-sm font-bold text-teal-900 block mt-0.5">{alert.recommendedDepartment}</span>
                <span className="text-[11px] text-teal-700">Trauma / Specialist Bay</span>
              </div>

            </div>

            {alert.alertNotes && (
              <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-700 mb-4 border border-slate-100">
                <strong>Clinical Notes:</strong> {alert.alertNotes}
              </div>
            )}

            {/* Staff Assigned & Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                {alert.assignedDoctor ? (
                  <span>
                    Responding Clinician: <strong className="text-slate-800">{alert.assignedDoctor}</strong>
                  </span>
                ) : (
                  <span className="text-amber-700 font-semibold">
                    ⚠️ No doctor assigned to this emergency yet.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {alert.status === 'Active' && (
                  <button
                    onClick={() => acknowledgeAlert(alert.id, currentUser?.name)}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Acknowledge & Attend</span>
                  </button>
                )}

                <button
                  onClick={() => viewPatient(alert.patientId)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>View Patient</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => resolveAlert(alert.id)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors"
                >
                  Mark Resolved
                </button>
              </div>
            </div>

          </div>
        ))}

        {activeAlerts.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No active emergency alerts</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              All registered patients are currently stable or attended to. If a patient is evaluated as RED in triage, an alert will be raised here immediately.
            </p>
          </div>
        )}
      </div>

      {/* Resolved Alerts Archive */}
      {resolvedAlerts.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <h3 className="text-sm font-bold text-slate-800 mb-3">Resolved Emergency Alerts Archive</h3>
          <div className="divide-y divide-slate-100 text-xs">
            {resolvedAlerts.map(r => (
              <div key={r.id} className="py-2.5 flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-300" />
                  <span className="font-semibold text-slate-800">{r.patientName}</span>
                  <span className="text-[11px] font-mono text-slate-400">({r.patientId})</span>
                  <span className="text-slate-400">· {r.recommendedDepartment}</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                  Resolved & Attended
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
