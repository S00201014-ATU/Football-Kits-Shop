import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: string = '0.00'; // Set totalPrice as a string
  errorMessage: string | null = null; // New property for the error message

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  // Load the cart items from the cartService
  loadCart(): void {
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotalPrice();
  }

  increaseQuantity(product: any): void {
    this.cartService.addToCart(product);
    this.updateCartItems();
  }

  decreaseQuantity(product: any): void {
    this.cartService.decreaseQuantity(product);
    this.updateCartItems();  // Make sure the cart is updated after decreasing quantity or removal
  }

  removeProduct(productId: string): void {
    this.cartService.removeProduct(productId);
    this.updateCartItems();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.cartItems = [];
    this.totalPrice = '0.00'; // Reset totalPrice as a string
  }

  proceedToCheckout(): void {
    if (this.cartItems.length > 0) {
      this.router.navigate(['/checkout']);
    } else {
      this.displayError("Your cart is empty! Please add some products before proceeding to the checkout.");
    }
  }

  private updateCartItems(): void {
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotalPrice();
  }

  private calculateTotalPrice(): void {
    const rawTotal = this.cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    // Format total as a string with two decimal places and commas
    this.totalPrice = rawTotal.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  // New method to display error message
  private displayError(message: string): void {
    this.errorMessage = message;

    // Clear the error message after a few seconds
    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);  // Error message will disappear after 3 seconds
  }
}
