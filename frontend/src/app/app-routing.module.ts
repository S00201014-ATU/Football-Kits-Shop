import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

// Define routes with authentication and role-based protection
const routes: Routes = [
  { path: '', component: ProductListComponent },  // Public access
  { path: 'products/:id', component: ProductDetailComponent },  // Public access

  // Cart and Checkout are accessible to authenticated users only (both customer and staff)
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },

  // Staff-only CRUD routes, restricted by role-based protection
  { path: 'add-product', component: AddProductComponent, canActivate: [AuthGuard], data: { role: 'staff' } },
  { path: 'edit-product/:id', component: EditProductComponent, canActivate: [AuthGuard], data: { role: 'staff' } },

  // Authentication routes (public access)
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  // Fallback route to redirect to the product list
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
