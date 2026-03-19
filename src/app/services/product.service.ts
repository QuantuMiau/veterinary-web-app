import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  concept_id?: number; // Primary Key
  id?: number; // Fallback
  product_id: string; // SKU / Código
  productId?: string; // Fallback
  name: string;
  description?: string;
  cost?: number | string;
  price: number | string;
  stock: number;
  category?: string;
  subcategory?: string;
  image_url?: string;
  imageUrl?: string; // Fallback
  active?: boolean;
  category_id?: number;
  subcategoryId?: number;
  // View fields
  category_name?: string;
  subcategory_name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/product';

  // Admin view (all products with cost)
  getAllAdmin(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/admin`);
  }

  // Active products with stock > 0
  getAllActive(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // Dashboard catalog (products and services)
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
    // The API expects 'id' in the path, which matches concept_id from the model
    return this.http.put<any>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  activateProduct(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/activate`, {});
  }
}
