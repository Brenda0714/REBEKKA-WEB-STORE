import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export type UserRole = 'admin' | 'client';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Product {
id: number;
  title: string;
  description?: string;
  category: string;      // 'mujer' | 'hombre' | 'novedades' | 'rebajas'
  subcategory?: string;   // 'Vestidos' | 'Blusas' | 'Pantalones' | 'Shorts' | 'Chaquetas' | 'Joyeria' | 'Calzado' | 'Accesorios'
  price: number;
  originalPrice?: number;
  stock: number;
  rating: number;
  reviewsCount: number;
  image: string;          // Imagen principal (compatibilidad con catálogo y drawers)
  images?: string[];      // Hasta 4 imágenes para galería / product-detail
  color: string;          // Color principal / seleccionado
  colors?: string[];      // Lista de colores disponibles
  size: string;           // Talla principal / seleccionada
  sizes?: string[];       // Lista de tallas disponibles
  gender?: 'mujer' | 'hombre';
  isNew?: boolean;
  onSale?: boolean;
  quantity?: number;
}

export interface OrderItemSnapshot {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
  size?: string;
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  status: 'Pagado' | 'Enviado' | 'Entregado';
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: string;
  shippingMethod: string;
  shippingCost: number;
  subtotal: number;
  total: number;
  paymentTokenId?: string;
  items: OrderItemSnapshot[];
}

@Injectable({
  providedIn: 'root'
})
export class ShopService {

//TODO : VARIABLES ///////////////////////////////////////////////////////////////////////////////////////////
  private router = inject(Router);
  private readonly USERS_KEY = 'rebekka_users_v1';
  private readonly SESSION_KEY = 'rebekka_session_v1';
  private readonly PRODUCTS_KEY = 'rebekka_products_v2';
  private readonly ORDERS_KEY = 'rebekka_orders_v1';

  // Inventario inicial de ejemplo (se guarda en localStorage si se modifica)
  private initialProducts: Product[] = [
    {
      id: 1,
      title: 'Pantalón casual de lino',
      description: 'Pantalón fresco y ligero de lino con corte recto, ideal para uso diario y climas cálidos.',
      category: 'mujer',
      subcategory: 'Pantalones',
      price: 699.00,
      originalPrice: 1299.00,
      stock: 15,
      rating: 4.8,
      reviewsCount: 24,
      image: 'assets/img/ROPA/IMG1.png',
      images: ['assets/img/ROPA/IMG1.png'],
      color: 'Blue',
      colors: ['Blue', 'White'],
      size: 'M',
      sizes: ['S', 'M', 'L', 'XL'],
      gender: 'mujer',
      onSale: true
    },
    {
      id: 2,
      title: 'Vestido veraniego elegante',
      description: 'Vestido veraniego con diseño elegante y fluido, ideal para eventos al aire libre y paseos.',
      category: 'mujer',
      subcategory: 'Vestidos',
      price: 1199.00,
      stock: 10,
      rating: 5,
      reviewsCount: 18,
      image: 'assets/img/ROPA/IMG2.png',
      images: ['assets/img/ROPA/IMG2.png'],
      color: 'Red',
      colors: ['Red', 'Pink', 'White', 'Blue', 'Green', 'Yellow'],
      size: 'M',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      gender: 'mujer'
    },
    {
      id: 3,
      title: 'Jeans de mezclilla',
      description: 'Jeans clásicos de mezclilla resistente con ajuste cómodo y versátil.',
      category: 'novedades',
      subcategory: 'Pantalones',
      price: 999.00,
      stock: 20,
      rating: 4.7,
      reviewsCount: 31,
      image: 'assets/img/ROPA/IMG3.png',
      images: ['assets/img/ROPA/IMG3.png'],
      color: 'Blue',
      colors: ['Blue', 'Black'],
      size: 'L',
      sizes: ['S', 'M', 'L', 'XL'],
      isNew: true
    }
  ];

