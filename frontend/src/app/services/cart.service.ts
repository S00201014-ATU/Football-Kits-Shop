import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: any[] = [];

  constructor() { this.loadCartFromLocalStorage(); }

  // Load cart items from local storage

  private loadCartFromLocalStorage(): void {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
    }
  }

  // Save cart items to local storage
  private saveCartToLocalStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  // Add a product to the cart or update quantity if it already exists
  addToCart(product: any): void {
    const existingProduct = this.cart.find(item => item._id === product._id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
    this.saveCartToLocalStorage();
  }

  // Decrease quantity or remove the product if quantity is 1
  decreaseQuantity(product: any): void {
    const existingProduct = this.cart.find(item => item._id === product._id);
    if (existingProduct) {
      if (existingProduct.quantity > 1) {
        existingProduct.quantity -= 1; // Decrease quantity if greater than 1
      } else {
        this.removeProduct(product._id); // Remove the product if quantity is 1
      }
    }
    this.saveCartToLocalStorage();
  }

  // Remove product from the cart
  removeProduct(productId: string): void {
    this.cart = this.cart.filter(item => item._id !== productId);
    this.saveCartToLocalStorage();
  }

  // Get the current cart items
  getCartItems(): any[] {
    return this.cart;
  }

  // Clear the cart
  clearCart(): void {
    this.cart = [];
    this.saveCartToLocalStorage;
  }
}
