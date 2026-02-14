import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  services: Service[] = [
    {
      id: 1,
      name: "Baño y corte",
      category: "Estetica",
      price: 412.12,
      duration: "3 horas"
    }
  ]

  addService(service: Service){
    this.services.push(service)
  }
  getServices(){
    return this.services;
  }

  deleteService(id: number) {
    const index = this.services.findIndex(p => p.id === id);
    if (index !== -1) {
      this.services.splice(index, 1);
    }
  }

  updateService(updateService: Service) {
    const index = this.services.findIndex(p => p.id === updateService.id);

    if (index !== -1) {
      this.services[index] = updateService;
    }
  }
}

export interface Service{
  id: number;
  name: string;
  category: string;
  price: number;
  duration: String;
}

