import { Component } from '@angular/core';
import { NgForOf } from '@angular/common';

type NavItem = {
  href: string;
  label: string;
};

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgForOf],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  protected readonly navItems: NavItem[] = [
    { href: '#carro-idk', label: 'Inicio' },
    { href: '#info-idk', label: 'Nosotros' },
    { href: '#services-idk', label: 'Servicios' },
    { href: '#gallery-idk', label: 'Galería' },
    { href: '#contact-idk', label: 'Contacto' },
  ];
}

