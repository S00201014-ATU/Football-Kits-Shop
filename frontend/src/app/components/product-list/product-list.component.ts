import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  searchTerm: string = ''; // Added searchTerm for the search functionality
  isStaff: boolean = false;
  noProductsFound: boolean = false; // New message to show "no products found" message

  constructor(
    private productService: ProductService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    // Load products initially
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

  // Function to load products, with optional search term
  loadProducts(searchTerm: string = ''): void {
    let url = 'http://localhost:3000/api/products';

    // Append search term to the URL if it's not empty
    if (searchTerm) {
      url += `?search=${searchTerm}`;
    }

    this.http.get(url).subscribe(
      (response: any) => {
        this.products = response;
        this.noProductsFound = this.products.length === 0; // Set message if no products found
      },
      (error) => {
        console.error('Failed to load products', error);
      }
    );
  }

  // Triggered when the user clicks the search button
  onSearch(): void {
    this.loadProducts(this.searchTerm); // Pass the searchTerm to the loadProducts function
  }

  // Confirm and delete a product
  confirmDelete(productId: string): void {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
      this.deleteProduct(productId);
    }
  }

  // Handle product deletion
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
