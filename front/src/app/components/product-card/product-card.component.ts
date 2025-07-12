import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './product-card.component.html'
})
export class ProductCardComponent implements OnInit {
  @Input() product: any;
  backendUrl = 'http://localhost:3000';

  ngOnInit() {
    console.log('Producto recibido en card:', this.product);
  }

  getImageUrl(imagePath?: string): string {
    if (!imagePath) {
      return 'https://placehold.co/400x500/e8e8e8/333?text=Sin+Imagen';
    }

    const cleanBase = this.backendUrl.replace(/\/$/, '');
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${cleanBase}${cleanPath}`;
  }
}
