import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private CART_KEY = 'cartItems';
  private cartSubject = new BehaviorSubject<any[]>(this.isBrowser() ? this.getCartItems() : []); // Ensure cart is empty on the server
  cartChanges = this.cartSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  // Utility method to check if we are in the browser
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // Get cart items from localStorage
  getCartItems(): any[] {
    if (this.isBrowser()) {
      const cart = localStorage.getItem(this.CART_KEY);
      return cart ? JSON.parse(cart) : [];
    }
    return [];
  }

  // Add a product to the cart or update its quantity
  addToCart(product: any): void {
    if (this.isBrowser()) {
      const cartItems = this.getCartItems();
      const itemIndex = cartItems.findIndex(item => item._id === product._id);

      if (itemIndex > -1) {
        cartItems[itemIndex].quantity += 1;
      } else {
        cartItems.push({ ...product, quantity: 1 });
      }

      this.saveCart(cartItems);
      this.cartSubject.next(cartItems); // Emit updated cart
    }
  }

  // Decrease the quantity of a product in the cart or remove it if quantity reaches zero
  decreaseQuantity(product: any): void {
    if (this.isBrowser()) {
      const cartItems = this.getCartItems();
      const itemIndex = cartItems.findIndex(item => item._id === product._id);

      if (itemIndex > -1) {
        cartItems[itemIndex].quantity -= 1;
        if (cartItems[itemIndex].quantity <= 0) {
          cartItems.splice(itemIndex, 1);
        }
      }

      this.saveCart(cartItems);
      this.cartSubject.next(cartItems); // Emit updated cart
    }
  }

  // Remove a product from the cart
  removeProduct(productId: string): void {
    if (this.isBrowser()) {
      const cartItems = this.getCartItems();
      const updatedCart = cartItems.filter(item => item._id !== productId);
      this.saveCart(updatedCart);
      this.cartSubject.next(updatedCart); // Emit updated cart
    }
  }

  // Clear the cart
  clearCart(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.CART_KEY);
      this.cartSubject.next([]); // Emit cleared cart
    }
  }

  // Update the product details in the cart while keeping the quantity intact
  updateProductInCart(updatedProduct: any): void {
    if (this.isBrowser()) {
      const cartItems = this.getCartItems();
      const existingProductIndex = cartItems.findIndex(item => item._id === updatedProduct._id);

      if (existingProductIndex !== -1) {
        const existingQuantity = cartItems[existingProductIndex].quantity;
        cartItems[existingProductIndex] = { ...updatedProduct, quantity: existingQuantity };
        this.saveCart(cartItems);
        this.cartSubject.next(cartItems); // Emit updated cart
      }
    }
  }

  // New method to remove a deleted product from the cart
  removeProductFromCartByProductId(productId: string): void {
    if (this.isBrowser()) {
      const cartItems = this.getCartItems();
      const updatedCart = cartItems.filter(item => item._id !== productId);
      this.saveCart(updatedCart);
      this.cartSubject.next(updatedCart); // Emit updated cart
    }
  }

  // Save the cart items to localStorage
  private saveCart(cartItems: any[]): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.CART_KEY, JSON.stringify(cartItems));
    }
  }
}
