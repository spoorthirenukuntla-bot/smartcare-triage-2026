import { TriageLevel, VitalSigns } from '../types';

export interface TriageResult {
  level: TriageLevel;
  title: string;
  description: string;
  recommendedDepartment: string;
  reasons: string[];
  immediateSteps: string[];
}

export function calculateTriage(
  symptoms: string[],
  customSymptom: string,
  vitals: VitalSigns
): TriageResult {
  const reasons: string[] = [];
  const immediateSteps: string[] = [];

  const symLower = symptoms.map(s => s.toLowerCase());
  const customLower = customSymptom.toLowerCase();

  let isRed = false;
  let isOrange = false;
  let isYellow = false;

  // 1. Critical Symptoms Check (RED)
  if (symLower.includes('chest pain')) {
    isRed = true;
    reasons.push('Reported chest pain (potential acute cardiac event)');
  }
  if (symLower.includes('breathing difficulty') && vitals.oxygenLevel < 92) {
    isRed = true;
    reasons.push('Severe breathing difficulty with low oxygen saturation');
  } else if (symLower.includes('breathing difficulty')) {
    isOrange = true;
    reasons.push('Reported breathing difficulty');
  }

  if (symLower.includes('head injury') && (symLower.includes('dizziness') || vitals.bloodPressureSys > 160)) {
    isRed = true;
    reasons.push('Head injury accompanied by neurological signs or elevated BP');
  } else if (symLower.includes('head injury')) {
    isOrange = true;
    reasons.push('Head trauma reported');
  }

  // 2. Critical Vitals Check (RED)
  if (vitals.oxygenLevel > 0 && vitals.oxygenLevel < 90) {
    isRed = true;
    reasons.push(`Severely low oxygen level (${vitals.oxygenLevel}%) requires immediate supplemental oxygen`);
  } else if (vitals.oxygenLevel >= 90 && vitals.oxygenLevel < 94) {
    isOrange = true;
    reasons.push(`Sub-optimal oxygen saturation (${vitals.oxygenLevel}%)`);
  }

  if (vitals.heartRate > 130) {
    isRed = true;
    reasons.push(`Extreme tachycardia: Heart rate is dangerously high (${vitals.heartRate} bpm)`);
  } else if (vitals.heartRate > 0 && vitals.heartRate < 45) {
    isRed = true;
    reasons.push(`Severe bradycardia: Heart rate is critically low (${vitals.heartRate} bpm)`);
  } else if (vitals.heartRate > 110 || (vitals.heartRate > 0 && vitals.heartRate < 55)) {
    isOrange = true;
    reasons.push(`Abnormal pulse rate (${vitals.heartRate} bpm)`);
  }

  if (vitals.bloodPressureSys >= 180 || vitals.bloodPressureDia >= 110) {
    isRed = true;
    reasons.push(`Hypertensive crisis: Blood pressure is dangerously elevated (${vitals.bloodPressureSys}/${vitals.bloodPressureDia} mmHg)`);
  } else if (vitals.bloodPressureSys > 0 && vitals.bloodPressureSys < 85) {
    isRed = true;
    reasons.push(`Hypotension risk: Systolic blood pressure is critically low (${vitals.bloodPressureSys} mmHg)`);
  } else if (vitals.bloodPressureSys >= 145 || (vitals.bloodPressureSys > 0 && vitals.bloodPressureSys < 95)) {
    isOrange = true;
    reasons.push(`Elevated or unstable blood pressure (${vitals.bloodPressureSys}/${vitals.bloodPressureDia} mmHg)`);
  }

  if (vitals.temperature >= 103.5) {
    isRed = true;
    reasons.push(`Critical hyperthermia: High fever (${vitals.temperature}°F)`);
  } else if (vitals.temperature >= 101.5) {
    isOrange = true;
    reasons.push(`Significant fever (${vitals.temperature}°F)`);
  } else if (vitals.temperature >= 99.8) {
    isYellow = true;
    reasons.push(`Mild elevated temperature (${vitals.temperature}°F)`);
  }

  // 3. Moderate/Urgent Symptoms
  if (symLower.includes('stomach pain')) {
    if (symLower.includes('vomiting') || vitals.temperature > 100.5) {
      isOrange = true;
      reasons.push('Acute abdominal discomfort with nausea or fever');
    } else {
      isYellow = true;
      reasons.push('Persistent abdominal pain');
    }
  }

  if (symLower.includes('dizziness')) {
    isYellow = true;
    reasons.push('Episode of dizziness or lightheadedness');
  }

  if (symLower.includes('vomiting') || symLower.includes('fever') || symLower.includes('cough')) {
    isYellow = true;
    if (!reasons.some(r => r.includes('temperature') || r.includes('fever'))) {
      reasons.push('General illness symptoms present (fever, cough, or vomiting)');
    }
  }

  // Department recommendation mapping
  let recommendedDepartment = 'General Medicine';

  if (symLower.includes('chest pain')) {
    recommendedDepartment = 'Cardiology';
  } else if (symLower.includes('breathing difficulty') || symLower.includes('cough')) {
    recommendedDepartment = 'Pulmonology';
  } else if (symLower.includes('head injury')) {
    recommendedDepartment = isRed ? 'Emergency & Trauma' : 'Neurology';
  } else if (symLower.includes('stomach pain') || symLower.includes('vomiting')) {
    recommendedDepartment = 'Gastroenterology';
  } else if (symLower.includes('dizziness') && vitals.bloodPressureSys > 150) {
    recommendedDepartment = 'Neurology';
  } else if (customLower.includes('skin') || customLower.includes('rash') || customLower.includes('allergy')) {
    recommendedDepartment = 'Dermatology';
  } else if (customLower.includes('bone') || customLower.includes('fracture') || customLower.includes('ankle') || customLower.includes('joint')) {
    recommendedDepartment = 'Orthopedics';
  } else if (isRed) {
    recommendedDepartment = 'Emergency & Trauma';
  }

  // Urgency Final Determination
  if (isRed) {
    immediateSteps.push('Alert on-duty Emergency Physician immediately');
    immediateSteps.push('Prepare Resuscitation / Trauma Bay or Cardiac Monitoring');
    immediateSteps.push('Provide continuous pulse oximetry and vital check');
    return {
      level: 'RED',
      title: 'RED – Emergency',
      description: 'Needs immediate medical attention.',
      recommendedDepartment,
      reasons: reasons.length > 0 ? reasons : ['Critical instability detected in patient assessment'],
      immediateSteps,
    };
  }

  if (isOrange) {
    immediateSteps.push('Place patient in priority urgent waiting zone');
    immediateSteps.push('Nurse evaluation within 10-15 minutes');
    immediateSteps.push('Repeat vitals every 30 minutes until doctor sees patient');
    return {
      level: 'ORANGE',
      title: 'ORANGE – Urgent',
      description: 'Needs medical attention soon.',
      recommendedDepartment,
      reasons: reasons.length > 0 ? reasons : ['Potentially unstable condition requiring prompt evaluation'],
      immediateSteps,
    };
  }

  if (isYellow) {
    immediateSteps.push('Direct patient to general consultation waiting area');
    immediateSteps.push('Estimated wait time: 30 to 45 minutes');
    immediateSteps.push('Instruct patient to notify reception if symptoms worsen');
    return {
      level: 'YELLOW',
      title: 'YELLOW – Moderate',
      description: 'Needs medical evaluation but is not immediately critical.',
      recommendedDepartment,
      reasons: reasons.length > 0 ? reasons : ['Moderate symptoms manageable within standard clinic flow'],
      immediateSteps,
    };
  }

  // Default GREEN
  immediateSteps.push('Patient is stable and placed in regular consultation queue');
  immediateSteps.push('Provide general information leaflet and hydration');
  return {
    level: 'GREEN',
    title: 'GREEN – Low Priority',
    description: 'Can wait for routine medical attention.',
    recommendedDepartment,
    reasons: reasons.length > 0 ? reasons : ['All checked vital signs are within normal healthy ranges and symptoms are mild'],
    immediateSteps,
  };
}
