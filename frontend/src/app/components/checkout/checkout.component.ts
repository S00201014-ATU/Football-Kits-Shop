import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  totalPrice: string = '0.00';
  cardNumber: string = '';
  months: string[] = [];
  years: string[] = [];
  selectedYear: string = '';
  currentMonth: number = new Date().getMonth() + 1; // JavaScript months are zero-based (0-11), so we add 1
  currentYear: number = new Date().getFullYear();

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.calculateTotalPrice();
    this.generateYears();
    this.updateAvailableMonths(); // Generate the initial month options
  }

  calculateTotalPrice(): void {
    const rawTotal = this.cartService.getCartItems().reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    this.totalPrice = rawTotal.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  // Automatically formats the card number into groups of four, limiting to 16 digits
  formatCardNumber(): void {
    this.cardNumber = this.cardNumber.replace(/\D/g, '').substring(0, 16);
    this.cardNumber = this.cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  }

  // Generates an array of years starting from the current year for the expiration date dropdown
  generateYears(): void {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 10; i++) {
      this.years.push((currentYear + i).toString());
    }
  }

  // Updates the available months based on the selected year
  updateAvailableMonths(): void {
    this.months = [];

    // If the selected year is the current year, limit months to those >= current month
    if (this.selectedYear === this.currentYear.toString()) {
      for (let i = this.currentMonth; i <= 12; i++) {
        this.months.push(i.toString().padStart(2, '0')); // Format as 01, 02, etc.
      }
    } else {
      // If it's a future year, all months are available
      for (let i = 1; i <= 12; i++) {
        this.months.push(i.toString().padStart(2, '0'));
      }
    }
  }

  // Redirect to home after placing the order
  onSubmit(form: any): void {
    if (form.valid) {
      alert('Order placed successfully!');
      this.cartService.clearCart();
      this.router.navigate(['/']);
    } else {
      alert('Please fill out all required fields correctly.');
    }
  }
}
