import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Service {
  concept_id?: number; // Primary Key
  id?: number; // Fallback
  name: string;
  cost?: number | string;
  price: number | string;
  duration: string; // HH:MM:SS
  active?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/service';

  // List all services
  getAll(): Observable<Service[]> {
    return this.http.get<Service[]>(this.apiUrl);
  }

  // Create new service
  createService(service: Service): Observable<any> {
    return this.http.post<any>(this.apiUrl, service);
  }

  // Update existing service
  updateService(id: number, service: Partial<Service>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, service);
  }

  // Soft delete service
  deleteService(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Reactivate service
  activateService(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/activate`, {});
  }
}
