import { ChangeDetectionStrategy, Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { AddClientModalComponent } from './modals/add-client-modal.component/add-client-modal.component';
import { EditClientModalComponent } from './modals/edit-client-modal.component/edit-client-modal.component';

@Component({
  selector: 'app-clients.component',
  standalone: true,
  imports: [CommonModule, RouterModule, AddClientModalComponent, EditClientModalComponent],

  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsComponent implements OnInit {
  private clientService = inject(ClientService);
  private cdr = inject(ChangeDetectorRef);

  clients: Client[] = [];
  searchTerm: string = '';
  
  showAddClient = false;
  showEditClient = false;
  
  selectedClient: Client | null = null;
  
  isSaving = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  get filteredClients(): Client[] {
    if (!this.searchTerm.trim()) {
      return this.clients;
    }
    const t = this.searchTerm.toLowerCase();
    return this.clients.filter(c => 
      (c.first_name || '').toLowerCase().includes(t) ||
      (c.last_name || '').toLowerCase().includes(t) ||
      (c.phone || '').includes(t)
    );
  }

  updateSearch(term: string) {
    this.searchTerm = term;
    this.cdr.detectChanges();
  }

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.isLoading = true;
    this.cdr.detectChanges();
    this.clientService.getAll().subscribe({
      next: (res: any) => {
        this.clients = Array.isArray(res) ? res : (res.data || []);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading clients', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private parseError(err: any): string {
    if (err.error) {
      if (typeof err.error === 'string') return err.error;
      if (err.error.message) return err.error.message;
      if (err.error.error) return err.error.error;
    }
    return err.message || 'Error inesperado en el servidor';
  }

  openAddModal() {
    this.errorMessage = '';
    this.successMessage = '';
    this.showAddClient = true;
    this.cdr.detectChanges();
  }

  openEditModal(client: Client) {
    this.errorMessage = '';
    this.successMessage = '';
    this.selectedClient = client;
    this.showEditClient = true;
    this.cdr.detectChanges();
  }

  closeModal() {
    this.showAddClient = false;
    this.showEditClient = false;
    this.selectedClient = null;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();
  }

  addClient(clientData: Client) {
    this.errorMessage = '';
    this.successMessage = '';
    this.isSaving = true;
    
    this.clientService.newClient(clientData).subscribe({
      next: (res: any) => {
        this.successMessage = res.message || 'Cliente registrado exitosamente';
        this.isSaving = false;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.loadClients();
          this.closeModal();
        }, 1500);
      },
      error: (err) => {
        console.error('Error adding client', err);
        this.isSaving = false;
        this.errorMessage = this.parseError(err);
        this.cdr.detectChanges();
      }
    });
  }

  updateClient(updatedClient: Client) {
    this.errorMessage = '';
    this.successMessage = '';
    this.isSaving = true;

    const targetId = updatedClient.client_id;
    if (!targetId) {
      this.isSaving = false;
      this.errorMessage = 'ID de cliente no encontrado';
      return;
    }

    this.clientService.updateClient(targetId, updatedClient).subscribe({
      next: (res: any) => {
        this.successMessage = res.message || 'Cliente actualizado exitosamente';
        this.isSaving = false;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.loadClients();
          this.closeModal();
        }, 1500);
      },
      error: (err) => {
        console.error('Error updating client', err);
        this.isSaving = false;
        this.errorMessage = this.parseError(err);
        this.cdr.detectChanges();
      }
    });
  }
}
