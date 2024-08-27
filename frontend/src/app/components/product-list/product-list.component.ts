import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { CartService } from '../../services/cart.service';
import { API_BASE_URL } from '../../../../api.config';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'] // Correct spelling to 'styleUrls'
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  searchTerm: string = '';
  selectedTag: string = 'All Kits'; // Default tag
  selectedCategory: string = 'All Kits'; // Default category
  isStaff: boolean = false;
  noProductsFound: boolean = false;

  leagues: string[] = ['Ligue 1', 'Bundesliga', 'Serie A', 'La Liga', 'Premier League', 'Other Leagues'];
  manufacturers: string[] = ['Adidas', 'Nike', 'Puma', 'Umbro', 'Castore', "O'Neills", 'Other Manufacturers'];
  competitions: string[] = ['Champions League', 'Europa League', 'Conference League', 'No European Football'];

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts(); // Load all products initially

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken: any = jwtDecode(token);
        this.isStaff = decodedToken.role === 'staff';
      }
    }
  }

  // Load products based on search term or selected tag
  loadProducts(): void {
    let url = `${API_BASE_URL}/api/products`;
    const params: any = {};

    if (this.searchTerm) {
      params.search = this.searchTerm; // Pass search term to the backend
    }

    if (this.selectedCategory === 'European Competitions' && this.selectedTag === 'All Competitions') {
      params.excludeTag = 'No European Football'; // Exclude "No European Football" when "All Competitions" is selected
    } else if (this.selectedTag && this.selectedTag !== 'All Kits' && this.selectedTag !== 'All Leagues' && this.selectedTag !== 'All Manufacturers') {
      params.tag = this.selectedTag; // Pass selected tag to the backend
    }

    this.http.get(url, { params }).subscribe(
      (response: any) => {
        this.products = response;
        this.noProductsFound = this.products.length === 0;
      },
      (error) => {
        console.error('Failed to load products', error);
      }
    );
  }

  // Called when a new category is selected from the main dropdown
  onCategoryChange(): void {
    if (this.selectedCategory === 'Leagues') {
      this.selectedTag = 'All Leagues'; // Default for Leagues
    } else if (this.selectedCategory === 'Manufacturers') {
      this.selectedTag = 'All Manufacturers'; // Default for Manufacturers
    } else if (this.selectedCategory === 'European Competitions') {
      this.selectedTag = 'All Competitions'; // Default for European Competitions
    } else {
      this.selectedTag = 'All Kits'; // Default for All Kits
    }
    this.loadProducts(); // Ensure products are loaded immediately after the category changes
  }

  // Called when a tag is selected from the sub-dropdown
  onTagChange(): void {
    this.loadProducts(); // Reload products based on the selected tag
  }

  onSearch(): void {
    this.loadProducts(); // Reload products based on search term
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
    this.http.delete(`${API_BASE_URL}/api/products/${productId}`).subscribe(
      () => {
        alert('Product deleted successfully!');
        this.cartService.removeProductFromCartByProductId(productId);
        this.loadProducts(); // Reload products after deletion
      },
      (error) => {
        alert('Failed to delete product');
        console.error(error);
      }
    );
  }
}
