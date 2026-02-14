import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InventoryService, InventoryItem } from '../../../services/inventory.service';
import { AddInventoryModalComponent } from './modals/add-inventory-modal.component/add-inventory-modal.component';
import { EditInventoryModalComponent } from './modals/edit-inventory-modal.component/edit-inventory-modal.component';
import { DeleteInventoryModalComponent } from './modals/delete-inventory-modal.component/delete-inventory-modal.component';

@Component({
  selector: 'app-inventory',
  imports: [
    FormsModule,
    AddInventoryModalComponent,
    EditInventoryModalComponent,
    DeleteInventoryModalComponent,
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css',
})
export class InventoryComponent {
  showAddItem = false;
  showEditItem = false;
  showDeleteItem = false;

  items: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];
  searchTerm = '';
  selectedItem?: InventoryItem;

  constructor(private inventoryService: InventoryService) {
    this.items = this.inventoryService.getItems();
    this.filteredItems = [...this.items];
  }

  openNewItem() {
    this.showAddItem = true;
  }

  openEditItem(item: InventoryItem) {
    this.selectedItem = item;
    this.showEditItem = true;
  }

  openDeleteItem(item: InventoryItem) {
    this.selectedItem = item;
    this.showDeleteItem = true;
  }

  closeModal() {
    this.showAddItem = false;
    this.showEditItem = false;
    this.showDeleteItem = false;
    this.selectedItem = undefined;

    this.items = this.inventoryService.getItems();
    this.filteredItems = [...this.items];
  }

  addItem(itemData: Omit<InventoryItem, 'id'>) {
    this.inventoryService.addItem(itemData);
    this.items = this.inventoryService.getItems();
    this.filteredItems = [...this.items];
    this.closeModal();
  }

  updateItem(updatedItem: InventoryItem) {
    this.inventoryService.updateItem(updatedItem);
    this.items = this.inventoryService.getItems();
    this.filteredItems = [...this.items];
    this.closeModal();
  }

  deleteItem(id: number) {
    this.inventoryService.deleteItem(id);
    this.items = this.inventoryService.getItems();
    this.filteredItems = [...this.items];
    this.closeModal();
  }

  searchItems() {
    const term = this.searchTerm.toLowerCase().trim();
    this.items = this.inventoryService.getItems();

    if (!term) {
      this.filteredItems = [...this.items];
      return;
    }

    this.filteredItems = this.items.filter(
      (i) =>
        i.name.toLowerCase().includes(term) ||
        i.category.toLowerCase().includes(term) ||
        i.subcategory.toLowerCase().includes(term),
    );
  }
}
