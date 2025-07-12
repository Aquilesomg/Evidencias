import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  newArrivals: any[] = [];
  bestSellers: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        // Lógica simple para simular nuevas llegadas y más vendidos
        this.newArrivals = products.slice(0, 4);
        this.bestSellers = products.slice(4, 7);
      },
      error: (err) => console.error('Error al obtener productos:', err)
    });
  }
}

