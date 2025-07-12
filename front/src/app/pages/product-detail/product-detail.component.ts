import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { NotificationService } from '../../services/notification.service'; // Importar

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: any = null;
  mainImageUrl: string = '';
  selectedVariation: any = null;
  notification: { message: string, type: 'success' | 'error' } | null = null;

  backendUrl = 'http://localhost:3000'; // cambia si estás en producción

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private notificationService: NotificationService // Inyectar
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) return this.productService.getProductById(id);
        return of(null);
      })
    ).subscribe({
      next: (data) => {
        if (data) {
          if (typeof data.notes === 'string') {
            try {
              data.notes = JSON.parse(data.notes);
            } catch (e) {
              console.error('Error al parsear notas:', e);
              data.notes = {};
            }
          }

          this.product = data;

          if (data.images && data.images.length > 0) {
            this.mainImageUrl = `${this.backendUrl}${data.images[0].imageUrl}`;
          }

          if (data.variations && data.variations.length > 0) {
            this.selectVariation(data.variations[0]);
          }
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        console.error('Error al obtener producto:', err);
        this.router.navigate(['/']);
      }
    });
  }

  changeMainImage(imageUrl: string): void {
  this.mainImageUrl = `${this.backendUrl}${imageUrl}`;
}


  selectVariation(variation: any): void {
    this.selectedVariation = variation;
  }

addToCart(): void {
    if (!this.selectedVariation) {
      this.notificationService.show('Por favor, selecciona un tamaño.', 'error');
      return;
    }
    this.cartService.addItem(this.selectedVariation.id, 1).subscribe({
      next: () => {
        this.notificationService.show('¡Producto añadido a la cesta!', 'success');
      },
      error: (err) => {
        this.notificationService.show(err.error?.error || 'Debes iniciar sesión para comprar.', 'error');
      }
    });
  }
}