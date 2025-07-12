import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-approval',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule],
  templateUrl: './product-approval.component.html'
})
export class ProductApprovalComponent implements OnInit {
  pendingProducts: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadPendingProducts();
  }

  loadPendingProducts(): void {
    this.adminService.getPendingProducts().subscribe({
      next: data => this.pendingProducts = data,
      error: err => console.error(err)
    });
  }

  updateStatus(productId: string, status: 'activo' | 'rechazado'): void {
    this.adminService.updateProductStatus(productId, status).subscribe({
      next: () => {
        // Elimina el producto de la lista en la UI para una respuesta instantánea
        this.pendingProducts = this.pendingProducts.filter(p => p.id !== productId);
      },
      error: err => console.error(err)
    });
  }
}