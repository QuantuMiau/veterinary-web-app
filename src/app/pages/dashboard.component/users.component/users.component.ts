import { Component } from '@angular/core';
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
export class UsersComponent {
  showAddUser = false;
  showEditUser = false;
  showDeleteUser = false;

  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';
  selectedUser?: User;

  constructor(private userService: UserService) {
    this.users = this.userService.getUsers();
    this.filteredUsers = [...this.users];
  }

  openNewUser() {
    this.showAddUser = true;
  }

  openEditUser(user: User) {
    this.selectedUser = user;
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

    this.users = this.userService.getUsers();
    this.filteredUsers = [...this.users];
  }

  addUser(userData: Omit<User, 'id'>) {
    this.userService.addUser(userData);
    this.users = this.userService.getUsers();
    this.filteredUsers = [...this.users];
    this.closeModal();
  }

  updateUser(updatedUser: User) {
    this.userService.updateUser(updatedUser);
    this.users = this.userService.getUsers();
    this.filteredUsers = [...this.users];
    this.closeModal();
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id);
    this.users = this.userService.getUsers();
    this.filteredUsers = [...this.users];
    this.closeModal();
  }

  searchUsers() {
    const term = this.searchTerm.toLowerCase().trim();
    this.users = this.userService.getUsers();

    if (!term) {
      this.filteredUsers = [...this.users];
      return;
    }

    this.filteredUsers = this.users.filter(
      (u) =>
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        (u.role || '').toLowerCase().includes(term) ||
        (u.phone || '').includes(term),
    );
  }
}
