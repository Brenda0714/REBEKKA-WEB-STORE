import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  color: string;
  size: string;
}

@Component({
  selector: 'app-category-catalog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-catalog.component.html'
})
export class CategoryCatalogComponent {
  // Categorías disponibles
  categories: string[] = ['Chaquetas', 'Sombreros', 'Hombre', 'Mujer', 'T-Shirts', 'Joyeria', 'Accesorios'];
  selectedCategory: string = 'Mujer';

  // Opciones de colores de filtro
  colorFilters = [
    { name: 'black', bg: 'bg-black' },
    { name: 'white', bg: 'bg-white border border-gray-300' },
    { name: 'green', bg: 'bg-emerald-500' },
    { name: 'red', bg: 'bg-red-500' },
    { name: 'orange', bg: 'bg-amber-500' },
    { name: 'blue', bg: 'bg-blue-600' },
    { name: 'purple', bg: 'bg-purple-500' },
    { name: 'pink', bg: 'bg-pink-300' }
  ];
  selectedColor: string | null = null;

  // Tallas disponibles
  sizes: string[] = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  selectedSize: string | null = null;

  // Lista de productos simulados
  products: Product[] = [
    { id: 1, title: 'Cotton T-shirt for men', category: 'T-Shirts', price: 89.56, rating: 5, reviewsCount: 5, image: 'assets/img/CATEGORIAS/IMG1.png', color: 'white', size: 'M' },
    { id: 2, title: 'Men Leather Jacket', category: 'Jackets', price: 89.56, rating: 5, reviewsCount: 5, image: 'assets/img/CATEGORIAS/IMG2.png', color: 'orange', size: 'L' },
    { id: 3, title: 'Wood Sunglass', category: 'Watches', price: 25.56, originalPrice: 90.56, rating: 5, reviewsCount: 21, image: 'assets/img/CATEGORIAS/IMG3.png', color: 'black', size: 'S' },
    { id: 4, title: 'Small Travel Bag', category: 'Handbags', price: 89.56, rating: 5, reviewsCount: 5, image: 'assets/img/CATEGORIAS/IMG4.png', color: 'pink', size: 'M' },
    { id: 5, title: 'Cotton T-shirt for men', category: 'T-Shirts', price: 89.56, rating: 5, reviewsCount: 5, image: 'assets/img/CATEGORIAS/IMG5.png', color: 'blue', size: 'L' },
    { id: 6, title: 'Brand new loofer for men', category: 'Men', price: 25.56, originalPrice: 90.56, rating: 5, reviewsCount: 21, image: 'assets/img/CATEGORIAS/IMG6.png', color: 'white', size: 'XL' },
    { id: 7, title: 'Luxury watch for men', category: 'Watches', price: 89.56, rating: 5, reviewsCount: 5, image: 'assets/img/CATEGORIAS/IMG7.png', color: 'blue', size: 'M' },
    { id: 8, title: 'Cotton T-shirt for men', category: 'T-Shirts', price: 50.00, rating: 5, reviewsCount: 5, image: 'assets/img/CATEGORIAS/IMG8.png', color: 'orange', size: 'S' },
    { id: 9, title: 'Men T shirt', category: 'T-Shirts', price: 89.56, rating: 5, reviewsCount: 5, image: 'assets/img/CATEGORIAS/IMG9.png', color: 'blue', size: 'S' },
    { id: 10, title: 'Men Blezer', category: 'Jackets', price: 200.00, rating: 5, reviewsCount: 5, image: 'assets/img/CATEGORIAS/IMG10.png', color: 'green', size: 'XL' },
    { id: 11, title: 'Wood Sunglass', category: 'Watches', price: 25.56, originalPrice: 90.56, rating: 5, reviewsCount: 21, image: 'assets/img/CATEGORIAS/IMG11.png', color: 'black', size: 'M' },
    { id: 12, title: 'Small Travel Bag', category: 'Handbags', price: 89.56, rating: 5, reviewsCount: 5, image: 'assets/img/CATEGORIAS/IMG12.png', color: 'blue', size: 'L' }
  ];

  currentPage: number = 1;

  selectCategory(cat: string): void {
    this.selectedCategory = cat;
  }

  selectColorFilter(colorName: string): void {
    this.selectedColor = this.selectedColor === colorName ? null : colorName;
  }

  selectSizeFilter(size: string): void {
    this.selectedSize = this.selectedSize === size ? null : size;
  }

  clearAllFilters(): void {
    this.selectedColor = null;
    this.selectedSize = null;
  }

  setPage(page: number): void {
    this.currentPage = page;
  }

  addToCart(product: Product): void {
    console.log('Añadido al carrito:', product);
  }
}