  products = signal<Product[]>(this.loadProducts());
  currentUser = signal<UserProfile | null>(this.loadSession());
  orders = signal<OrderRecord[]>(this.loadOrders());

  // Usamos Signals de Angular para reactividad moderna (también puedes usar BehaviorSubjects)
  private wishlist = signal<Product[]>([]);
  private cart = signal<Product[]>([]);

  // Control del panel lateral de Wishlist
  isWishlistOpen = signal<boolean>(false);
  isCartOpen = signal<boolean>(false); // <--- Control del panel de carrito
  isAuthModalOpen = signal<boolean>(false);
  toastMessage = signal<string | null>(null);

  // Banderas para controlar la animación temporal
  wishlistBounce = signal<boolean>(false);
  cartBounce = signal<boolean>(false);

  isAdmin = computed(() => this.currentUser()?.role === 'admin');
  isLoggedIn = computed(() => this.currentUser() !== null);
  //TODO : VARIABLES ///////////////////////////////////////////////////////////////////////////////////////////

  //TODO : GETTERS ///////////////////////////////////////////////////////////////////////////////////////////
  // Getters para Wishlist
  get wishlistItems() { return this.wishlist(); }
  get wishlistCount() { return this.wishlist().length; }

  // Getters para el Carrito
  get cartItems() { return this.cart(); }
  get cartCount() {
    return this.cart().reduce((acc, item) => acc + (item.quantity || 1), 0);
  }
  // Cálculo automático del Subtotal / Total del Carrito
  get cartSubtotal() {
    return this.cart().reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
  }
  //TODO : GETTERS ///////////////////////////////////////////////////////////////////////////////////////////



