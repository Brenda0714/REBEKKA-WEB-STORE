import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ColorOption {
  name: string;
  bgClass: string;
}

interface RelatedProduct {
  title: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent {
  // Datos del producto
  product = {
    title: 'Men Leather Jacket',
    price: 89.56,
    rating: 5,
    description: 'Shop cool t-shirts designed by hundreds of top artists and express who you are. 100% cotton for maximum comfort, printed individually for ultimate quality Super Soft 100% Cotton Direct-to-Fabric Technology Maximum Fit',
    images: [
      'assets/img/ROPA/IMG-PRODUCT1.png',
      'assets/img/ROPA/IMG-PRODUCT1.png',
      'assets/img/ROPA/IMG-PRODUCT1.png',
      'assets/img/ROPA/IMG-PRODUCT1.png'
    ]
  };

  // Estados interactivos
  selectedImage: string = this.product.images[0];
  selectedSize: string = 'M';
  quantity: number = 1;

  // Lista de colores
  colors: ColorOption[] = [
    { name: 'Red', bgClass: 'bg-red-500' },
    { name: 'Pink', bgClass: 'bg-pink-300' },
    { name: 'White', bgClass: 'bg-gray-200' },
    { name: 'Blue', bgClass: 'bg-indigo-900' },
    { name: 'Green', bgClass: 'bg-emerald-500' },
    { name: 'Yellow', bgClass: 'bg-amber-400' }
  ];
  selectedColor: ColorOption = this.colors[0];

  // Tallas disponibles
  sizes: string[] = ['S', 'M', 'L', 'XL', 'XXL'];

  // Estados de acordeones
  shippingOpen: boolean = false;
  faqOpen: boolean = false;

  // Productos relacionados
  relatedProducts: RelatedProduct[] = [
    { title: 'Men Blezer', price: 200.00, rating: 5, reviewsCount: 5, image: 'assets/img/ROPA/IMG1.png' },
    { title: 'Cotton T-shirt for men', price: 50.00, rating: 5, reviewsCount: 5, image: 'assets/img/ROPA/IMG2.png' },
    { title: 'Cotton T-shirt for men', price: 89.56, rating: 5, reviewsCount: 5, image: 'assets/img/ROPA/IMG3.png' },
    { title: 'Men T shirt', price: 89.56, rating: 5, reviewsCount: 5, image: 'assets/img/ROPA/IMG4.png' }
  ];

  selectImage(img: string): void {
    this.selectedImage = img;
  }

  selectColor(color: ColorOption): void {
    this.selectedColor = color;
  }

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  incrementQuantity(): void {
    this.quantity++;
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  toggleShipping(): void {
    this.shippingOpen = !this.shippingOpen;
  }

  toggleFaq(): void {
    this.faqOpen = !this.faqOpen;
  }

  addToCart(): void {
    console.log('Agregado al carrito:', {
      product: this.product.title,
      price: this.product.price,
      color: this.selectedColor.name,
      size: this.selectedSize,
      quantity: this.quantity
    });
  }

  viewAllRelated(): void {
    console.log('Ver todos los productos relacionados');
  }

}
