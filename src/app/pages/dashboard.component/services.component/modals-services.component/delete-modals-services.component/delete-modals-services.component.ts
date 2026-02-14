import { Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-delete-modals-services',
  imports: [],
  templateUrl: './delete-modals-services.component.html',
  styleUrl: './delete-modals-services.component.css',
})
export class DeleteModalsServicesComponent {

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
