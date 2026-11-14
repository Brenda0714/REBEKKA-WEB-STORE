import { Component, inject } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ShopService } from '../../components/services/shop.service';

@Component({
  selector: 'app-navbar',
  imports: [Sidebar, RouterLink, RouterLinkActive],
  template: '',
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  public shopService = inject(ShopService);
  isMenuOpen = false;

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
