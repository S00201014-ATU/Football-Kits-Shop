import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { CartService } from './cart.service';  // Import CartService

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private cartService: CartService  // Inject CartService
  ) {
    // Only check the token in the browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedInSubject.next(this.hasToken());
    }
  }

  private hasToken(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  login(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
      this.isLoggedInSubject.next(true);  // Notify subscribers that user is logged in
      this.cartService.getCartItems();  // Load the user's cart after logging in
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      this.isLoggedInSubject.next(false);  // Notify subscribers that user is logged out
      this.cartService.clearCart();  // Clear the cart when user logs out
    }
  }

  checkLoginStatus(): boolean {
    return this.hasToken();
  }
}
