import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:3000/api/carrito';
  private cartSubject = new BehaviorSubject<any | null>(null);
  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.loadCart();
      } else {
        this.cartSubject.next(null); // Limpiamos el carrito si no hay usuario
      }
    });
  }

  getCart(): Observable<any> {
    return this.http.get<any>(this.apiUrl, {
      withCredentials: true
    }).pipe(
      tap(cart => this.cartSubject.next(cart)),
      catchError(() => {
        this.cartSubject.next(null);
        return of(null);
      })
    );
  }

  loadCart(): void {
    this.getCart().subscribe();
  }

addItem(variationId: string, quantity: number): Observable<any> {
  return this.http.post(`${this.apiUrl}/items`, {
    productId: variationId, // ✅ cambia 'variationId' por 'productId'
    quantity
  }, {
    withCredentials: true
  }).pipe(
    tap(() => this.loadCart())
  );
}


  updateItemQuantity(itemId: string, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/items/${itemId}`, { quantity }, {
      withCredentials: true
    }).pipe(
      tap(() => this.loadCart())
    );
  }

  removeItem(itemId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/items/${itemId}`, {
      withCredentials: true
    }).pipe(
      tap(() => this.loadCart())
    );
  }
}
