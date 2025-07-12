import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private apiUrl = 'http://localhost:3000/api'; // Usamos la URL base de la API

  constructor(private http: HttpClient) { }

  // Obtiene el resumen de datos para el dashboard del vendedor
  getDashboardSummary(): Observable<any> {
    // NOTA: Necesitaremos crear esta ruta en el backend
    return this.http.get<any>(`${this.apiUrl}/seller/summary`, { withCredentials: true });
  }

  // Obtiene los productos del vendedor logueado
  getMyProducts(): Observable<any[]> {
    // NOTA: Necesitaremos crear esta ruta en el backend
    return this.http.get<any[]>(`${this.apiUrl}/seller/products`, { withCredentials: true });
  }
  
  // Elimina un producto del vendedor
  deleteProduct(productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/productos/${productId}`, { withCredentials: true });
  }
}