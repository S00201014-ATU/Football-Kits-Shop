import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CartService } from './../services/cart.service'; // Import the CartService

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private cartService: CartService) {} // Inject CartService

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

          // Check if the user is trying to access the checkout page with an empty cart
          if (route.routeConfig?.path === 'checkout') {
            const cartIsEmpty = this.cartService.getCartItems().length === 0;
            if (cartIsEmpty) {
              // Redirect to the product list page if the cart is empty
              this.router.navigate(['/products']);
              return false;
            }
          }

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
