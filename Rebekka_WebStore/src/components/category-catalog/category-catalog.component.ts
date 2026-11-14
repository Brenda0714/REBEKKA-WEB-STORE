import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { ShopService } from '../services/shop.service';

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
  gender?: 'mujer' | 'hombre'; // Para diferenciar género
  isNew?: boolean;             // Para marcar novedades
  onSale?: boolean;            // Para marcar rebajas
}

@Component({
  selector: 'app-category-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './category-catalog.component.html'
})
export class CategoryCatalogComponent implements OnInit {
  currentSection: string = 'mujer';
  selectedSubcategory: string = 'Todas';
  // Inyectar el servicio
  public shopService = inject(ShopService);

  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef); // Inyectamos el detector de cambios

// 1. Diccionario de subcategorías específicas para cada sección del Navbar
  subcategoriesMap: { [key: string]: string[] } = {
    mujer: ['Todas', 'Vestidos', 'Blusas', 'Pantalones', 'Shorts', 'Chaquetas', 'Joyeria', 'Calzado', 'Accesorios'],
    hombre: ['Todas', 'Camisas', 'Pantalones', 'Shorts', 'Chaquetas','Calzado', 'Accesorios'],
    novedades: ['Todas', 'Lo más nuevo', 'Ropa', 'Calzado', 'Joyeria', 'Accesorios'],
    rebajas: ['Todas', 'Liquidación 50%', 'Chaquetas', 'T-Shirts', 'Joyeria', 'Accesorios']
  };
// 2. Propiedad computada que devuelve las subcategorías según la sección actual
  get categories(): string[] {
    return this.subcategoriesMap[this.currentSection] || ['Todas', 'Chaquetas', 'Accesorios'];
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const catParam = params.get('category');
      if (catParam) {
        this.currentSection = catParam.toLowerCase();
        this.selectedSubcategory = 'Todas'; // Resetea la subcategoría al cambiar de sección principal
        this.cdr.detectChanges();
      }
    });
  }


  // Título capitalizado para mostrar en el Banner
  get selectedCategory(): string {
    return this.currentSection.charAt(0).toUpperCase() + this.currentSection.slice(1);
  }

// Rango de precio seleccionado (null para mostrar todos)
  selectedPriceRange: { min: number; max: number } | null = null;
  selectedPriceValue: string = '';

  // Método para actualizar el rango de precios desde el <select>
  onPriceChange(event: any): void {
    const value = event.target.value;
    this.selectedPriceValue = value;
    if (!value) {
      this.selectedPriceRange = null;
      return;
    }
    const [min, max] = value.split('-').map(Number);
    this.selectedPriceRange = { min, max: max || 999999 };
  }


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

