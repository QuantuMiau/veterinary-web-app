import { Component } from '@angular/core';
import {Service, ServiceService} from '../../../services/service.service';
import {
  AddModalsServicesComponent
} from './modals-services.component/add-modals-services.component/add-modals-services.component';
import {
  DeleteModalsServicesComponent
} from './modals-services.component/delete-modals-services.component/delete-modals-services.component';

@Component({
  selector: 'app-services',
  imports: [
    AddModalsServicesComponent,
    DeleteModalsServicesComponent
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
})
export class ServicesComponent {
  showAddService = false;
  showEditService = false;
  showDeleteService = false;

  services: Service[] = [];

  searchTerm = "";
  filteredServices: Service[] = [];

  constructor(private serviceService: ServiceService) {
    this.services = this.serviceService.getServices();
    this.filteredServices = [...this.services];
  }

  openNewService(){
    this.showAddService = true;
  }

  selectedService: Service | null = null;
  OpenEditService(service: Service) {
    this.selectedService = service;
    this.showEditService = true;
  }
  OpenDeleteService(service: Service) {
    this.selectedService = service;
    this.showDeleteService = true;
  }

  closeModal(){
    this.showDeleteService = false;
    this.showAddService = false;
    this.showEditService = false;

    this.services = this.serviceService.getServices();
    this.filteredServices = [...this.services];
  }

  confirmDelete(serviceId: number) {
    this.serviceService.deleteService(serviceId);
    this.closeModal();
  }


  searchService() {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      this.filteredServices = [...this.services];
      return;
    }

    this.filteredServices = this.services.filter(service =>
      service.name.toLowerCase().includes(term)
    );
  }

}
