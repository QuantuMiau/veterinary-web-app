import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delete-inventory-modal',
  imports: [],
  templateUrl: './delete-inventory-modal.component.html',
  styleUrl: './delete-inventory-modal.component.css',
})
export class DeleteInventoryModalComponent {
  @Input() itemId?: number;
  @Output() close = new EventEmitter<void>();

  @Output() confirmDelete = new EventEmitter<number>();

  constructor() {}

  confirm() {
    this.confirmDelete.emit(this.itemId!);
    this.close.emit();
  }

  cancel() {
    this.close.emit();
  }
}
