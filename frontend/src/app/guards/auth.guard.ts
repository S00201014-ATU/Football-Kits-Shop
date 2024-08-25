import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (typeof window !== 'undefined' && localStorage) {
      const token = localStorage.getItem('token');

      if (!token) {
        // No token means the user is logged out. Redirect to the login page.
        this.router.navigate(['/login']);
        return false;
      }

      try {
        const decodedToken: any = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp && decodedToken.exp > currentTime) {
          const userRole = decodedToken['role'];

          // Check role-based access control for the route
          if (route.data && route.data['role'] && route.data['role'] !== userRole) {
            if (userRole === 'customer') {
              // Redirect customers to the product list page
              this.router.navigate(['/products']);
            } else {
              // Redirect non-customers to the login page
              this.router.navigate(['/login']);
            }
            return false;
          }
          return true; // Authorised for the route
        } else {
          // Token has expired
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
          return false;
        }
      } catch (error) {
        // Error during token decoding or validation
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
        return false;
      }
    }

    // If localStorage is not available (e.g., server-side), redirect to login
    this.router.navigate(['/login']);
    return false;
  }
}
