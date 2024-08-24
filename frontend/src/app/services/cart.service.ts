import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: any[] = [];

  constructor() { }

  // Add a product to the cart
  addToCart(product: any): void {
    this.cart.push(product);
  }

  // Get the current cart items
  getCartItems(): any[] {
    return this.cart;
  }

  //Clear the cart
  clearCart(): void {
    this.cart = [];
  }
}
