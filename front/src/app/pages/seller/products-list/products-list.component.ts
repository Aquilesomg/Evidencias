import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SellerService } from '../../../services/seller.service';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe], // Importaciones corregidas
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {
  products: any[] = [];

  constructor(private sellerService: SellerService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.sellerService.getMyProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Error al cargar los productos del vendedor:', err)
    });
  }

  deleteProduct(productId: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.')) {
      this.sellerService.deleteProduct(productId).subscribe({
        next: () => {
          // Si se elimina con éxito, recargamos la lista de productos
          this.loadProducts(); 
        },
        error: (err) => console.error('Error al eliminar el producto:', err)
      });
    }
  }
}

