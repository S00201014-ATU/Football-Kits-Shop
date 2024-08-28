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
  cardNumberInvalidLength: boolean = false;
  cardNumberTouchedAndBlurred: boolean = false; // Track if the user started typing and left the field
  cvv: string = '';
  cvvInvalidLength: boolean = false;
  cvvTouchedAndBlurred: boolean = false; // Track CVV input interactions
  months: string[] = [];
  years: string[] = [];
  selectedMonth: string = '';
  selectedYear: string = '';
  currentMonth: number = new Date().getMonth() + 1;
  currentYear: number = new Date().getFullYear();
  forename: string = '';
  surname: string = '';
  town: string = '';
  country: string = '';
  cardName: string = '';
  addressLine1: string = '';
  addressLine2: string = '';
  phoneNumber: string = '';

  constructor(
    private cartService: CartService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();

    if (this.cartItems.length === 0) {
      return;
    }

    this.calculateTotalPrice();
    this.generateYears();
    this.updateAvailableMonths();
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
  formatCardNumber(event: any): void {
    let input = event.target.value;

    // Remove all non-numeric characters
    input = input.replace(/\D/g, '');

    // Format the card number in groups of 4 digits
    if (input.length > 0) {
      input = input.match(/.{1,4}/g)?.join(' ') || input;
    }

    this.cardNumber = input;
    event.target.value = input;

    // Reset touched-and-blurred flag when typing
    this.cardNumberTouchedAndBlurred = false;
  }

  // Validate the card number length
  validateCardNumberLength(): void {
    this.cardNumberInvalidLength = this.cardNumber.replace(/\s+/g, '').length !== 16;
  }

  // Trigger validation when the field loses focus
  onCardNumberBlur(): void {
    this.validateCardNumberLength();
    if (this.cardNumber.length > 0) {
      this.cardNumberTouchedAndBlurred = true;
    }
  }

  // CVV validation logic
  validateCvvLength(): void {
    this.cvvInvalidLength = this.cvv.length !== 3;
  }

  onCvvBlur(): void {
    this.validateCvvLength();
    if (this.cvv.length > 0) {
      this.cvvTouchedAndBlurred = true;
    }
  }

  formatCvv(event: any): void {
    let input = event.target.value;
    input = input.replace(/\D/g, ''); // Only allow numbers
    this.cvv = input;
    event.target.value = input;
    this.cvvTouchedAndBlurred = false; // Reset touched flag while typing
  }

  generateYears(): void {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 10; i++) {
      this.years.push((currentYear + i).toString());
    }
  }

  updateAvailableMonths(): void {
    this.months = [];
    if (this.selectedYear === this.currentYear.toString()) {
      for (let i = this.currentMonth; i <= 12; i++) {
        this.months.push(i.toString().padStart(2, '0'));
      }
    } else {
      for (let i = 1; i <= 12; i++) {
        this.months.push(i.toString().padStart(2, '0'));
      }
    }
  }

  preventInvalidCharacters(event: KeyboardEvent): void {
    const charCode = event.charCode;
    if (
      (charCode >= 65 && charCode <= 90) || // Uppercase A-Z
      (charCode >= 97 && charCode <= 122) || // Lowercase a-z
      charCode === 32 || // Space
      charCode === 39 || // Apostrophe
      (charCode >= 192 && charCode <= 255) // Accented characters (À-ž)
    ) {
      return;
    }
    event.preventDefault();
  }

  sanitizeForename(): void {
    const sanitizedForename = this.forename.replace(/[^a-zA-ZÀ-ž\s']/g, '');
    const sanitizedSurname = this.surname.replace(/[^a-zA-ZÀ-ž\s']/g, '');
    const sanitizedTown = this.town.replace(/[^a-zA-ZÀ-ž\s']/g, '');
    const sanitizedCountry = this.country.replace(/[^a-zA-ZÀ-ž\s']/g, '');
    const sanitizedCardName = this.cardName.replace(/[^a-zA-ZÀ-ž\s']/g, '');
    this.forename = sanitizedForename.replace(/\s+/g, ' ').trim();
    this.surname = sanitizedSurname.replace(/\s+/g, ' ').trim();
    this.town = sanitizedTown.replace(/\s+/g, ' ').trim();
    this.country = sanitizedCountry.replace(/\s+/g, ' ').trim();
    this.cardName = sanitizedCardName.replace(/\s+/g, ' ').trim();
  }

  preventInvalidAddressCharacters(event: KeyboardEvent): void {
    const charCode = event.charCode;
    if (
      (charCode >= 48 && charCode <= 57) || // Allow numbers
      (charCode >= 65 && charCode <= 90) || // Uppercase A-Z
      (charCode >= 97 && charCode <= 122) || // Lowercase a-z
      charCode === 32 || // Space
      charCode === 39 || // Apostrophe
      (charCode >= 192 && charCode <= 255) // Accented characters (À-ž)
    ) {
      return;
    }
    event.preventDefault();
  }

  sanitizeAddress(): void {
    const sanitizedAL1 = this.addressLine1.replace(/[^a-zA-ZÀ-ž0-9\s']/g, '');
    const sanitizedAL2 = this.addressLine2.replace(/[^a-zA-ZÀ-ž0-9\s']/g, '');
    this.addressLine1 = sanitizedAL1.replace(/\s+/g, ' ').trim();
    this.addressLine2 = sanitizedAL2.replace(/\s+/g, ' ').trim();
  }

  sanitizePhone(event: any): void {
    // Update phoneNumber, not cardNumber
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
    this.phoneNumber = event.target.value;
  }

  // Handle the form submission for placing the order
  onSubmit(form: any): void {
    this.validateCardNumberLength(); // Validate card length on submission

    if (form.valid && !this.cardNumberInvalidLength) {
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

      this.http.post('https://football-kits-shop-45q5.onrender.com/api/checkout/orders', orderData)
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
