import { Component, EventEmitter, HostBinding, inject, Output} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  // injection de servicio router para poder usar router y no tener que hacer constructores
  private router = inject(Router);

  isCollapsed = false;

  // host binding para detectar el cambio de cuando se collapsa
  @HostBinding('class.collapse-nav') get collapsed() {
    return this.isCollapsed;
  }

  // funcion del logout y se usa this para esta instancia / componente
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
