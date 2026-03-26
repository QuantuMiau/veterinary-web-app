import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SaleService } from '../../../services/sale.service';
import { Sale } from '../../../models/sale.model';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css',
})
export class SalesComponent implements OnInit {
  private saleService = inject(SaleService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  sales: Sale[] = [];
  filteredSales: Sale[] = [];
  isLoading = true;
  searchTerm = '';
  currentFilter = 'todos';

  ngOnInit() {
    this.loadSales();
  }

  loadSales() {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.saleService.getAll().subscribe({
      next: (res: any) => {
        this.sales = Array.isArray(res) ? res : res.data || [];
        this.applyFilters();

        // Artificial delay matching existing patterns
        setTimeout(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }, 1200);
      },
      error: (err) => {
        console.error('Error loading sales:', err);
        setTimeout(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }, 1200);
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
    let result = [...this.sales];

    // Search by ID or Client Name
    if (this.searchTerm) {
      result = result.filter(
        (sale) =>
          (sale.employee_name?.toLowerCase().includes(this.searchTerm)) ||
          sale.sale_id.toString().includes(this.searchTerm)
      );
    }


    // Filter by payment method
    if (this.currentFilter !== 'todos' && this.currentFilter !== 'recientes') {
      result = result.filter(
        (sale) => sale.payment_method.toLowerCase() === this.currentFilter.toLowerCase()
      );
    }

    // Sort by date for "recientes"
    if (this.currentFilter === 'recientes') {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }


    this.filteredSales = result;
  }

  viewDetails(saleId: number) {
    this.router.navigate(['/admin/dashboard/ventas', saleId]);
  }

  getPaymentMethodColor(method: string): string {
    const m = method.toLowerCase();
    if (m === 'efectivo') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (m === 'stripe') return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    if (m === 'transferencia') return 'bg-sky-100 text-sky-700 border-sky-200';
    if (m === 'credito') return 'bg-orange-100 text-orange-700 border-orange-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}
