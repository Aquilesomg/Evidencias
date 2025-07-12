import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-seller-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './seller-layout.component.html',
  styleUrls: ['./seller-layout.component.css']
})
export class SellerLayoutComponent implements OnInit {
  pageTitle = 'Resumen';
  activeLink = 'resumen';
  username: string = 'Vendedor';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (user) this.username = user.username;
    });

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updatePageInfo(event.urlAfterRedirects);
    });
    
    // Setea el estado inicial al cargar el componente
    this.updatePageInfo(this.router.url);
  }

  updatePageInfo(url: string) {
    if (url.includes('/productos/crear')) {
      this.pageTitle = 'Añadir Nuevo Perfume';
      this.activeLink = 'productos';
    } else if (url.includes('/productos')) {
      this.pageTitle = 'Mis Productos';
      this.activeLink = 'productos';
    } else {
      this.pageTitle = 'Resumen';
      this.activeLink = 'resumen';
    }
  }

  logout() {
    this.authService.logout().subscribe();
  }
}