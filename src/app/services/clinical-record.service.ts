import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClinicalRecord } from '../models/clinical-record.model';

@Injectable({
  providedIn: 'root',
})
export class ClinicalRecordService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api-veterinary.onrender.com/clinical-record';

  getByPatient(patientId: number): Observable<ClinicalRecord[]> {
    return this.http.get<ClinicalRecord[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  getLatestByPatient(patientId: number): Observable<ClinicalRecord | null> {
    return this.http.get<ClinicalRecord | null>(`${this.apiUrl}/latest/${patientId}`);
  }

  create(record: Omit<ClinicalRecord, '_id' | 'createdAt' | 'updatedAt'>): Observable<ClinicalRecord> {
    return this.http.post<ClinicalRecord>(this.apiUrl, record);
  }

  update(id: string, record: Partial<ClinicalRecord>): Observable<ClinicalRecord> {
    return this.http.put<ClinicalRecord>(`${this.apiUrl}/${id}`, record);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
