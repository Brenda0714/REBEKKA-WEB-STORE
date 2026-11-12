import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Necesario para el binding de los inputs ([ngModel])
import { ShopifyCheckoutService, ShippingRate } from '../services/shopify-checkout.service';
import { MercadoPagoService } from '../services/mercado-pago.service';

interface OrderItem {
  name: string;
  color: string;
  size: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- Agregado FormsModule aquí
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent {
  private shopifyService = inject(ShopifyCheckoutService);
  private mpService = inject(MercadoPagoService);

  // Estado actual de los pasos: 'shipping' | 'payment' | 'confirmation'
  currentStep: 'shipping' | 'payment' | 'confirmation' = 'payment';

  // ID del carrito activo en Shopify (Reemplaza con tu lógica real de obtención de Carrito ID)
  cartId = 'gid://shopify/Cart/YOUR_CART_ID';

  // Objeto de dirección enlazado al formulario HTML con [(ngModel)]
  addressForm = {
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    country: 'México',
    postalCode: '',
    phone: '',
    email: ''
  };

  // Datos de tarjeta enlazados con [(ngModel)]
  cardForm = {
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    docType: 'INE',
    docNumber: ''
  };

  // Resumen del pedido
  orderSummary = {
    id: '#0297509',
    date: '03 MARCH 2021',
    time: '03 MARCH 2021',
    subtotal: 179.12
  };

  // Productos en el carrito
  items: OrderItem[] = [
    {
      name: 'Product 1',
      color: 'Yellow',
      size: 'L',
      price: 89.56,
      image: 'assets/img/ROPA/IMG1.png'
    },
    {
      name: 'Product 2',
      color: 'Blue',
      size: 'M',
      price: 89.56,
      image: 'assets/img/ROPA/IMG2.png'
    }
  ];

  // Estado con Signals de Angular para las tarifas de Shopify
  shippingRates = signal<ShippingRate[]>([]);
  isLoadingRates = signal<boolean>(false);
  selectedRate = signal<ShippingRate | null>(null);
  isProcessingPayment = signal<boolean>(false);

  // --- CÁLCULOS DINÁMICOS REACTIVOS ---

  get subtotal(): number {
    return this.items.reduce((acc, item) => acc + item.price, 0);
  }

  // Obtiene el costo de envío basado en la tarifa seleccionada de Shopify
  get shippingCost(): number {
    const rate = this.selectedRate();
    return rate ? parseFloat(rate.price.amount) : 0;
  }

  // Total final integrado con la API de Shopify
  calculateTotal(): number {
    return this.subtotal + this.shippingCost;
  }

  // --- MÉTODOS DE SHOPIFY API ---

  fetchShopifyShippingRates(): void {
    if (!this.addressForm.postalCode || !this.addressForm.city) {
      alert('Por favor ingresa al menos la ciudad y el código postal para calcular las tarifas.');
      return;
    }

    this.isLoadingRates.set(true);

    this.shopifyService.getShippingRates(this.cartId, this.addressForm).subscribe({
      next: (rates) => {
        this.shippingRates.set(rates);
        // Selecciona por defecto la primera tarifa si existe
        if (rates.length > 0) {
          this.selectedRate.set(rates[0]);
        }
        this.isLoadingRates.set(false);
      },
      error: (err) => {
        console.error('Error al obtener tarifas de Shopify:', err);
        this.isLoadingRates.set(false);
      }
    });
  }

  selectRate(rate: ShippingRate): void {
    this.selectedRate.set(rate);
  }

  // --- PROCESAMIENTO DE PAGO CON MERCADO PAGO ---
  async onPayment(): Promise<void> {
    try {
      this.isProcessingPayment.set(true);

      // 1. Separar la fecha de expiración "MM/YY" en mes y año
      const [month, yearShort] = this.cardForm.expiry.split('/');
      const fullYear = `20${yearShort}`;

      // 2. Tokenizar la tarjeta mediante el SDK de Mercado Pago
      const cardToken = await this.mpService.createCardToken({
        cardNumber: this.cardForm.number.replace(/\s+/g, ''),
        cardholderName: this.cardForm.name,
        cardExpirationMonth: month.trim(),
        cardExpirationYear: fullYear.trim(),
        securityCode: this.cardForm.cvv,
        identificationType: this.cardForm.docType,
        identificationNumber: this.cardForm.docNumber
      });

      console.log('Token de tarjeta generado con éxito:', cardToken.id);

      // 3. Enviar este token junto con el carrito y la orden a tu Backend (Node.js, PHP, etc.)
      // para que ejecute el cobro final en la API de pagos de Mercado Pago
      /*
      this.backendService.processPayment({
        token: cardToken.id,
        transactionAmount: this.calculateTotal(),
        email: this.addressForm.email,
        shippingDetails: this.addressForm,
        selectedShippingRate: this.selectedRate()
      }).subscribe(...)
      */

      alert('¡Pago procesado y token de Mercado Pago obtenido correctamente!');
      this.isProcessingPayment.set(false);

    } catch (error) {
      console.error('Error al generar el token de Mercado Pago:', error);
      alert('Ocurrió un error al procesar tu tarjeta. Verifica los datos.');
      this.isProcessingPayment.set(false);
    }
  }

  // --- ACCIONES DE USUARIO ---

  onCancel(): void {
    console.log('Checkout cancelado');
  }
}
