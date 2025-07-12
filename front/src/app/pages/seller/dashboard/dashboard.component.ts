import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; // Importamos CurrencyPipe
import { RouterModule } from '@angular/router';
import { SellerService } from '../../../services/seller.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe], // Añadimos CurrencyPipe
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  summary: any = {
    revenue: 0,
    newOrders: 0,
    activeProducts: 0,
    pendingProducts: 0
  };

  constructor(private sellerService: SellerService) {}

  ngOnInit(): void {
    this.sellerService.getDashboardSummary().subscribe({
      next: (data) => this.summary = data,
      error: (err) => {
        console.error('Error al cargar el resumen del vendedor:', err);
        // Asignamos valores por defecto en caso de error para que la UI no se rompa
        this.summary = { revenue: 0, newOrders: 0, activeProducts: 0, pendingProducts: 0 };
      }
    });
  }
}
