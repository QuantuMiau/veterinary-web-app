import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../../services/product.service';
import { AddInventoryModalComponent } from './modals/add-inventory-modal.component/add-inventory-modal.component';
import { EditInventoryModalComponent } from './modals/edit-inventory-modal.component/edit-inventory-modal.component';
import { DeleteInventoryModalComponent } from './modals/delete-inventory-modal.component/delete-inventory-modal.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    AddInventoryModalComponent,
    EditInventoryModalComponent,
    DeleteInventoryModalComponent,
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css',
})
export class InventoryComponent implements OnInit {
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);

  showAddItem = false;
  showEditItem = false;
  showDeleteItem = false;

  items: Product[] = [];
  statusFilter: 'all' | 'active' | 'inactive' = 'active';
  searchTerm = '';
  selectedItem?: Product;
  
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  isSaving = false;

  get filteredItems(): Product[] {
    let filtered = [...this.items];
    
    // 1. Filter by Search Term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (i) =>
          (i.name || '').toLowerCase().includes(term) ||
          (i.product_id || i.productId || '').toLowerCase().includes(term) ||
          (i.category || i.category_name || '').toLowerCase().includes(term) ||
          (i.description || '').toLowerCase().includes(term)
      );
    }

    // 2. Filter by Status
    if (this.statusFilter !== 'all') {
      const targetStatus = this.statusFilter === 'active';
      filtered = filtered.filter(i => (i.active !== false) === targetStatus);
    }
    
    // 3. Sort: Active first (true > false)
    return filtered.sort((a, b) => {
      const activeA = a.active !== false;
      const activeB = b.active !== false;
      if (activeA === activeB) return 0;
      return activeA ? -1 : 1;
    });
  }

  setStatusFilter(status: 'all' | 'active' | 'inactive') {
    this.statusFilter = status;
    this.cdr.detectChanges();
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getAllAdmin().subscribe({
      next: (res: any) => {
        this.items = Array.isArray(res) ? res : (res.data || res.productos || []);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.isLoading = false;
        this.errorMessage = 'No se pudieron cargar los productos';
        this.cdr.detectChanges();
      }
    });
  }

  updateSearch(term: string) {
    this.searchTerm = term;
    this.cdr.detectChanges();
  }

  openNewItem() {
    this.errorMessage = '';
    this.successMessage = '';
    this.showAddItem = true;
    this.cdr.detectChanges();
  }

  openEditItem(item: Product) {
    this.selectedItem = item;
    this.errorMessage = '';
    this.successMessage = '';
    this.showEditItem = true;
    this.cdr.detectChanges();
  }

  openDeleteItem(item: Product) {
    this.selectedItem = item;
    this.showDeleteItem = true;
    this.cdr.detectChanges();
  }

  closeModal() {
    this.showAddItem = false;
    this.showEditItem = false;
    this.showDeleteItem = false;
    this.selectedItem = undefined;
    this.errorMessage = '';
    this.successMessage = '';
    this.cdr.detectChanges();
    this.loadProducts();
  }

  private parseError(err: any): string {
    if (err.error) {
      if (typeof err.error === 'string') return err.error;
      if (err.error.message) return err.error.message;
    }
    return err.message || 'Error en el servidor';
  }

  addItem(productData: Product) {
    this.isSaving = true;
    this.errorMessage = '';
    this.cdr.detectChanges();
    this.productService.addProduct(productData).subscribe({
      next: (res) => {
        this.successMessage = res.message || 'Producto guardado exitosamente';
        this.cdr.detectChanges();
        setTimeout(() => this.closeModal(), 1500);
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = this.parseError(err);
        this.cdr.detectChanges();
      }
    });
  }

  updateItem(updatedItem: Product) {
    const id = updatedItem.concept_id || updatedItem.id;
    if (!id) return;

    this.isSaving = true;
    this.errorMessage = '';
    this.cdr.detectChanges();
    this.productService.updateProduct(id, updatedItem).subscribe({
      next: (res) => {
        this.successMessage = res.message || 'Producto actualizado exitosamente';
        this.cdr.detectChanges();
        setTimeout(() => this.closeModal(), 1500);
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = this.parseError(err);
        this.cdr.detectChanges();
      }
    });
  }

  deleteItem(id: number) {
    this.isSaving = true;
    this.cdr.detectChanges();
    this.productService.deleteProduct(id).subscribe({
      next: (res) => {
        this.successMessage = res.message || 'Producto desactivado exitosamente';
        this.cdr.detectChanges();
        setTimeout(() => this.closeModal(), 1500);
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = this.parseError(err);
        this.cdr.detectChanges();
      }
    });
  }
}
