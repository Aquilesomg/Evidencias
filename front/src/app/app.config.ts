import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { AuthService } from './auth/auth.service';
import { Observable } from 'rxjs';
import { authInterceptor } from './auth/auth.interceptor';

function initializeAppFactory(authService: AuthService): () => Observable<any> {
  return () => authService.checkAuthStatus();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])), 
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [AuthService],
      multi: true
    }
  ]
};

