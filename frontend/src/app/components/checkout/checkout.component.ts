import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: string = '0.00';
  cardNumber: string = '';
  months: string[] = [];
  years: string[] = [];
  selectedYear: string = '';
  currentMonth: number = new Date().getMonth() + 1; // JavaScript months are zero-based (0-11), so we add 1
  currentYear: number = new Date().getFullYear();

  constructor(
    private cartService: CartService,
    private router: Router,
    private http: HttpClient // Add HttpClient to send emails
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems(); // Get cart items for the order summary
    this.calculateTotalPrice();
    this.generateYears();
    this.updateAvailableMonths(); // Generate the initial month options
  }

  calculateTotalPrice(): void {
    const rawTotal = this.cartItems.reduce((total, item) => {
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

  // Handle the form submission for placing the order
  onSubmit(form: any): void {
    if (form.valid) {
      // Ensure the total price is a valid number without commas
      const formattedTotalPrice = parseFloat(this.totalPrice.replace(/,/g, ''));

      const orderData = {
        forename: form.value.forename,
        surname: form.value.surname,
        addressLine1: form.value.addressLine1,
        addressLine2: form.value.addressLine2,
        town: form.value.town,
        country: form.value.country,
        email: form.value.email,
        phone: form.value.phone,
        cartItems: this.cartService.getCartItems(),
        totalPrice: formattedTotalPrice,
      };

      // Send orderData to the backend
      this.http.post('http://localhost:3000/api/checkout/orders', orderData)
        .subscribe(
          (response: any) => {
            alert('Order placed successfully!');
            this.cartService.clearCart();
            this.router.navigate(['/']);
          },
          (error: any) => {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
          }
        );
    } else {
      alert('Please fill out all required fields correctly.');
    }
  }

}
