import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);
  
  if (userService.getSession()) {
    return true;
  }
  
  // Si no hay sesión, redirigir a login
  router.navigate(['/iniciar-sesion']);
  return false;
};
