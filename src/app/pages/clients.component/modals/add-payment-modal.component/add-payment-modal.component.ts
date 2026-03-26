import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Credit } from '../../../../models/credit.model';

@Component({
  selector: 'app-add-payment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        class="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl border border-white overflow-hidden animate-in zoom-in-95 duration-300"
        (click)="$event.stopPropagation()"
      >
        <!-- Header -->
        <div class="p-8 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="h-12 w-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 border border-orange-200">
              <i class="fa-solid fa-hand-holding-dollar text-xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-black text-slate-900">Registrar Abono</h2>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Ticket #{{ credit.sale_id }}</p>
            </div>
          </div>
          <button (click)="close.emit()" class="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <!-- Content -->
        <div class="p-8 space-y-6">
          <!-- Summary Card -->
          <div class="bg-orange-50/50 border border-orange-100 rounded-3xl p-5 flex items-center justify-between">
            <div>
              <p class="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Saldo Pendiente</p>
              <h3 class="text-2xl font-black text-orange-700 tracking-tighter">{{ credit.remaining | currency }}</h3>
            </div>
            <div class="text-right">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Monto Original</p>
              <p class="font-bold text-slate-600">{{ credit.original_balance | currency }}</p>
            </div>
          </div>

          <!-- Input -->
          <div class="space-y-2">
            <label class="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">¿Cuánto deseas abonar?</label>
            <div class="relative group">
              <div class="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-500 transition-colors font-black text-xl">$</div>
              <input 
                type="number" 
                [(ngModel)]="amount" 
                [max]="+credit.remaining"
                min="1"
                placeholder="0.00"
                class="w-full bg-slate-50 border border-slate-100 rounded-[2rem] py-4 pl-12 pr-6 text-2xl font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all placeholder:text-slate-200"
              >
            </div>
            @if (amount > +credit.remaining) {
              <p class="text-red-500 text-[10px] font-bold mt-2 ml-4 flex items-center gap-1">
                <i class="fa-solid fa-circle-exclamation"></i>
                El abono no puede superar el saldo pendiente.
              </p>
            }
          </div>

          @if (errorMessage) {
            <div class="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold animate-in bounce-in duration-300">
              <i class="fa-solid fa-triangle-exclamation text-base"></i>
              <span>{{ errorMessage }}</span>
            </div>
          }
        </div>

        <!-- Footer -->
        <div class="p-8 pt-0 flex gap-3">
          <button 
            (click)="close.emit()" 
            class="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
          >
            Cancelar
          </button>
          <button 
            (click)="confirm()" 
            [disabled]="isLoading || amount <= 0 || amount > +credit.remaining"
            class="flex-[2] py-4 bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-orange-600/20 hover:bg-orange-700 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
          >
            @if (isLoading) {
              <div class="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            } @else {
              <i class="fa-solid fa-check"></i>
            }
            Registrar Pago
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes bounce-in {
      0% { transform: scale(0.9); opacity: 0; }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); opacity: 1; }
    }
    .bounce-in { animation: bounce-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
  `]
})
export class AddPaymentModalComponent {
  @Input({ required: true }) credit!: Credit;
  @Input() isLoading = false;
  @Input() errorMessage = '';
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<number>();

  amount: number = 0;

  confirm() {
    if (this.amount > 0 && this.amount <= +this.credit.remaining) {
      this.save.emit(this.amount);
    }
  }
}
