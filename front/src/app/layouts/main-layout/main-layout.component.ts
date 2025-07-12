import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  title = 'AURA';
  currentUser: any | null = null;
  private userSubscription!: Subscription;
  isMenuOpen = false;
    cartItemCount = 0;

constructor(private authService: AuthService, public cartService: CartService) {}
  ngOnInit(): void {
    this.userSubscription = this.authService.user$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.cartService.loadCart(); // Recargamos el carrito cuando el usuario cambia
      }
    });
    // Nos suscribimos al estado del carrito para actualizar el contador
    this.cartService.cart$.subscribe(cart => {
      this.cartItemCount = cart?.totalItems || 0;
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  toggleUserMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenuAndLogout(): void {
    this.isMenuOpen = false;
    this.authService.logout().subscribe();
  }
}
