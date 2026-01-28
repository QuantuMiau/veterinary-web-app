import { Component, EventEmitter, HostBinding, Output} from '@angular/core';
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

  @HostBinding('class.collapse-nav') get collapsed() {
    return this.isCollapsed;
  }

  /// se ocupa el constructor para inyectar el servicio router
  // asi poder usar las rutas de routerlink etc.
  constructor(private router: Router) {}


  // funcion del logout y se usa this para esta instancia / componente
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
