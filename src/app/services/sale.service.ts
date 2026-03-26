import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout, catchError, throwError } from 'rxjs';
import { Sale, SaleDetailItem, CreateSaleRequest } from '../models/sale.model';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api-veterinary.onrender.com/sale';

  getAll(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.apiUrl).pipe(
      timeout(10000),
      catchError(err => throwError(() => err))
    );
  }

  getById(id: number): Observable<SaleDetailItem[]> {
    return this.http.get<SaleDetailItem[]>(`${this.apiUrl}/${id}`).pipe(
      timeout(10000),
      catchError(err => throwError(() => err))
    );
  }

  getByEmployee(employeeId: number): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.apiUrl}/employee/${employeeId}`).pipe(
      timeout(10000),
      catchError(err => throwError(() => err))
    );
  }

  getByClient(clientId: number): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.apiUrl}/client/${clientId}`).pipe(
      timeout(10000),
      catchError(err => throwError(() => err))
    );
  }


  newSale(saleData: CreateSaleRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, saleData).pipe(
      timeout(10000),
      catchError(err => throwError(() => err))
    );
  }
}
