import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private CART_KEY = 'cartItems';

  constructor() {}

  getCartItems(): any[] {
    // Retrieve the cart from localStorage
    const cart = localStorage.getItem(this.CART_KEY);
    return cart ? JSON.parse(cart) : [];
  }

  addToCart(product: any): void {
    const cartItems = this.getCartItems();
    const itemIndex = cartItems.findIndex(item => item._id === product._id);

    if (itemIndex > -1) {
      cartItems[itemIndex].quantity += 1;
    } else {
      cartItems.push({ ...product, quantity: 1 });
    }

    // Update the cart in localStorage
    localStorage.setItem(this.CART_KEY, JSON.stringify(cartItems));
  }

  decreaseQuantity(product: any): void {
    const cartItems = this.getCartItems();
    const itemIndex = cartItems.findIndex(item => item._id === product._id);

    if (itemIndex > -1) {
      cartItems[itemIndex].quantity -= 1;
      if (cartItems[itemIndex].quantity <= 0) {
        cartItems.splice(itemIndex, 1);
      }
    }

    // Update the cart in localStorage
    localStorage.setItem(this.CART_KEY, JSON.stringify(cartItems));
  }

  removeProduct(productId: string): void {
    const cartItems = this.getCartItems();
    const updatedCart = cartItems.filter(item => item._id !== productId);

    // Update the cart in localStorage
    localStorage.setItem(this.CART_KEY, JSON.stringify(updatedCart));
  }

  clearCart(): void {
    // Clear the cart in localStorage
    localStorage.removeItem(this.CART_KEY);
  }
}
