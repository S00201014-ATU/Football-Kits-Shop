import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from './../../services/auth.service';
import {jwtDecode} from 'jwt-decode';
@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.css'
})
export class NavigationBarComponent implements OnInit {
  isLoggedIn: boolean = false;
  isStaff: boolean = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object,
    private cdr: ChangeDetectorRef,  // Inject ChangeDetectorRef
    private authService: AuthService  // Inject AuthService
  ) {}

  ngOnInit(): void {
    // Subscribe to login status changes from AuthService
    this.authService.isLoggedIn$.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
      if (this.isLoggedIn) {
        this.checkUserRole(); // Check the role when the user is logged in
      } else {
        this.isStaff = false; // Reset staff status on logout
      }
      this.cdr.detectChanges();  // Manually trigger change detection
    });
  }

  checkUserRole(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken: any = jwtDecode(token);
        this.isStaff = decodedToken.role === 'staff';  // Set the staff flag based on the decoded token
      }
    }
  }

  handleAuthClick(): void {
    if (this.isLoggedIn) {
      this.authService.logout(); // Use the AuthService to handle logout
      this.router.navigate(['/login']); // Redirect to login page after logout
    } else {
      this.router.navigate(['/login']); // Redirect to login page if not logged in
    }
  }
}
