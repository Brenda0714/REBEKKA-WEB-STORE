import { Routes } from '@angular/router';
import { Home } from '../components/home/home';
import { ProductDetailComponent } from '../components/product-detail/product-detail.component';
import { CheckoutComponent } from '../components/checkout/checkout.component';
import { CategoryCatalogComponent } from '../components/category-catalog/category-catalog.component';

export const routes: Routes = [
  // Ruta directa /home
  { path: 'home', component: Home },

  // Ruta directa /product-detail
  { path: 'product-detail', component: ProductDetailComponent },

  // Ruta directa /checkout
  { path: 'checkout', component: CheckoutComponent },

// Ruta dinámica para las categorías (ej: /category-catalog/mujer)
  { path: 'category-catalog/:category', component: CategoryCatalogComponent },

  // Una ruta por si entran sin especificar categoría (los manda a mujer o general)
  { path: 'category-catalog', redirectTo: 'category-catalog/mujer', pathMatch: 'full' },

  // Redirección de la raíz al home
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Opcional: comodín para rutas no encontradas
  { path: '**', redirectTo: 'home' }



];
