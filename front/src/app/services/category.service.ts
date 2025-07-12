import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000/api/categorias';
  constructor(private http: HttpClient) { }

  // --- INICIO DE LA CORRECCIÓN ---
  // Este es el método que faltaba.
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  // --- FIN DE LA CORRECCIÓN ---
}
