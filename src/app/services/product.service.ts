import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/product';

  getAllAdmin(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/admin`);
  }

  getAllActive(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getCatalog(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/catalog`);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  addProduct(product: Product): Observable<any> {
    return this.http.post<any>(this.apiUrl, product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  activateProduct(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/activate`, {});
  }
}
