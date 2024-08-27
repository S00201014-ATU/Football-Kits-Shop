import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from './../../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { filter } from 'rxjs/operators';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {
  isLoggedIn: boolean = false;
  isStaff: boolean = false;
  currentRoute: string = '';
  cartIsEmpty: boolean = true;
  cartItemCount: number = 0;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Initialize cart state
    this.updateCartItemCount();

    // Subscribe to cart changes
    this.cartService.cartChanges.subscribe((items) => {
      this.updateCartItemCount(items);
      this.cdr.detectChanges();
    });

    // Subscribe to login status changes
    this.authService.isLoggedIn$.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
      if (this.isLoggedIn) {
        this.checkUserRole();
      } else {
        this.isStaff = false;
      }
      this.cdr.detectChanges();
    });

    // Track the current route
    this.router.events
      .pipe(
        filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
        this.cdr.detectChanges(); // Trigger change detection
      });
  }

  // Update the cart item count to reflect the total quantity of items
  updateCartItemCount(items = this.cartService.getCartItems()): void {
    this.cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
    this.cartIsEmpty = this.cartItemCount === 0;
  }

  checkUserRole(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken: any = jwtDecode(token);
        this.isStaff = decodedToken.role === 'staff';
      }
    }
  }

  handleAuthClick(): void {
    if (this.isLoggedIn) {
      this.authService.logout();
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  isActive(route: string): boolean {
    return this.currentRoute === route || (route === '/login' && this.currentRoute === '/login');
  }
}
