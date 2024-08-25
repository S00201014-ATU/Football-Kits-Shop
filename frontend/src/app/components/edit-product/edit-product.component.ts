import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent implements OnInit {
  productId: string = '';
  productData: any = {
    name: '',
    price: 0,
    imageUrl: '',
    description: '',
    tags: {
      league: '',
      manufacturer: '',
      europeanCompetition: ''
    }
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Capture the product ID from the route
    this.productId = this.route.snapshot.paramMap.get('id') || '';

    // Log productId to ensure it's captured correctly
    console.log('Product ID:', this.productId);

    // If productId is valid, load the product data
    if (this.productId) {
      this.loadProductData();
    } else {
      alert('Invalid Product ID');
    }
  }

  loadProductData(): void {
    // Use hardcoded backend URL
    this.http.get(`http://localhost:3000/api/products/${this.productId}`).subscribe(
      (response: any) => {
        console.log('Product Data Loaded:', response);
        this.productData = response;
      },
      (error) => {
        alert('Failed to load product data.');
        console.error(error);
      }
    );
  }

  onSubmit(form: any): void {
    if (form.valid) {
      // Submit updated product data using hardcoded backend URL
      this.http.put(`http://localhost:3000/api/products/${this.productId}`, this.productData).subscribe(
        () => {
          alert('Product updated successfully!');
          this.router.navigate(['/']);
        },
        (error) => {
          alert('Failed to update product.');
          console.error(error);
        }
      );
    }
  }
}
