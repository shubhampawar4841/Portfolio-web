// Disease to Specialty Mapping
export const DISEASE_TO_SPECIALTY: Record<string, string[]> = {
  "chest pain": ["CARDIOLOGY"],
  "heart pain": ["CARDIOLOGY"],
  "heart attack": ["CARDIOLOGY"],
  "cardiac": ["CARDIOLOGY"],
  "heart": ["CARDIOLOGY"],
  "stroke": ["NEUROLOGY"],
  "severe headache": ["NEUROLOGY"],
  "migraine": ["NEUROLOGY"],
  "neurological": ["NEUROLOGY"],
  "brain": ["NEUROLOGY"],
  "fracture": ["ORTHOPEDICS"],
  "bone pain": ["ORTHOPEDICS"],
  "joint pain": ["ORTHOPEDICS"],
  "orthopedic": ["ORTHOPEDICS"],
  "asthma": ["PULMONOLOGY"],
  "breathing issue": ["PULMONOLOGY"],
  "breathing problem": ["PULMONOLOGY"],
  "lung": ["PULMONOLOGY"],
  "respiratory": ["PULMONOLOGY"],
  "fever": ["GENERAL MEDICINE"],
  "vomiting": ["GENERAL MEDICINE"],
  "diarrhea": ["GENERAL MEDICINE"],
  "general": ["GENERAL MEDICINE"],
  "pregnancy": ["GYNECOLOGY"],
  "period pain": ["GYNECOLOGY"],
  "gynecological": ["GYNECOLOGY"],
  "women health": ["GYNECOLOGY"],
  "child illness": ["PEDIATRICS"],
  "pediatric": ["PEDIATRICS"],
  "children": ["PEDIATRICS"],
  "cancer": ["ONCOLOGY"],
  "oncology": ["ONCOLOGY"],
  "tumor": ["ONCOLOGY"],
  "diabetes": ["ENDOCRINOLOGY"],
  "thyroid": ["ENDOCRINOLOGY"],
  "eye": ["OPHTHALMOLOGY"],
  "vision": ["OPHTHALMOLOGY"],
  "ear": ["ENT"],
  "nose": ["ENT"],
  "throat": ["ENT"],
  "skin": ["DERMATOLOGY"],
  "dermatology": ["DERMATOLOGY"],
  "kidney": ["NEPHROLOGY"],
  "dialysis": ["NEPHROLOGY"],
  "mental health": ["PSYCHIATRY"],
  "psychiatry": ["PSYCHIATRY"],
  "depression": ["PSYCHIATRY"],
  "surgery": ["GENERAL SURGERY"],
  "appendicitis": ["GENERAL SURGERY"],
  "hernia": ["GENERAL SURGERY"],
}

// All available specialties
export const SPECIALTIES = [
  "CARDIOLOGY",
  "NEUROLOGY",
  "ORTHOPEDICS",
  "PULMONOLOGY",
  "GENERAL MEDICINE",
  "GYNECOLOGY",
  "PEDIATRICS",
  "ONCOLOGY",
  "ENDOCRINOLOGY",
  "OPHTHALMOLOGY",
  "ENT",
  "DERMATOLOGY",
  "NEPHROLOGY",
  "PSYCHIATRY",
  "GENERAL SURGERY",
  "UROLOGY",
  "GASTROENTEROLOGY",
  "RADIOLOGY",
  "ANESTHESIOLOGY",
  "PATHOLOGY",
]

// Get specialty from disease/symptom search
export function getSpecialtyFromDisease(disease: string): string[] {
  const lowerDisease = disease.toLowerCase().trim()
  
  // Direct match
  if (DISEASE_TO_SPECIALTY[lowerDisease]) {
    return DISEASE_TO_SPECIALTY[lowerDisease]
  }
  
  // Partial match
  for (const [key, specialties] of Object.entries(DISEASE_TO_SPECIALTY)) {
    if (lowerDisease.includes(key) || key.includes(lowerDisease)) {
      return specialties
    }
  }
  
  // Default to General Medicine if no match
  return ["GENERAL MEDICINE"]
}



