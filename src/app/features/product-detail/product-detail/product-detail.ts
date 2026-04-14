import { Component, inject, signal, input, effect } from '@angular/core';
import { Location } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageModule } from 'primeng/message';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { Products } from '../../../core/services/products';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  imports: [
    FormsModule,
    ButtonModule,
    TagModule,
    SkeletonModule,
    MessageModule,
    RatingModule
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss'
})
export class ProductDetail {
  private productsService = inject(Products);
  private location = inject(Location);

  readonly id = input.required<string>();

  readonly product = signal<Product | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const currentId = Number(this.id());
      if (!isNaN(currentId)) {
        this.loadProduct(currentId);
      }
    });
  }

  private loadProduct(id: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.product.set(null);

    this.productsService.getProductById(id).subscribe({
      next: (data) => {
        this.product.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el producto.');
        this.loading.set(false);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src =
      'https://placehold.co/400x400?text=Sin+Imagen';
  }
}