// Lista de productos etiquetados para cada sección
  products: Product[] = [
    // Hombre
    { id: 1, title: 'Camisa formal negra', category: 'Camisas', price: 799.00, rating: 5, reviewsCount: 5, image: 'assets/img/ROPA/HOMBRE/CAMISAS/CAMISA2_1.avif', color: 'blue', size: 'L', gender: 'hombre', isNew: true },
    { id: 2, title: 'Pantalón caqui casual', category: 'Pantalones', price: 899.00, rating: 5, reviewsCount: 5, image: 'assets/img/ROPA/HOMBRE/PANTALONES/PANTALON1_1.jpg', color: 'orange', size: 'M', gender: 'hombre' },
    { id: 3, title: 'Jeans de mezclilla', category: 'Pantalones', price: 999.00, rating: 5, reviewsCount: 5, image: 'assets/img/ROPA/HOMBRE/PANTALONES/PANTALON2_1.avif', color: 'blue', size: 'L', gender: 'hombre', isNew: true },
    { id: 4, title: 'Camisa tipo polo', category: 'Camisas', price: 499.00, originalPrice: 899.00, rating: 5, reviewsCount: 21, image: 'assets/img/ROPA/HOMBRE/CAMISAS/CAMISA3_1.avif', color: 'black', size: 'S', gender: 'hombre', onSale: true },
    { id: 5, title: 'Pantalón casual gris', category: 'Pantalones', price: 599.00, originalPrice: 999.00, rating: 5, reviewsCount: 21, image: 'assets/img/ROPA/HOMBRE/PANTALONES/PANTALON3_1.avif', color: 'black', size: 'S', gender: 'hombre', onSale: true },
    { id: 6, title: 'Camisa casual de manga corta', category: 'Camisas', price: 699.00, rating: 5, reviewsCount: 5, image: 'assets/img/ROPA/HOMBRE/CAMISAS/CAMISA1_1.jpg', color: 'orange', size: 'M', gender: 'hombre' },

    // Mujer
    { id: 7, title: 'Pantalón casual de lino', category: 'Pantalones', price: 699.00, originalPrice: 1299.00, rating: 5, reviewsCount: 12, image: 'assets/img/ROPA/MUJER/PANTALONES/PANTALON3_1.jpg', color: 'blue', size: 'S', gender: 'mujer', onSale: true },
    { id: 8, title: 'Vestido veraniego elegante', category: 'Vestidos', price: 1199.00, rating: 5, reviewsCount: 5, image: 'assets/img/ROPA/MUJER/VESTIDOS/VESTIDO1_1.jpg', color: 'red', size: 'M', gender: 'mujer', isNew: true },
    { id: 9, title: 'Pantalón de vestir elegante', category: 'Pantalones', price: 899.00, rating: 5, reviewsCount: 8, image: 'assets/img/ROPA/MUJER/PANTALONES/PANTALON2_1.avif', color: 'black', size: 'L', gender: 'mujer' },
    { id: 10, title: 'Vestido largo de noche', category: 'Vestidos', price: 1499.00, rating: 5, reviewsCount: 8, image: 'assets/img/ROPA/MUJER/VESTIDOS/VESTIDO2_1.jpg', color: 'red', size: 'L', gender: 'mujer' },
    { id: 11, title: 'Vestido casual estampado', category: 'Vestidos', price: 799.00, originalPrice: 1399.00, rating: 5, reviewsCount: 12, image: 'assets/img/ROPA/MUJER/VESTIDOS/VESTIDO3_1.jpg', color: 'purple', size: 'S', gender: 'mujer', onSale: true },
    { id: 12, title: 'Pantalón tipo cargo moderno', category: 'Pantalones', price: 849.00, rating: 5, reviewsCount: 5, image: 'assets/img/ROPA/MUJER/PANTALONES/PANTALON1_1.jpg', color: 'green', size: 'M', gender: 'mujer', isNew: true },
    { id: 13, title: 'Blusa blanca formal', category: 'Blusas', price: 599.00, rating: 5, reviewsCount: 5, image: 'assets/img/ROPA/MUJER/BLUSAS/BLUSA1_1.jpg', color: 'white', size: 'M', gender: 'mujer', isNew: true },

    // Novedades (Productos marcados con isNew)
    { id: 14, title: 'Brand New Trend Outfit', category: 'Lo más nuevo', price: 110.00, rating: 5, reviewsCount: 3, image: 'assets/img/CATEGORIAS/IMG7.png', color: 'blue', size: 'M', isNew: true },
    { id: 15, title: 'New Arrival Sneakers', category: 'Calzado', price: 135.00, rating: 5, reviewsCount: 7, image: 'assets/img/CATEGORIAS/IMG8.png', color: 'black', size: 'L', isNew: true },

    // Rebajas (Productos con onSale o originalPrice)
    { id: 16, title: 'Clearance T-Shirt Sale', category: 'T-Shirts', price: 30.00, originalPrice: 70.00, rating: 4, reviewsCount: 15, image: 'assets/img/CATEGORIAS/IMG9.png', color: 'blue', size: 'S', onSale: true },
    { id: 17, title: 'Winter Jacket Liquidación', category: 'Chaquetas', price: 99.00, originalPrice: 200.00, rating: 5, reviewsCount: 20, image: 'assets/img/CATEGORIAS/IMG10.png', color: 'green', size: 'XL', onSale: true }
  ];

  currentPage: number = 1;

  // Gradiente dinámico para el banner según la sección seleccionada
  get bannerGradient(): string {
    switch (this.currentSection) {
      case 'hombre':
        return 'from-blue-900 via-blue-500 to-blue-100';
      case 'novedades':
        return 'from-zinc-900 via-neutral-500 to-zinc-100';
      case 'rebajas':
        return 'from-orange-900 via-orange-500 to-orange-100';
      default: // mujer
        return 'from-red-900 via-red-500 to-red-100';
    }
  }

// Filtrado avanzado de productos
  get filteredProducts(): Product[] {
    return this.products.filter(product => {
      let matchesSection = true;
      if (this.currentSection === 'mujer') {
        matchesSection = product.gender === 'mujer';
      } else if (this.currentSection === 'hombre') {
        matchesSection = product.gender === 'hombre';
      } else if (this.currentSection === 'novedades') {
        matchesSection = !!product.isNew;
      } else if (this.currentSection === 'rebajas') {
        matchesSection = !!product.onSale || !!product.originalPrice;
      }

      const matchesSubcategory = this.selectedSubcategory === 'Todas' || product.category === this.selectedSubcategory;
      const matchesColor = !this.selectedColor || product.color === this.selectedColor;
      const matchesSize = !this.selectedSize || product.size === this.selectedSize;
      // Filtro de precio en pesos mexicanos (MXN)
      let matchesPrice = true;
      if (this.selectedPriceRange) {
        matchesPrice = product.price >= this.selectedPriceRange.min && product.price <= this.selectedPriceRange.max;
      }

      return matchesSection && matchesSubcategory && matchesColor && matchesSize && matchesPrice;
    });
  }

  selectCategory(cat: string): void {
    this.selectedSubcategory = cat;
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
    this.selectedPriceRange = null;
    this.selectedPriceValue = ''; // Resetea el select visualmente
    this.selectedSubcategory = 'Todas';
  }

setPage(page: number): void {
    this.currentPage = page;
  }

  // Método para el botón de Favorito
  toggleFavorite(product: any, event: Event): void {
    event.stopPropagation(); // Evita que se active el enlace al detalle del producto
    this.shopService.toggleWishlist(product);
  }

// Método para el botón de Añadir al Carrito
  addToCart(product: any): void {
    this.shopService.addToCart(product);
  }

scrollCategories(element: HTMLElement, distance: number) {
    element.scrollBy({ left: distance, behavior: 'smooth' });
  }
}
