import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClientModule } from '@angular/common/http'; // Importante para que el servicio funcione

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, // Módulo para formularios reactivos
    RouterModule,        // Módulo para usar routerLink
    HttpClientModule     // Módulo para hacer peticiones HTTP
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      // Usamos 'usernameOrEmail' para que coincida con la API
      usernameOrEmail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage = null;
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        // Si el login es exitoso, redirigimos a la página principal.
        this.router.navigate(['/']);
      },
      error: (err) => {
        // Mostramos el mensaje de error que viene de la API.
        this.errorMessage = err.error?.error || 'Ocurrió un error inesperado.';
        console.error(err);
      }
    });
  }
}
