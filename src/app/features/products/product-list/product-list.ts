import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataViewModule } from 'primeng/dataview';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';
import { Products } from '../../../core/services/products';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  imports: [
    RouterLink,
    FormsModule,
    DataViewModule,
    InputTextModule,
    SelectModule,
    ButtonModule,
    SkeletonModule,
    MessageModule,
    TagModule
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList implements OnInit {
  private productsService = inject(Products);

  readonly products = signal<Product[]>([]);
  readonly categories = signal<{ label: string; value: string | null }[]>([
    { label: 'Todas las categorías', value: null }
  ]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly searchTerm = signal('');
  readonly selectedCategory = signal<string | null>(null);

  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const category = this.selectedCategory();

    return this.products().filter(product => {
      const matchesName = product.title.toLowerCase().includes(term);
      const matchesCategory = !category || product.category === category;
      return matchesName && matchesCategory;
    });
  });

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  private loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.productsService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los productos. Intenta más tarde.');
        this.loading.set(false);
      }
    });
  }

  private loadCategories(): void {
    this.productsService.getCategories().subscribe({
      next: (data) => {
        this.categories.set([
          { label: 'Todas las categorías', value: null },
          ...data.map(cat => ({ label: this.capitalize(cat), value: cat }))
        ]);
      }
    });
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src =
      'https://placehold.co/300x300?text=Sin+Imagen';
  }

  private capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}