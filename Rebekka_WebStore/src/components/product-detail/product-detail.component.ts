import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

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
export class ProductDetailComponent implements OnInit {
// Base de datos simulada de productos por ID (puedes adaptarla o conectarla a un servicio)
private productsDatabase: { [key: string]: any } = {
    // --- HOMBRE ---
    '1': {
      title: 'Camisa formal negra',
      price: 799.00,
      rating: 5,
      description: 'Camisa formal negra para hombre, diseñada para máxima comodidad y un estilo elegante y moderno.',
      images: [
        'assets/img/ROPA/HOMBRE/CAMISAS/CAMISA2_1.avif',
        'assets/img/ROPA/HOMBRE/CAMISAS/CAMISA2_2.avif',
        'assets/img/ROPA/HOMBRE/CAMISAS/CAMISA2_3.avif',
        'assets/img/ROPA/HOMBRE/CAMISAS/CAMISA2_4.avif',
      ]
    },
    '2': {
      title: 'Pantalón caqui casual',
      price: 899.00,
      rating: 5,
      description: 'Pantalón caqui casual de corte moderno, ideal para un look versátil y cómodo del día a día.',
      images: [
        'assets/img/ROPA/HOMBRE/PANTALONES/PANTALON1_1.jpg',
        'assets/img/ROPA/HOMBRE/PANTALONES/PANTALON1_2.jpg',
        'assets/img/ROPA/HOMBRE/PANTALONES/PANTALON1_3.jpg',
        'assets/img/ROPA/HOMBRE/PANTALONES/PANTALON1_4.jpg',
      ]
    },
    '3': {
      title: 'Jeans de mezclilla',
      price: 999.00,
      rating: 5,
      description: 'Jeans de mezclilla resistentes y de gran durabilidad, con ajuste perfecto para cualquier ocasión.',
      images: [
        'assets/img/ROPA/HOMBRE/PANTALONES/PANTALON2_1.avif',
        'assets/img/ROPA/HOMBRE/PANTALONES/PANTALON2_2.avif',
        'assets/img/ROPA/HOMBRE/PANTALONES/PANTALON2_3.avif',
        'assets/img/ROPA/HOMBRE/PANTALONES/PANTALON2_4.avif',
      ]
    },
    '4': {
      title: 'Camisa tipo polo',
      price: 499.00,
      originalPrice: 899.00,
      rating: 5,
      description: 'Camisa tipo polo clásica, suave al tacto, transpirable y perfecta para un estilo casual relajado.',
      images: [
        'assets/img/ROPA/HOMBRE/CAMISAS/CAMISA3_1.avif',
        'assets/img/ROPA/HOMBRE/CAMISAS/CAMISA3_2.avif',
        'assets/img/ROPA/HOMBRE/CAMISAS/CAMISA3_3.avif',
        'assets/img/ROPA/HOMBRE/CAMISAS/CAMISA3_4.avif',
      ]
    },
    '5': {
      title: 'Pantalón casual gris',
      price: 599.00,
      originalPrice: 999.00,
      rating: 5,
      description: 'Pantalón casual gris en oferta, cómodo, ligero y fácil de combinar con cualquier camisa o playera.',
      images: [
        'assets/img/ROPA/HOMBRE/PANTALONES/PANTALON3_1.avif',
        'assets/img/ROPA/HOMBRE/PANTALONES/PANTALON3_2.avif',
        'assets/img/ROPA/HOMBRE/PANTALONES/PANTALON3_3.avif',
        'assets/img/ROPA/HOMBRE/PANTALONES/PANTALON3_4.avif',
      ]
    },
    '6': {
      title: 'Camisa casual de manga corta',
      price: 699.00,
      rating: 5,
      description: 'Camisa casual de manga corta fresca y ligera, ideal para climas cálidos o días de descanso.',
      images: [
        'assets/img/ROPA/HOMBRE/CAMISAS/CAMISA1_1.jpg',
        'assets/img/ROPA/HOMBRE/CAMISAS/CAMISA1_2.jpg',
        'assets/img/ROPA/HOMBRE/CAMISAS/CAMISA1_3.jpg',
        'assets/img/ROPA/HOMBRE/CAMISAS/CAMISA1_4.jpg',
      ]
    },

    // --- MUJER ---

    '7': {
      title: 'Pantalón casual de lino',
      price: 699.00,
      originalPrice: 1299.00,
      rating: 5,
      description: 'Pantalón de lino ligero y transpirable, excelente opción en rebaja para un look fresco y chic.',
      images: [
        'assets/img/ROPA/MUJER/PANTALONES/PANTALON3_1.jpg',
        'assets/img/ROPA/MUJER/PANTALONES/PANTALON3_2.jpg',
        'assets/img/ROPA/MUJER/PANTALONES/PANTALON3_3.jpg',
        'assets/img/ROPA/MUJER/PANTALONES/PANTALON3_4.jpg',
      ]
    },

    '8': {
      title: 'Vestido veraniego elegante',
      price: 1199.00,
      rating: 5,
      description: 'Vestido veraniego con diseño elegante y fluido, ideal para eventos al aire libre y paseos.',
      images: [
        'assets/img/ROPA/MUJER/VESTIDOS/VESTIDO1_1.jpg',
        'assets/img/ROPA/MUJER/VESTIDOS/VESTIDO1_2.jpg',
        'assets/img/ROPA/MUJER/VESTIDOS/VESTIDO1_3.jpg',
        'assets/img/ROPA/MUJER/VESTIDOS/VESTIDO1_4.jpg',
      ]
    },

    '10': {
      title: 'Vestido largo de noche',
      price: 1499.00,
      rating: 5,
      description: 'Sofisticado vestido largo de noche diseñado para resaltar tu figura en ocasiones especiales.',
      images: [
        'assets/img/ROPA/MUJER/VESTIDOS/VESTIDO2_1.jpg',
        'assets/img/ROPA/MUJER/VESTIDOS/VESTIDO1_1.jpg'
      ]
    },
    '11': {
      title: 'Vestido casual estampado',
      price: 799.00,
      originalPrice: 1399.00,
      rating: 5,
      description: 'Hermoso vestido casual con estampado colorido, cómodo y fresco para usar todos los días.',
      images: [
        'assets/img/ROPA/MUJER/VESTIDOS/VESTIDO3_1.jpg',
        'assets/img/ROPA/MUJER/VESTIDOS/VESTIDO3_2.jpg',
        'assets/img/ROPA/MUJER/VESTIDOS/VESTIDO3_3.jpg',
        'assets/img/ROPA/MUJER/VESTIDOS/VESTIDO3_4.jpg',
      ]
    },
    '12': {
      title: 'Pantalón tipo cargo moderno',
      price: 849.00,
      rating: 5,
      description: 'Pantalón cargo moderno para mujer, con múltiples bolsillos y un estilo urbano muy actual.',
      images: [
        'assets/img/ROPA/MUJER/PANTALONES/PANTALON1_1.jpg',
        'assets/img/ROPA/MUJER/PANTALONES/PANTALON1_2.jpg',
        'assets/img/ROPA/MUJER/PANTALONES/PANTALON1_3.jpg',
        'assets/img/ROPA/MUJER/PANTALONES/PANTALON1_4.jpg',
      ]
    },
    '13': {
      title: 'Blusa blanca formal',
      price: 599.00,
      rating: 5,
      description: 'Blusa blanca formal y elegante, corte clásico indispensable para la oficina o juntas importantes.',
      images: [
        'assets/img/ROPA/MUJER/BLUSAS/BLUSA1_1.jpg',
        'assets/img/ROPA/MUJER/BLUSAS/BLUSA1_2.jpg',
        'assets/img/ROPA/MUJER/BLUSAS/BLUSA1_3.jpg',
        'assets/img/ROPA/MUJER/BLUSAS/BLUSA1_4.jpg',
      ]
    },

  };

  // Datos del producto actual
  product: any = {
    title: '',
    price: 0,
    rating: 5,
    description: '',
    images: []
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

  constructor(private route: ActivatedRoute) {} // <--- 2. Inyectar ActivatedRoute

  ngOnInit(): void {
    // 3. Escuchar los cambios en los parámetros de la URL para capturar el 'id'
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id');
      if (productId && this.productsDatabase[productId]) {
        this.product = this.productsDatabase[productId];
      } else {
        // Producto por defecto en caso de que no exista el ID
        this.product = this.productsDatabase['1'];
      }
      // Seleccionar la primera imagen por defecto del producto cargado
      if (this.product.images && this.product.images.length > 0) {
        this.selectedImage = this.product.images[0];
      }
    });
  }

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
