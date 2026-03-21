import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrderService } from '../../../../services/order.service';
import { OrderDetail } from '../../../../models/order.model';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css',
})
export class OrderDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef);

  orderId: number = 0;
  details: OrderDetail[] = [];
  customerName: string = '';
  orderDate: string = '';
  orderStatus: string = '';
  paymentMethod: string = '';
  total: string = '0';
  isLoading = true;
  isSaving = false;
  errorMessage = '';

  statusOptions = ['En Progreso', 'Listo', 'Entregado', 'Cancelado'];

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.orderId = Number(params['id']);
      if (this.orderId) {
        this.loadDetails();
      }
    });
  }

  loadDetails() {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.orderService.getDetails(this.orderId).subscribe({
      next: (res: OrderDetail[]) => {
        console.log('Order Details Response:', res);
        this.details = res;
        if (res.length > 0) {
          const firstItem = res[0];
          this.orderStatus = firstItem.order_status;
          this.orderDate = firstItem.date;
          this.paymentMethod = firstItem.payment_method;
          this.total = firstItem.order_total;
          this.customerName = firstItem.full_name;
        }

        // Artificial delay for premium feel
        setTimeout(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }, 800);
      },
      error: (err: any) => {
        console.error('Error loading order details:', err);
        this.errorMessage = 'No se pudo cargar el detalle de la orden.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  updateStatus(newStatus: string) {
    if (this.isSaving || newStatus === this.orderStatus) return;

    this.isSaving = true;
    this.cdr.detectChanges();

    this.orderService.updateStatus(this.orderId, newStatus).subscribe({
      next: () => {
        this.orderStatus = newStatus;
        this.isSaving = false;
        this.cdr.detectChanges();
        // Optional: show a toast or success message
      },
      error: (err: any) => {
        console.error('Error updating status:', err);
        this.errorMessage = 'Error al actualizar el estado.';
        this.isSaving = false;
        this.cdr.detectChanges();
      },
    });
  }

  getStatusColor(status: string): string {
    const s = status?.toLowerCase() || '';
    if (s.includes('completa') || s.includes('entrega'))
      return 'bg-green-100 text-green-700 border-green-200';
    if (s.includes('proceso')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (s.includes('pendiente') || s.includes('listo'))
      return 'bg-amber-100 text-amber-700 border-amber-200';
    if (s.includes('cancela')) return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  }

  goBack() {
    this.router.navigate(['/admin/dashboard/ordenes']);
  }
}
