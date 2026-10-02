import { Routes } from '@angular/router';
import { Home } from '../components/home/home';

export const routes: Routes = [
  // Ruta directa /home
  { path: 'home', component: Home },

  // Redirección de la raíz al home
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Opcional: comodín para rutas no encontradas
  { path: '**', redirectTo: 'home' }



];
