import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { modalContentAnimation, modalOverlayAnimation } from '../../../../../shared/animations';
import { Product } from '../../../../../models/product.model';

@Component({
  selector: 'app-delete-inventory-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-inventory-modal.component.html',
  styleUrl: './delete-inventory-modal.component.css',
  animations: [modalOverlayAnimation, modalContentAnimation]
})
export class DeleteInventoryModalComponent {
  @Input() item?: Product;
  @Input() itemId?: number; // Keep for backward compatibility if needed
  @Input() isSaving = false;
  @Input() errorMessage = '';
  @Input() successMessage = '';
  
  @Output() close = new EventEmitter<void>();
  @Output() confirmDelete = new EventEmitter<number>();

  confirm() {
    const id = this.itemId || (this.item ? this.item.concept_id : null);
    if (id) {
      this.confirmDelete.emit(id);
    }
  }
}
