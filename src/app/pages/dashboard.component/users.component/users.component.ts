import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddUserModalComponent } from './modals/add-user-modal.component/add-user-modal.component';
import { EditUserModalComponent } from './modals/edit-user-modal.component/edit-user-modal.component';
import { DeleteUserModalComponent } from './modals/delete-user-modal.component/delete-user-modal.component';
import { UserService, User } from '../../../services/user.service';

@Component({
  selector: 'app-users',
  imports: [FormsModule, AddUserModalComponent, EditUserModalComponent, DeleteUserModalComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  showAddUser = false;
  showEditUser = false;
  showDeleteUser = false;

  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';
  selectedUser?: User;
  errorMessage = '';
  successMessage = '';
  isSaving = false;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (response: any) => {
        const users = Array.isArray(response) ? response : (response.data || response.empleados || response);
        this.users = users;
        this.filteredUsers = [...users];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading users', err)
    });
  }

  openNewUser() {
    this.errorMessage = '';
    this.successMessage = '';
    this.showAddUser = true;
  }

  openEditUser(user: User) {
    this.selectedUser = user;
    this.errorMessage = '';
    this.successMessage = '';
    this.showEditUser = true;
  }

  openDeleteUser(user: User) {
    this.selectedUser = user;
    this.showDeleteUser = true;
  }

  closeModal() {
    this.showAddUser = false;
    this.showEditUser = false;
    this.showDeleteUser = false;
    this.selectedUser = undefined;
    this.errorMessage = '';
    this.successMessage = '';
    this.isSaving = false;
    this.loadUsers();
  }

  private parseError(err: any): string {
    if (err.error) {
      if (typeof err.error === 'string') return err.error;
      if (err.error.message) return err.error.message;
      if (err.error.error) return err.error.error;
    }
    return err.message || 'Error inesperado en el servidor';
  }

  addUser(userData: Omit<User, 'id'>) {
    this.errorMessage = '';
    this.successMessage = '';
    this.isSaving = true;
    
    this.userService.addUser(userData).subscribe({
      next: (res: any) => {
        this.successMessage = res.message || 'Usuario guardado exitosamente';
        this.isSaving = false;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.loadUsers();
          this.closeModal();
        }, 1500);
      },
      error: (err) => {
        console.error('Error adding user', err);
        this.isSaving = false;
        this.errorMessage = this.parseError(err);
        this.cdr.detectChanges();
      }
    });
  }

  updateUser(updatedUser: User) {
    this.errorMessage = '';
    this.successMessage = '';
    this.isSaving = true;

    this.userService.updateUser(updatedUser).subscribe({
      next: (res: any) => {
        this.successMessage = res.message || 'Usuario actualizado exitosamente';
        this.isSaving = false;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.loadUsers();
          this.closeModal();
        }, 1500);
      },
      error: (err) => {
        console.error('Error updating user', err);
        this.isSaving = false;
        this.errorMessage = this.parseError(err);
        this.cdr.detectChanges();
      }
    });
  }

  deleteUser(id: number) {
    this.errorMessage = '';
    this.successMessage = '';
    this.isSaving = true;

    this.userService.deleteUser(id).subscribe({
      next: (res: any) => {
        this.successMessage = res?.message || 'Usuario desactivado exitosamente';
        this.isSaving = false;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.loadUsers();
          this.closeModal();
        }, 1500);
      },
      error: (err) => {
        console.error('Error deleting user', err);
        this.isSaving = false;
        this.errorMessage = this.parseError(err);
        this.cdr.detectChanges();
      }
    });
  }

  searchUsers() {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      this.filteredUsers = [...this.users];
      return;
    }

    this.filteredUsers = this.users.filter(
      (u) =>
        (u.first_name || '').toLowerCase().includes(term) ||
        (u.last_name || '').toLowerCase().includes(term) ||
        (u.email || '').toLowerCase().includes(term) ||
        (u.role || '').toLowerCase().includes(term) ||
        (u.phone || '').includes(term),
    );
  }
}
