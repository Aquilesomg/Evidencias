import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:3000/api/admin';

  constructor(private http: HttpClient) { }

  // Obtiene los productos pendientes de aprobación
  getPendingProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/productos/pendientes`, { withCredentials: true });
  }

  // Actualiza el estado de un producto
  updateProductStatus(productId: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/productos/${productId}/status`, { status }, { withCredentials: true });
  }
  
  // Obtiene todos los pedidos
  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pedidos`, { withCredentials: true });
  }

  // Actualiza el estado de un pedido
  updateOrderStatus(orderId: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/pedidos/${orderId}/status`, { status }, { withCredentials: true });
  }
}
