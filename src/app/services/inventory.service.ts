import { Injectable } from '@angular/core';

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  stock: number;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private items: InventoryItem[] = [
    {
      id: 1,
      name: 'Medicamento A',
      category: 'Medicamentos',
      subcategory: 'Antibióticos',
      stock: 50,
      price: 25.5,
    },
    {
      id: 2,
      name: 'Alimento Premium',
      category: 'Alimentos',
      subcategory: 'Perros',
      stock: 100,
      price: 45.0,
    },
  ];

  getItems(): InventoryItem[] {
    return this.items;
  }

  addItem(item: Omit<InventoryItem, 'id'>) {
    const nextId = this.items.length ? Math.max(...this.items.map((x) => x.id)) + 1 : 1;
    const newItem: InventoryItem = { id: nextId, ...item };
    this.items.push(newItem);
    return newItem;
  }

  updateItem(updated: InventoryItem) {
    const idx = this.items.findIndex((x) => x.id === updated.id);
    if (idx !== -1) {
      this.items[idx] = updated;
      return true;
    }
    return false;
  }

  deleteItem(id: number) {
    const idx = this.items.findIndex((x) => x.id === id);
    if (idx !== -1) {
      this.items.splice(idx, 1);
      return true;
    }
    return false;
  }
}
