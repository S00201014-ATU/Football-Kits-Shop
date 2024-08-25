import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: string = '0.00'; // Set totalPrice as a string

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
    this.calculateTotalPrice();
  }

  increaseQuantity(product: any): void {
    this.cartService.addToCart(product);
    this.updateCartItems();
  }

  decreaseQuantity(product: any): void {
    this.cartService.decreaseQuantity(product);
    this.updateCartItems();
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
}