  // --- CARGA Y GUARDADO LOCAL (SIMULA BASE DE DATOS) ---
  private loadProducts(): Product[] {
    const saved = localStorage.getItem(this.PRODUCTS_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* fallback */ }
    }
    localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(this.initialProducts));
    return this.initialProducts;
  }

  private saveProducts(list: Product[]): void {
    this.products.set(list);
    localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(list));
  }

  private getRegisteredUsers(): (UserProfile & { password?: string })[] {
    const saved = localStorage.getItem(this.USERS_KEY);
    const defaults: (UserProfile & { password?: string })[] = [
      { id: 'u-admin', name: 'Admin Rebekka', email: 'admin@rebekka.mx', password: '123', role: 'admin' },
      { id: 'u-client', name: 'Cliente Demo', email: 'cliente@rebekka.mx', password: '123', role: 'client' }
    ];
    if (!saved) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(defaults));
      return defaults;
    }
    try { return JSON.parse(saved); } catch { return defaults; }
  }

  private loadSession(): UserProfile | null {
    const saved = localStorage.getItem(this.SESSION_KEY);
    if (!saved) return null;
    try { return JSON.parse(saved); } catch { return null; }
  }


  private loadOrders(): OrderRecord[] {
    const saved = localStorage.getItem(this.ORDERS_KEY);
    if (!saved) return [];
    try { return JSON.parse(saved); } catch { return []; }
  }

  private saveOrders(list: OrderRecord[]): void {
    this.orders.set(list);
    try {
      localStorage.setItem(this.ORDERS_KEY, JSON.stringify(list));
    } catch {
      this.showToast('Aviso: no se pudo guardar el historial de pedidos en localStorage.');
    }
  }

  //TODO : PEDIDOS ///////////////////////////////////////////////////////////////////////////////////////////
  createOrder(payload: {
    customerName: string;
    email: string;
    phone: string;
    shippingAddress: string;
    shippingMethod: string;
    shippingCost: number;
    paymentTokenId?: string;
  }): OrderRecord {
    const currentCart = this.cart();
    const items: OrderItemSnapshot[] = currentCart.map(item => ({
      id: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity || 1,
      image: item.image,
      color: item.color,
      size: item.size
    }));

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const total = subtotal + payload.shippingCost;
    const randomNum = Math.floor(100000 + Math.random() * 900000);

    const newOrder: OrderRecord = {
      id: `#ORD-${randomNum}`,
      createdAt: new Date().toLocaleString('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'Pagado',
      customerName: payload.customerName.trim() || 'Cliente',
      email: payload.email.trim() || 'sin-correo@rebekka.mx',
      phone: payload.phone.trim() || 'No especificado',
      shippingAddress: payload.shippingAddress.trim() || 'Dirección no especificada',
      shippingMethod: payload.shippingMethod || 'Estándar',
      shippingCost: payload.shippingCost,
      subtotal,
      total,
      paymentTokenId: payload.paymentTokenId,
      items
    };

    this.saveOrders([newOrder, ...this.orders()]);
    this.cart.set([]);
    this.showToast(`Pedido ${newOrder.id} registrado con éxito 🎉`);
    return newOrder;
  }

  updateOrderStatus(orderId: string, status: OrderRecord['status']): void {
    const updated = this.orders().map(ord =>
      ord.id === orderId ? { ...ord, status } : ord
    );
    this.saveOrders(updated);
    this.showToast(`Estado de ${orderId}: ${status}`);
  }
  //TODO : PEDIDOS ///////////////////////////////////////////////////////////////////////////////////////////

  //TODO : AUTENTICACIÓN Y ROLES ///////////////////////////////////////////////////////////////////////////////////////////
  // --- AUTENTICACIÓN Y ROLES ---
  openAuthModal(): void {
    this.isWishlistOpen.set(false);
    this.isCartOpen.set(false);
    this.isAuthModalOpen.set(true);
  }

  closeAuthModal(): void {
    this.isAuthModalOpen.set(false);
  }

  login(email: string, password: string): { ok: boolean; message: string } {
    const users = this.getRegisteredUsers();
    const found = users.find(
      u => u.email.trim().toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (!found) {
      return { ok: false, message: 'Correo o contraseña incorrectos.' };
    }

    const session: UserProfile = { id: found.id, name: found.name, email: found.email, role: found.role };
    this.currentUser.set(session);
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    this.showToast(`¡Bienvenida/o, ${session.name}! (${session.role === 'admin' ? 'Admin' : 'Cliente'})`);
    return { ok: true, message: 'Sesión iniciada' };
  }

  register(name: string, email: string, password: string, role: UserRole): { ok: boolean; message: string } {
    const users = this.getRegisteredUsers();
    const exists = users.some(u => u.email.trim().toLowerCase() === email.trim().toLowerCase());
    if (exists) {
      return { ok: false, message: 'Ese correo ya está registrado.' };
    }

    const newUser = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      password,
      role
    };

    const updated = [...users, newUser];
    localStorage.setItem(this.USERS_KEY, JSON.stringify(updated));

    const session: UserProfile = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
    this.currentUser.set(session);
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    this.showToast(`Cuenta creada como ${role === 'admin' ? 'Administrador' : 'Cliente'} ✨`);
    return { ok: true, message: 'Registro exitoso' };
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem(this.SESSION_KEY);
    this.showToast('Sesión cerrada');
  }
  //TODO : AUTENTICACIÓN Y ROLES ///////////////////////////////////////////////////////////////////////////////////////////

  //TODO : CRUD DE INVENTARIO (SOLO ADMIN) ///////////////////////////////////////////////////////////////////////////////////////////
  // --- CRUD DE INVENTARIO (SOLO ADMIN) ---
  addProduct(data: Omit<Product, 'id'>): void {
    if (!this.isAdmin()) return;
    const current = this.products();
    const nextId = current.length > 0 ? Math.max(...current.map(p => p.id)) + 1 : 1;
    const newItem: Product = {
      ...data,
      id: nextId,
      reviewsCount: data.reviewsCount ?? 0
    };
    this.saveProducts([newItem, ...current]);
    this.showToast('Prenda agregada al inventario ✅');
  }

  updateProduct(updatedProduct: Product): void {
    if (!this.isAdmin()) return;
    const list = this.products().map(p => p.id === updatedProduct.id ? { ...updatedProduct } : p);
    this.saveProducts(list);
    this.showToast('Inventario actualizado ✏️');
  }

  deleteProduct(productId: number): void {
    if (!this.isAdmin()) return;
    const list = this.products().filter(p => p.id !== productId);
    this.saveProducts(list);
    this.wishlist.set(this.wishlist().filter(p => p.id !== productId));
    this.cart.set(this.cart().filter(p => p.id !== productId));
    this.showToast('Prenda eliminada del inventario 🗑️');
  }
  //TODO : CRUD DE INVENTARIO (SOLO ADMIN) ///////////////////////////////////////////////////////////////////////////////////////////

  //TODO : NAVEGACIÓN, WISHLIST Y CARRITO ///////////////////////////////////////////////////////////////////////////////////////////
  // Métodos para abrir/cerrar drawers
  toggleWishlistDrawer(): void {
    this.isWishlistOpen.update(v => !v);
    if (this.isWishlistOpen()) {
      this.isCartOpen.set(false);
      this.isAuthModalOpen.set(false);
    }
  }

  toggleCartDrawer(): void {
    this.isCartOpen.update(v => !v);
    if (this.isCartOpen()) {
      this.isWishlistOpen.set(false);
      this.isAuthModalOpen.set(false);
    }
  }

  goToProductDetail(productId: number): void {
    this.isWishlistOpen.set(false);
    this.isCartOpen.set(false);
    this.isAuthModalOpen.set(false);
    this.router.navigate(['/product-detail', productId]);
  }

  // Ir a la página de Checkout
  proceedToCheckout(): void {
    this.isCartOpen.set(false);
    this.router.navigate(['/checkout']); // Asegúrate de tener esta ruta configurada en tus routes
  }

// --- Wishlist con animación de rebote temporal ---
  toggleWishlist(product: Product): void {
    const current = this.wishlist();
    const index = current.findIndex(item => item.id === product.id);
    if (index > -1) {
      this.wishlist.set(current.filter(item => item.id !== product.id));
      this.showToast('Eliminado de tu wishlist');
    } else {
      this.wishlist.set([...current, product]);
      this.showToast('¡Añadido a tu wishlist! ❤️');
      this.triggerWishlistBounce();
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
  addToCart(product: Product): void {
    const current = this.cart();
    const existingIndex = current.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
      const updated = [...current];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: (updated[existingIndex].quantity || 1) + 1
      };
      this.cart.set(updated);
    } else {
      this.cart.set([...current, { ...product, quantity: 1 }]);
    }
    this.showToast('¡Producto añadido al carrito! 🛒');
    this.triggerCartBounce();
  }



// Incrementar cantidad de un producto en el carrito
  increaseQuantity(product: Product): void {
    this.cart.set(this.cart().map(item =>
      item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
    ));
    this.triggerCartBounce();
  }

  // Decrementar cantidad o eliminar si llega a 1
  decreaseQuantity(product: Product): void {
    this.cart.set(
      this.cart()
        .map(item => item.id === product.id ? { ...item, quantity: (item.quantity || 1) - 1 } : item)
        .filter(item => (item.quantity || 0) > 0)
    );
  }

  removeFromCart(product: Product): void {
    this.cart.set(this.cart().filter(item => item.id !== product.id));
    this.showToast('Producto eliminado del carrito');
  }

  moveToCart(product: Product): void {
    this.addToCart(product);
    this.toggleWishlist(product);
  }
  private triggerCartBounce(): void {
    this.cartBounce.set(true);
    setTimeout(() => this.cartBounce.set(false), 600);
  }
  private showToast(message: string): void {
    this.toastMessage.set(message);
    setTimeout(() => {
      this.toastMessage.set(null);
    }, 3000);
  }
}
