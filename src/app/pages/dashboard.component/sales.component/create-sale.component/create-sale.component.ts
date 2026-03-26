import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SaleService } from '../../../../services/sale.service';
import { ClientService } from '../../../../services/client.service';
import { ProductService } from '../../../../services/product.service';
import { ServiceService } from '../../../../services/service.service';
import { Client } from '../../../../models/client.model';
import { Product } from '../../../../models/product.model';
import { Service } from '../../../../models/service.model';
import { CreateSaleRequest, SaleItem } from '../../../../models/sale.model';


@Component({
  selector: 'app-create-sale',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './create-sale.component.html',
  styleUrl: './create-sale.component.css',
})
export class CreateSaleComponent implements OnInit {
  private saleService = inject(SaleService);
  private clientService = inject(ClientService);
  private productService = inject(ProductService);
  private serviceService = inject(ServiceService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  // Data lists
  clients: Client[] = [];
  products: Product[] = [];
  services: Service[] = [];

  // Selections
  selectedClient: Client | null = null;
  cart: (SaleItem & { name: string })[] = [];
  paymentMethod: 'Efectivo' | 'Credito' = 'Efectivo';

  // UI State
  clientSearch = '';
  itemSearch = '';
  isSubmitting = false;
  isLoadingData = true;
  errorMessage = '';

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData() {
    this.isLoadingData = true;
    
    // Load clients, products, and services in parallel simplified
    this.clientService.getAll().subscribe((res: Client[]) => this.clients = res);
    this.productService.getAllActive().subscribe((res: Product[]) => this.products = res);
    this.serviceService.getAll().subscribe((res: Service[]) => {
      this.services = res;
      this.isLoadingData = false;
      this.cdr.detectChanges();
    });

  }

  get filteredClients() {
    if (!this.clientSearch) return [];
    const search = this.clientSearch.toLowerCase();
    return this.clients.filter(c => 
      `${c.first_name} ${c.last_name}`.toLowerCase().includes(search) || 
      c.client_id?.toString().includes(search)
    ).slice(0, 5);
  }

  get availableItems() {
    if (!this.itemSearch) return [];
    const search = this.itemSearch.toLowerCase();
    
    const matchedProducts = this.products.filter(p => 
      p.name.toLowerCase().includes(search) || p.product_id.toString().includes(search)
    ).map(p => ({ 
      concept_id: p.concept_id!, 
      name: p.name, 
      price: +p.price,
      type: 'Producto'
    }));

    const matchedServices = this.services.filter(s => 
      s.name.toLowerCase().includes(search)
    ).map(s => ({ 
      concept_id: s.concept_id!, 
      name: s.name, 
      price: +s.price,
      type: 'Servicio'
    }));

    return [...matchedProducts, ...matchedServices].slice(0, 8);
  }

  selectClient(client: Client) {
    this.selectedClient = client;
    this.clientSearch = '';
    this.cdr.detectChanges();
  }

  removeClient() {
    this.selectedClient = null;
    this.cdr.detectChanges();
  }

  addToCart(item: any) {
    const existing = this.cart.find(i => i.concept_id === item.concept_id);
    if (existing) {
      existing.quantity++;
    } else {
      this.cart.push({
        concept_id: item.concept_id,
        name: item.name,
        price: item.price,
        quantity: 1
      });
    }
    this.itemSearch = '';
    this.cdr.detectChanges();
  }

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
    this.cdr.detectChanges();
  }

  updateQuantity(index: number, delta: number) {
    const item = this.cart[index];
    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeFromCart(index);
    }
    this.cdr.detectChanges();
  }

  get total() {
    return this.cart.reduce((sum, item) => sum + (+item.price * item.quantity), 0);
  }

  setPaymentMethod(method: 'Efectivo' | 'Credito') {
    this.paymentMethod = method;
    if (method === 'Efectivo') {
      this.selectedClient = null;
      this.clientSearch = '';
    }
    this.cdr.detectChanges();
  }

  submitSale() {
    if (this.cart.length === 0) {
      this.errorMessage = 'El carrito está vacío.';
      return;
    }

    if (this.paymentMethod === 'Credito' && !this.selectedClient) {
      this.errorMessage = 'La venta a crédito requiere un cliente seleccionado.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    
    const request: CreateSaleRequest = {
      clientId: this.selectedClient?.client_id,
      paymentMethod: this.paymentMethod as any, // Cast for compatibility if model has more types
      items: this.cart.map(i => ({
        concept_id: i.concept_id,
        quantity: i.quantity,
        price: i.price
      }))
    };


    this.saleService.newSale(request).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/admin/dashboard/ventas']);
      },
      error: (err: any) => {
        console.error('Error creating sale:', err);
        this.errorMessage = 'No se pudo registrar la venta. Intenta de nuevo.';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }

    });
  }

  goBack() {
    this.router.navigate(['/admin/dashboard/ventas']);
  }
}
