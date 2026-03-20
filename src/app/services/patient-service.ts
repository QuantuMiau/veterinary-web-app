import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Patient {
  id?: number;
  patientId?: number;
  patient_id?: number;
  name?: string;
  patient_name?: string;
  nombre?: string;
  color?: string;
  breed?: string;
  sex?: string;
  owner?: string;
  first_name?: string;
  last_name?: string;
  client_name?: string;
  species?: string;
  species_name?: string;
  lastVisit?: string;
  clientId?: number;
  speciesId?: number;
  client_id?: number;
  species_id?: number;
  // New API View fields
  paciente_nombre?: string;
  raza?: string;
  sexo?: string;
  especie?: string;
  dueno_nombre_completo?: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  // Latest API View fields (Direct)
  full_name?: string;
  phone?: string;
  address?: string;
  city?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/patient';

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl);
  }

  getPatientById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }

  getByClient(clientId: number): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}/client/${clientId}`);
  }

  addPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.apiUrl, patient);
  }

  updatePatient(id: number, patient: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/${id}`, patient);
  }

  deletePatient(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
