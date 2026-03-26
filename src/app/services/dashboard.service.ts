import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout, catchError, throwError } from 'rxjs';

export interface DashboardStats {
  species: { category: string; value: number }[];
  monthlySales: { category: string; value: number }[];
  sourceSales: { category: string; value: number }[];
  topProducts: { product: string; open: number; close: number; low: number; high: number }[];
  metrics: {
    todaySales: number;
    totalClients: number;
    totalPatients: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api-veterinary.onrender.com/dashboard/stats';

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(this.apiUrl).pipe(
      timeout(10000),
      catchError(err => throwError(() => err))
    );
  }
}
