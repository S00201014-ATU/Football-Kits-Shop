import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit, OnDestroy {

  product: any;
  isLoggedIn: boolean = false;
  private authSubscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get product ID from route
    const productId = this.route.snapshot.paramMap.get('id');
    this.productService.getProducts().subscribe((products) => {
      // Find the product by ID
      this.product = products.find((product) => product._id === productId);
    });

    // Subscribe to authentication status
    this.authSubscription = this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  addToCart(product: any): void {
    if (this.isLoggedIn) {
      const existingProduct = this.cartService.getCartItems().find(item => item._id === product._id);
      if (existingProduct) {
        this.cartService.addToCart(product);
        alert(`Another ${product.name} has been added to the cart!`);
      } else {
        this.cartService.addToCart(product);
        alert(`${product.name} has been added to the cart!`);
      }
    } else {
      alert('You must be logged in to add products to the cart!');
    }
  }


  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
