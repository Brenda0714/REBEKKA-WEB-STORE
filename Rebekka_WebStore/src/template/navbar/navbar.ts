import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [Sidebar, RouterLink, RouterLinkActive],
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
// Si estás en la sección de Mujer, muestra estas opciones:
  categories: string[] = ['Chaquetas', 'Sombreros', 'Hombre', 'Mujer', 'T-Shirts', 'Joyeria', 'Accesorios'];
  selectedCategory: string = 'Mujer';

  selectCategory(cat: string): void {
    this.selectedCategory = cat;
  }
}
