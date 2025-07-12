import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {
  pageTitle = 'Resumen';
  activeLink = 'resumen';
  username = 'Admin';

  constructor(private router: Router, private authService: AuthService) {
    this.authService.user$.subscribe(user => {
      if (user) this.username = user.username;
    });

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updatePageInfo(event.urlAfterRedirects);
    });
  }
  
  ngOnInit() {
    this.updatePageInfo(this.router.url);
  }

  updatePageInfo(url: string) {
    if (url.includes('/aprobacion')) {
      this.pageTitle = 'Aprobación de Productos';
      this.activeLink = 'aprobacion';
    } else if (url.includes('/pedidos')) {
      this.pageTitle = 'Gestión de Pedidos';
      this.activeLink = 'pedidos';
    } else if (url.includes('/categorias')) {
      this.pageTitle = 'Gestión de Categorías';
      this.activeLink = 'categorias';
    } else {
      this.pageTitle = 'Resumen';
      this.activeLink = 'resumen';
    }
  }

  logout() {
    this.authService.logout().subscribe();
  }
}
