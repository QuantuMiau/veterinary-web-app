import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout, catchError, throwError } from 'rxjs';

export interface Order {
  full_name: string;
  order_id: number;
  date: string;
  total: string;
  order_status: string;
  image_url: string;
}

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
}
