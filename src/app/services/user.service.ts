import { Injectable } from '@angular/core';

export interface User {
  id: number;
  name: string;
  role: string;
  email: string;
  phone?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private users: User[] = [
    {
      id: 1,
      name: 'Eurice Velázquez López',
      role: 'Admin',
      email: 'eurice@gmail',
      phone: '1234567890',
    },
    {
      id: 2,
      name: 'María Pérez',
      role: 'Empleado',
      email: 'maria@example.com',
      phone: '0987654321',
    },
  ];

  getUsers(): User[] {
    return this.users;
  }

  addUser(u: Omit<User, 'id'>) {
    const nextId = this.users.length ? Math.max(...this.users.map((x) => x.id)) + 1 : 1;
    const user: User = { id: nextId, ...u };
    this.users.push(user);
    return user;
  }

  updateUser(updated: User) {
    const idx = this.users.findIndex((x) => x.id === updated.id);
    if (idx !== -1) {
      this.users[idx] = updated;
      return true;
    }
    return false;
  }

  deleteUser(id: number) {
    const idx = this.users.findIndex((x) => x.id === id);
    if (idx !== -1) {
      this.users.splice(idx, 1);
      return true;
    }
    return false;
  }
}
