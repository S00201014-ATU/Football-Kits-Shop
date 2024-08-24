import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(form: any): void {
    if (form.valid) {
      const productData = {
        name: form.value.name,
        price: form.value.price,
        imageUrl: form.value.imageUrl,
        description: form.value.description,
        tags: {
          league: form.value.league,
          manufacturer: form.value.manufacturer,
          europeanCompetition: form.value.competition
        }
      };

      this.http.post('http://localhost:3000/api/products', productData).subscribe(
        response => {
          alert('Product added successfully!');
          this.router.navigate(['/']);
        },
        error => {
          alert('Failed to add product.');
          console.error(error);
        }
      );
    }
  }
}
