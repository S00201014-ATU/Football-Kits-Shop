import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Product {
  _id: string;
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
  private apiURL = 'https://football-kits-shop-45q5.onrender.com/api/products';

  constructor(private http:HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiURL);
  }
}
