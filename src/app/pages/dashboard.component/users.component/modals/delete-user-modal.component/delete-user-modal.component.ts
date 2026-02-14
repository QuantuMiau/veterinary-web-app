import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-delete-user-modal',
  imports: [],
  templateUrl: './delete-user-modal.component.html',
  styleUrl: './delete-user-modal.component.css',
})
export class DeleteUserModalComponent {
  @Output() close = new EventEmitter<void>();

  @Output() confirmDelete = new EventEmitter<string>();

  constructor() {}

  confirm() {
    console.log("eliminado")
    this.close.emit();
  }

  cancel() {
    this.close.emit();
  }

}
