import { Component, EventEmitter, Output} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isCollapsed = false;


  /// se ocupa el constructor para inyectar el servicio router
  constructor(private router: Router) {}

  // funcion del logout y se usa this para esta instancia/ componente
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
