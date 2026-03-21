import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout, catchError, throwError } from 'rxjs';
import { Order, OrderDetail } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/order';

  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/all`).pipe(
      timeout(10000),
      catchError(err => throwError(() => err))
    );
  }

  getDetails(id: number): Observable<OrderDetail[]> {
    return this.http.get<OrderDetail[]>(`${this.apiUrl}/${id}`).pipe(
      timeout(10000),
      catchError(err => throwError(() => err))
    );
  }

  updateStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { orderStatus: status }).pipe(
      timeout(10000),
      catchError(err => throwError(() => err))
    );
  }
}
