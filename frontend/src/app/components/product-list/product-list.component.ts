import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { HttpClient } from '@angular/common/http';
import {jwtDecode} from 'jwt-decode';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  isStaff: boolean = false;

  constructor(
    private productService: ProductService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    // Load products
    this.loadProducts();

    // Check if running in the browser
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken: any = jwtDecode(token);
        this.isStaff = decodedToken.role === 'staff';
      }
    }
  }

  loadProducts(): void {
    this.http.get('http://localhost:3000/api/products').subscribe(
      (response: any) => {
        this.products = response;
      },
      (error) => {
        console.error('Failed to load products', error);
      }
    );
  }

  confirmDelete(productId: string): void {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      this.deleteProduct(productId);
    }
  }

  deleteProduct(productId: string): void {
    this.http.delete(`http://localhost:3000/api/products/${productId}`).subscribe(
      () => {
        alert('Product deleted successfully!');
        this.loadProducts(); // Reload products after deletion
      },
      (error) => {
        alert('Failed to delete product');
        console.error(error);
      }
    );
  }
}
