import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Product {
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  tags: {
    league: string;
    manufacturer: string;
    europeanCompetition: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // Backend URL
  private apiURL = 'http://localhost:3000/api/products';

  constructor(private http:HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiURL);
  }
}
