import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-inventory-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-inventory-modal.component.html',
  styleUrl: './delete-inventory-modal.component.css',
})
export class DeleteInventoryModalComponent {
  @Input() item?: any;
  @Input() itemId?: number; // Keep for backward compatibility if needed
  @Input() isSaving = false;
  @Input() errorMessage = '';
  @Input() successMessage = '';
  
  @Output() close = new EventEmitter<void>();
  @Output() confirmDelete = new EventEmitter<number>();

  confirm() {
    const id = this.itemId || (this.item ? this.item.id : null);
    if (id) {
      this.confirmDelete.emit(id);
    }
  }
}
