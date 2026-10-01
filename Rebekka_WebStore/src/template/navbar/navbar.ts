import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-navbar',
  imports: [Sidebar],
  template: '',
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  isMenuOpen = false;
  // Variables para simular el estado del carrito y favoritos
  cartCount = 2;       // Si es > 0, se mostrará el badge y el icono cambiará
  wishlistCount = 1;   // Si es > 0, se mostrará en rojo

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

}
