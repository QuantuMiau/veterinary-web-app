import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavbarComponent} from '../../shared/navbar.component/navbar.component';

// Continuacion...
// Dentro del componente en el apartado de imports agregamos el componente se inicia siempre en mayus
// seleccionan con el autocompletado y listo jaja
@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    NavbarComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {

}
