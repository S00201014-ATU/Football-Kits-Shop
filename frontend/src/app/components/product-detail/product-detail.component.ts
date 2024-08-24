import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit{

  product: any;

  constructor(private route:ActivatedRoute, private productService: ProductService,
    private cartService:CartService ){}

  ngOnInit(): void {
    //Get product ID from route
    const productId = this.route.snapshot.paramMap.get('id');
    this.productService.getProducts().subscribe((products) => {
      //Find the product by ID
      this.product = products.find((product) => product._id === productId);
    });
  }

  addToCart(product: any): void {
    this.cartService.addToCart(product);
    alert(`${product.name} has been added to the cart!`);
  }
}
