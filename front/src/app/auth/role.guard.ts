import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map, filter, take } from 'rxjs/operators';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const expectedRoles = route.data['expectedRole'] as Array<string> | string;

  return authService.isAuthStatusChecked$.pipe(
    filter(isChecked => isChecked),
    take(1),
    map(() => {
      const userRole = authService.getUserRole();
      const isLoggedIn = authService.isLoggedIn();

      let hasPermission = false;
      if (userRole) {
        hasPermission = Array.isArray(expectedRoles)
          ? expectedRoles.includes(userRole)
          : userRole === expectedRoles;
      }

      if (isLoggedIn && hasPermission) {
        return true;
      } else {
        router.navigate(['/auth/login']); // Redirigir al login si no tiene permiso
        return false;
      }
    })
  );
};
