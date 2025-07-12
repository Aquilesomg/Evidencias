import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // URL base corregida para apuntar directamente a /api/productos
  private apiUrl = 'http://localhost:3000/api/productos';

  constructor(private http: HttpClient) { }

  // POST: Crear nuevo producto
  createProduct(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData, { withCredentials: true });
  }

  // GET: Obtener productos con filtros opcionales
  getProducts(filters: any = {}): Observable<any[]> {
    const params = new URLSearchParams(filters).toString();
    return this.http.get<any[]>(`${this.apiUrl}?${params}`);
  }

  // GET: Obtener producto por ID
  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
