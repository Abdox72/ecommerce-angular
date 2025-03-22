import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Inject AuthService
  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('user');
  if (!isLoggedIn) {
    router.navigate(['/login']); // Redirect to login if not authenticated
    return false;
  }
  return true;
};
