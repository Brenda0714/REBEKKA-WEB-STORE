import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private router = inject(Router);
  // Usamos Signals de Angular para reactividad moderna (también puedes usar BehaviorSubjects)
  private wishlist = signal<any[]>([]);
  private cart = signal<any[]>([]);

  // Control del panel lateral de Wishlist
  isWishlistOpen = signal<boolean>(false);
  isCartOpen = signal<boolean>(false); // <--- Control del panel de carrito
  // Señal para la notificación (toast)
  toastMessage = signal<string | null>(null);

  // Banderas para controlar la animación temporal
  wishlistBounce = signal<boolean>(false);
  cartBounce = signal<boolean>(false);

// Getters para Wishlist
  get wishlistItems() {
    return this.wishlist();
  }
  get wishlistCount() {
    return this.wishlist().length;
  }

  // Getters para el Carrito
  get cartItems() {
    return this.cart();
  }
  get cartCount() {
    return this.cart().length;
  }

  // Cálculo automático del Subtotal / Total del Carrito
  get cartSubtotal() {
    return this.cart().reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
  }

  // Métodos para abrir/cerrar drawers
  toggleWishlistDrawer(): void {
    this.isWishlistOpen.update(value => !value);
    if (this.isWishlistOpen()) this.isCartOpen.set(false); // Cierra el otro si se abre este
  }

  toggleCartDrawer(): void {
    this.isCartOpen.update(value => !value);
    if (this.isCartOpen()) this.isWishlistOpen.set(false); // Cierra el otro si se abre este
  }

  goToProductDetail(productId: number): void {
    this.isWishlistOpen.set(false); // Cierra el drawer
    this.router.navigate(['/product-detail', productId]); // Navega a la ruta dinámica
  }

  // Ir a la página de Checkout
  proceedToCheckout(): void {
    this.isCartOpen.set(false);
    this.router.navigate(['/checkout']); // Asegúrate de tener esta ruta configurada en tus routes
  }

// --- Wishlist con animación de rebote temporal ---
  toggleWishlist(product: any): void {
    const currentWishlist = this.wishlist();
    const index = currentWishlist.findIndex(item => item.id === product.id);

    if (index > -1) {
      this.wishlist.set(currentWishlist.filter(item => item.id !== product.id));
      this.showToast('Eliminado de tu wishlist');
    } else {
      this.wishlist.set([...currentWishlist, product]);
      this.showToast('¡Añadido a tu wishlist! ❤️');
      this.triggerWishlistBounce(); // Activa animación
    }
  }

  private triggerWishlistBounce(): void {
    this.wishlistBounce.set(true);
    setTimeout(() => this.wishlistBounce.set(false), 600); // Dura lo que un ciclo de rebote
  }

  // Verificar si un producto es favorito
  isFavorite(productId: number): boolean {
    return this.wishlist().some(item => item.id === productId);
  }

  // --- Carrito con animación de rebote temporal ---
  addToCart(product: any): void {
    const currentCart = this.cart();
    const existingIndex = currentCart.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
      const updatedCart = [...currentCart];
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        quantity: (updatedCart[existingIndex].quantity || 1) + 1
      };
      this.cart.set(updatedCart);
    } else {
      this.cart.set([...currentCart, { ...product, quantity: 1 }]);
    }

    this.showToast('¡Producto añadido al carrito! 🛒');
    this.triggerCartBounce(); // Activa animación
  }

  private triggerCartBounce(): void {
    this.cartBounce.set(true);
    setTimeout(() => this.cartBounce.set(false), 600);
  }

// Incrementar cantidad de un producto en el carrito
  increaseQuantity(product: any): void {
    const currentCart = this.cart();
    this.cart.set(currentCart.map(item => {
      if (item.id === product.id) {
        return { ...item, quantity: (item.quantity || 1) + 1 };
      }
      return item;
    }));
  }

  // Decrementar cantidad o eliminar si llega a 1
  decreaseQuantity(product: any): void {
    const currentCart = this.cart();
    this.cart.set(currentCart.map(item => {
      if (item.id === product.id && (item.quantity || 1) > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    }).filter(item => item.quantity > 0));
  }

  removeFromCart(product: any): void {
    const currentCart = this.cart();
    this.cart.set(currentCart.filter(item => item.id !== product.id));
    this.showToast('Producto eliminado del carrito');
  }

  moveToCart(product: any): void {
    this.addToCart(product);
    this.toggleWishlist(product);
  }

  private showToast(message: string): void {
    this.toastMessage.set(message);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3000);
  }
}
