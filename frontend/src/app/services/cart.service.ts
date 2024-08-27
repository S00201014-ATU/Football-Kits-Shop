import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private CART_KEY = 'cartItems';

  constructor() {}

  // Get cart items from localStorage
  getCartItems(): any[] {
    const cart = localStorage.getItem(this.CART_KEY);
    return cart ? JSON.parse(cart) : [];
  }

  // Add a product to the cart or update its quantity
  addToCart(product: any): void {
    const cartItems = this.getCartItems();
    const itemIndex = cartItems.findIndex(item => item._id === product._id);

    if (itemIndex > -1) {
      cartItems[itemIndex].quantity += 1;
    } else {
      cartItems.push({ ...product, quantity: 1 });
    }

    this.saveCart(cartItems);
  }

  // Decrease the quantity of a product in the cart or remove it if quantity reaches zero
  decreaseQuantity(product: any): void {
    const cartItems = this.getCartItems();
    const itemIndex = cartItems.findIndex(item => item._id === product._id);

    if (itemIndex > -1) {
      cartItems[itemIndex].quantity -= 1;
      if (cartItems[itemIndex].quantity <= 0) {
        cartItems.splice(itemIndex, 1);
      }
    }

    this.saveCart(cartItems);
  }

  // Remove a product from the cart
  removeProduct(productId: string): void {
    const cartItems = this.getCartItems();
    const updatedCart = cartItems.filter(item => item._id !== productId);
    this.saveCart(updatedCart);
  }

  // Clear the cart
  clearCart(): void {
    localStorage.removeItem(this.CART_KEY);
  }

  // Update the product details in the cart while keeping the quantity intact
  updateProductInCart(updatedProduct: any): void {
    const cartItems = this.getCartItems();
    const existingProductIndex = cartItems.findIndex(item => item._id === updatedProduct._id);

    if (existingProductIndex !== -1) {
      // Update the product details while retaining the quantity
      const existingQuantity = cartItems[existingProductIndex].quantity;
      cartItems[existingProductIndex] = { ...updatedProduct, quantity: existingQuantity };
      this.saveCart(cartItems);
    }
  }

  // New method to remove a deleted product from the cart
  removeProductFromCartByProductId(productId: string): void {
    const cartItems = this.getCartItems();
    const updatedCart = cartItems.filter(item => item._id !== productId);
    this.saveCart(updatedCart);
  }

  // Save the cart items to localStorage
  private saveCart(cartItems: any[]): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(cartItems));
  }
}
