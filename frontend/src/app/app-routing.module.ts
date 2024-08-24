import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { AddProductComponent } from './components/add-product/add-product.component';

const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'products/:id', component:ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component:CheckoutComponent },
  { path: 'add-product', component:AddProductComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
