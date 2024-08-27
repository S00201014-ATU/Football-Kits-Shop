import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
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
  productExists: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    console.log('Product ID:', this.productId);

    if (this.productId) {
      this.loadProductData();
    } else {
      alert('Invalid Product ID');
    }
  }

  loadProductData(): void {
    this.http.get(`http://localhost:3000/api/products/${this.productId}`).subscribe(
      (response: any) => {
        if (response) {
          console.log('Product Data Loaded:', response);
          this.productData = response;
          this.productExists = true;
        } else {
          this.productExists = false;
        }
      },
      (error) => {
        this.productExists = false;
        console.error('Error loading product data:', error);
      }
    );
  }

  onSubmit(form: any): void {
    if (form.valid) {
      this.http.put(`http://localhost:3000/api/products/${this.productId}`, this.productData).subscribe(
        () => {
          alert('Product updated successfully!');

          // Update the cart with the new product details
          this.cartService.updateProductInCart(this.productData);

          this.router.navigate(['/cart']); // Redirect to cart page after update
        },
        (error) => {
          alert('Failed to update product.');
          console.error(error);
        }
      );
    }
  }
}
