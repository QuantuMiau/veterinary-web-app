export interface ClinicalRecord {
  _id?: string;
  patientId: number;
  category: 'visita' | 'vacuna' | 'rx' | 'laboratorio';
  studyName: string;
  date: string; // YYYY-MM-DD
  results?: string;
  diagnosis?: string;
  notes?: string;
  fileUrl?: string | null;
  nextApplication?: string;
  brand?: string;
  batch?: string;
  createdAt?: string;
  updatedAt?: string;
}
