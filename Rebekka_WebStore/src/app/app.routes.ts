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

  // Ruta directa /category-catalog
  { path: 'category-catalog', component: CategoryCatalogComponent },

  // Redirección de la raíz al home
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Opcional: comodín para rutas no encontradas
  { path: '**', redirectTo: 'home' }



];
