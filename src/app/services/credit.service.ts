import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout, catchError, throwError } from 'rxjs';
import { Credit, CreditPayment, AddPaymentRequest } from '../models/credit.model';

@Injectable({
  providedIn: 'root'
})
export class CreditService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api-veterinary.onrender.com/credit';

  getAll(): Observable<Credit[]> {
    return this.http.get<Credit[]>(this.apiUrl).pipe(
      timeout(10000),
      catchError(err => throwError(() => err))
    );
  }

  getPending(): Observable<Credit[]> {
    return this.http.get<Credit[]>(`${this.apiUrl}/pending`).pipe(
      timeout(10000),
      catchError(err => throwError(() => err))
    );
  }

  getByClient(clientId: number): Observable<Credit[]> {
    return this.http.get<Credit[]>(`${this.apiUrl}/client/${clientId}`).pipe(
      timeout(10000),
      catchError(err => throwError(() => err))
    );
  }

  getDetail(id: number): Observable<CreditPayment[]> {
    return this.http.get<CreditPayment[]>(`${this.apiUrl}/${id}`).pipe(
      timeout(10000),
      catchError(err => throwError(() => err))
    );
  }

  addPayment(id: number, paymentData: AddPaymentRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/payment`, paymentData).pipe(
      timeout(10000),
      catchError(err => throwError(() => err))
    );
  }
}
