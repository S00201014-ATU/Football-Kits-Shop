import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: any[] = [];

  constructor(private productService: ProductService, private http:HttpClient) {}

  ngOnInit(): void {
    // More efficient way of loading in products
    this.loadProducts();
  }

  loadProducts(): void {
    this.http.get('http://localhost:3000/api/products').subscribe((response: any) => {
      this.products = response;
    });
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
        this.loadProducts();
      },
      (error) => {
        alert('Failed to delete product');
        console.error(error);
      }
    )
  }
}
