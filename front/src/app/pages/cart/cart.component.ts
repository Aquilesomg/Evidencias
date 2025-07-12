import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart$: BehaviorSubject<any | null> = new BehaviorSubject(null);
  backendUrl = 'http://localhost:3000';

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (data) => this.cart$.next(data),
      error: (err) => console.error('Error al cargar el carrito:', err)
    });
  }

  updateQuantity(itemId: string, newQuantity: number): void {
    if (newQuantity < 1) {
      this.removeItem(itemId);
      return;
    }
    this.cartService.updateItemQuantity(itemId, newQuantity).subscribe(() => this.loadCart());
  }

  removeItem(itemId: string): void {
    this.cartService.removeItem(itemId).subscribe(() => this.loadCart());
  }

proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  onQuantityChange(event: Event, itemId: string): void {
    const inputElement = event.target as HTMLInputElement;
    const value = Number(inputElement.value);
    if (!isNaN(value)) {
      this.updateQuantity(itemId, value);
    }
  }
}
