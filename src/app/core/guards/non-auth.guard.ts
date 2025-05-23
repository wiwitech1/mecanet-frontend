import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { UserService } from '../services/user.service';

export const nonAuthGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);
  
  if (!userService.getSession()) {
    return true;
  }
  
  // Si ya hay sesión, redirigir a la página principal
  router.navigate(['/']);
  return false;
};
