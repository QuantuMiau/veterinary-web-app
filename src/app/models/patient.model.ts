export interface BasePatient {
  name: string;
  breed: string;
  sex: string;
  color: string;
}

export interface Patient extends BasePatient {
  patient_id?: number;
  client_id?: number;
  species_id?: number;
}

export interface PatientDetailed extends Patient {
  species?: string;
  owner_name?: string;
  owner_phone?: string;
  full_name?: string;
  address?: string;
  city?: string;
  last_visit?: string;
}
