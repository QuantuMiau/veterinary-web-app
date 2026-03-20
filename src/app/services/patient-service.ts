import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient, PatientDetailed } from '../models/patient.model';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/patient';

  getPatients(): Observable<PatientDetailed[]> {
    return this.http.get<PatientDetailed[]>(this.apiUrl);
  }

  getPatientById(id: number): Observable<PatientDetailed> {
    return this.http.get<PatientDetailed>(`${this.apiUrl}/${id}`);
  }

  getByClient(clientId: number): Observable<PatientDetailed[]> {
    return this.http.get<PatientDetailed[]>(`${this.apiUrl}/client/${clientId}`);
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
