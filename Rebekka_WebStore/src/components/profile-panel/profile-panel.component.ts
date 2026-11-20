import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShopService, Product } from '../services/shop.service';

@Component({
  selector: 'app-profile-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-panel.component.html'
})
export class ProfilePanelComponent {
  public shopService = inject(ShopService);

  mode = signal<'login' | 'register'>('login');
  errorMsg = signal<string>('');
  editingId = signal<number | null>(null);
  activeTab = signal<'inventory' | 'orders'>('inventory');

  availableColors = ['Black', 'White', 'Red', 'Pink', 'Blue', 'Green', 'Yellow', 'Purple', 'Brown'];
  availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  subcategories = [
    'Vestidos',
    'Blusas',
    'Pantalones',
    'Shorts',
    'Chaquetas',
    'Joyeria',
    'Calzado',
    'Accesorios'
  ];

  customColorInput = '';
  imageUrlInput = '';

  loginForm = {
    email: '',
    password: ''
  };

  registerForm = {
    name: '',
    email: '',
    password: ''
  };

  productForm = {
    title: '',
    description: '',
    price: 0,
    stock: 1,
    category: 'mujer',
    subcategory: 'Vestidos',
    colors: ['Black'] as string[],
    sizes: ['S', 'M', 'L'] as string[],
    images: ['assets/img/ROPA/IMG1.png'] as string[]
  };

submitLogin(): void {
    this.errorMsg.set('');
    const res = this.shopService.login(this.loginForm.email, this.loginForm.password);
    if (!res.ok) {
      this.errorMsg.set(res.message);
    } else {
      this.loginForm = { email: '', password: '' };
    }
  }

  submitRegister(): void {
    this.errorMsg.set('');
    const res = this.shopService.register(
      this.registerForm.name,
      this.registerForm.email,
      this.registerForm.password,
      'admin'
    );
    if (!res.ok) {
      this.errorMsg.set(res.message);
    } else {
      this.registerForm = { name: '', email: '', password: '' };
    }
  }

  toggleColor(color: string): void {
    const idx = this.productForm.colors.indexOf(color);
    if (idx > -1) {
      if (this.productForm.colors.length > 1) {
        this.productForm.colors.splice(idx, 1);
      }
    } else {
      this.productForm.colors.push(color);
    }
  }

  addCustomColor(): void {
    const clean = this.customColorInput.trim();
    if (!clean) return;
    if (!this.productForm.colors.includes(clean)) {
      this.productForm.colors.push(clean);
      if (!this.availableColors.includes(clean)) {
        this.availableColors.push(clean);
      }
    }
    this.customColorInput = '';
  }

  toggleSize(size: string): void {
    const idx = this.productForm.sizes.indexOf(size);
    if (idx > -1) {
      if (this.productForm.sizes.length > 1) {
        this.productForm.sizes.splice(idx, 1);
      }
    } else {
      this.productForm.sizes.push(size);
    }
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const remainingSlots = 4 - this.productForm.images.length;
    if (remainingSlots <= 0) {
      this.errorMsg.set('Solo puedes cargar máximo 4 imágenes por prenda.');
      input.value = '';
      return;
    }

    const filesToRead = Array.from(input.files).slice(0, remainingSlots);
    filesToRead.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string' && this.productForm.images.length < 4) {
          this.productForm.images = [...this.productForm.images, reader.result];
        }
      };
      reader.readAsDataURL(file);
    });

    input.value = '';
  }

  addImageUrl(): void {
    const url = this.imageUrlInput.trim();
    if (!url) return;
    if (this.productForm.images.length >= 4) {
      this.errorMsg.set('Solo puedes cargar máximo 4 imágenes por prenda.');
      return;
    }
    this.productForm.images = [...this.productForm.images, url];
    this.imageUrlInput = '';
  }

  removeImage(index: number): void {
    this.productForm.images = this.productForm.images.filter((_, i) => i !== index);
  }

  startEdit(item: Product): void {
    this.errorMsg.set('');
    this.editingId.set(item.id);
    this.productForm = {
      title: item.title,
      description: item.description || '',
      price: item.price,
      stock: item.stock,
      category: item.category,
      subcategory: item.subcategory || 'Vestidos',
      colors: item.colors && item.colors.length > 0 ? [...item.colors] : [item.color || 'Black'],
      sizes: item.sizes && item.sizes.length > 0 ? [...item.sizes] : [item.size || 'M'],
      images: item.images && item.images.length > 0 ? [...item.images.slice(0, 4)] : [item.image]
    };
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.errorMsg.set('');
    this.resetProductForm();
  }

  saveInventoryItem(): void {
    this.errorMsg.set('');
    if (!this.productForm.title.trim() || this.productForm.price <= 0) {
      this.errorMsg.set('Ingresa un nombre válido y un precio mayor a 0.');
      return;
    }

    const imagesToSave = this.productForm.images.length > 0
      ? this.productForm.images.slice(0, 4)
      : ['assets/img/ROPA/IMG1.png'];

    const colorsToSave = this.productForm.colors.length > 0
      ? this.productForm.colors
      : ['Black'];

    const sizesToSave = this.productForm.sizes.length > 0
      ? this.productForm.sizes
      : ['M'];

    const currentEditId = this.editingId();

    if (currentEditId !== null) {
      const existing = this.shopService.products().find(p => p.id === currentEditId);
      this.shopService.updateProduct({
        id: currentEditId,
        title: this.productForm.title.trim(),
        description: this.productForm.description.trim(),
        price: Number(this.productForm.price),
        stock: Math.max(0, Number(this.productForm.stock)),
        category: this.productForm.category,
        subcategory: this.productForm.subcategory,
        image: imagesToSave[0],
        images: imagesToSave,
        color: colorsToSave[0],
        colors: colorsToSave,
        size: sizesToSave[0],
        sizes: sizesToSave,
        originalPrice: existing?.originalPrice,
        rating: existing?.rating ?? 5,
        reviewsCount: existing?.reviewsCount ?? 0
      });
      this.editingId.set(null);
    } else {
      this.shopService.addProduct({
        title: this.productForm.title.trim(),
        description: this.productForm.description.trim(),
        price: Number(this.productForm.price),
        stock: Math.max(0, Number(this.productForm.stock)),
        category: this.productForm.category,
        subcategory: this.productForm.subcategory,
        image: imagesToSave[0],
        images: imagesToSave,
        color: colorsToSave[0],
        colors: colorsToSave,
        size: sizesToSave[0],
        sizes: sizesToSave,
        rating: 5,
        reviewsCount: 0
      });
    }

    this.resetProductForm();
  }

  private resetProductForm(): void {
    this.productForm = {
      title: '',
      description: '',
      price: 0,
      stock: 1,
      category: 'mujer',
      subcategory: 'Vestidos',
      colors: ['Black'],
      sizes: ['S', 'M', 'L'],
      images: ['assets/img/ROPA/IMG1.png']
    };
  }
}
