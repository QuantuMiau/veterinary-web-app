import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  orders: Order[] = [];
  filteredOrders: Order[] = [];
  isLoading = true;
  searchTerm = '';
  currentFilter = 'todos';

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.orderService.getAll().subscribe({
      next: (res: any) => {
        // para cuando reciba datos cambie el estado del loader
        this.orders = Array.isArray(res) ? res : res.data || [];
        this.applyFilters();

        // Artificial delay of 1.5s as requested
        setTimeout(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }, 1500);
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        setTimeout(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }, 1500);
      },
    });
  }

  updateSearch(term: string) {
    this.searchTerm = term.toLowerCase();
    this.applyFilters();
  }

  setFilter(filter: string) {
    this.currentFilter = filter;
    this.applyFilters();
  }

  applyFilters() {
    let result = [...this.orders];

    // filters
    if (this.searchTerm) {
      result = result.filter(
        (order) =>
          order.full_name.toLowerCase().includes(this.searchTerm) ||
          order.order_id.toString().includes(this.searchTerm),
      );
    }

    //status
    if (this.currentFilter !== 'todos' && this.currentFilter !== 'recientes') {
      result = result.filter(
        (order) => order.order_status.toLowerCase() === this.currentFilter.toLowerCase(),
      );
    }

    //  recientes xd
    if (this.currentFilter === 'recientes') {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    this.filteredOrders = result;
  }

  viewDetails(orderId: number) {
    this.router.navigate(['/admin/dashboard/ordenes', orderId]);
  }

  getStatusColor(status: string): string {
    const s = status.toLowerCase();
    if (s.includes('completa') || s.includes('entrega'))
      return 'bg-green-100 text-green-700 border-green-200';
    if (s.includes('proceso')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (s.includes('pendiente') || s.includes('listo'))
      return 'bg-amber-100 text-amber-700 border-amber-200';
    if (s.includes('cancela')) return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}
