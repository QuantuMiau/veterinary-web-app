import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  employee_id?: number;
  name?: string;
  first_name?: string;
  last_name?: string;
  mother_name?: string;
  role?: string;
  email?: string;
  phone?: string;
  password?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/employee';

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  updateUser(user: User): Observable<User> {
    const targetId = user.employee_id;
    return this.http.put<User>(`${this.apiUrl}/update/${targetId}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  activateUser(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/active/${id}`, {});
  }
}
