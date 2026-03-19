import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Service, ServiceService } from '../../../services/service.service';
import { AddModalsServicesComponent } from './modals-services.component/add-modals-services.component/add-modals-services.component';
import { EditModalsServicesComponent } from './modals-services.component/edit-modals-services.component/edit-modals-services.component';
import { DeleteModalsServicesComponent } from './modals-services.component/delete-modals-services.component/delete-modals-services.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AddModalsServicesComponent,
    EditModalsServicesComponent,
    DeleteModalsServicesComponent,
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
})
export class ServicesComponent implements OnInit {
  private serviceService = inject(ServiceService);
  private cdr = inject(ChangeDetectorRef);

  services: Service[] = [];
  searchTerm = '';
  statusFilter: 'all' | 'active' | 'inactive' = 'active';
  
  isLoading = false;
  isSaving = false;
  errorMessage = '';
  successMessage = '';

  showAddService = false;
  showEditService = false;
  showDeleteService = false;
  selectedService?: Service;

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.isLoading = true;
    this.cdr.detectChanges();
    
    this.serviceService.getAll().subscribe({
      next: (data) => {
        this.services = [...data];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Error al cargar los servicios';
        this.isLoading = false;
        this.services = [];
        this.cdr.detectChanges();
      }
    });
  }

  get filteredServices(): Service[] {
    return this.services
      .filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(this.searchTerm.toLowerCase());
        const isActive = s.active !== false;
        const matchesStatus = 
          this.statusFilter === 'all' ? true :
          this.statusFilter === 'active' ? isActive :
          !isActive;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const aActive = a.active !== false;
        const bActive = b.active !== false;
        if (aActive && !bActive) return -1;
        if (!aActive && bActive) return 1;
        return a.name.localeCompare(b.name);
      });
  }

  formatDuration(duration: any): string {
    if (!duration) return '00:00:00';
    if (typeof duration === 'string') return duration;
    
    if (typeof duration === 'object') {
      const h = duration.hours !== undefined ? duration.hours : (duration.hh || 0);
      const m = duration.minutes !== undefined ? duration.minutes : (duration.mm || 0);
      const s = duration.seconds !== undefined ? duration.seconds : (duration.ss || 0);
      
      const pad = (n: any) => String(n || 0).padStart(2, '0');
      return `${pad(h)}:${pad(m)}:${pad(s)}`;
    }
    return '00:00:00';
  }

  setStatusFilter(filter: 'all' | 'active' | 'inactive') {
    this.statusFilter = filter;
    this.cdr.detectChanges();
  }

  updateSearch(term: string) {
    this.searchTerm = term;
    this.cdr.detectChanges();
  }

  openNewService() {
    this.showAddService = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.cdr.detectChanges();
  }

  openEditService(service: Service) {
    this.selectedService = service;
    this.showEditService = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.cdr.detectChanges();
  }

  openDeleteService(service: Service) {
    this.selectedService = service;
    this.showDeleteService = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.cdr.detectChanges();
  }

  closeModal() {
    this.showAddService = false;
    this.showEditService = false;
    this.showDeleteService = false;
    this.selectedService = undefined;
    this.isSaving = false;
    this.cdr.detectChanges();
  }

  handleSave(service: Service) {
    this.isSaving = true;
    this.errorMessage = '';
    this.cdr.detectChanges();
    
    this.serviceService.createService(service).subscribe({
      next: () => {
        this.successMessage = 'Servicio creado exitosamente';
        this.cdr.detectChanges();
        setTimeout(() => {
          this.closeModal();
          this.loadServices();
        }, 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al crear el servicio';
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  handleUpdate(service: Service) {
    if (!this.selectedService?.concept_id) return;
    
    this.isSaving = true;
    this.errorMessage = '';
    this.cdr.detectChanges();
    
    this.serviceService.updateService(this.selectedService.concept_id, service).subscribe({
      next: () => {
        this.successMessage = 'Servicio actualizado exitosamente';
        this.cdr.detectChanges();
        setTimeout(() => {
          this.closeModal();
          this.loadServices();
        }, 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al actualizar el servicio';
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  handleDelete(id: number) {
    this.isSaving = true;
    this.errorMessage = '';
    this.cdr.detectChanges();
    
    this.serviceService.deleteService(id).subscribe({
      next: () => {
        this.successMessage = 'Servicio desactivado exitosamente';
        this.cdr.detectChanges();
        setTimeout(() => {
          this.closeModal();
          this.loadServices();
        }, 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al desactivar el servicio';
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }
}
