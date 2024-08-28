import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { error } from 'console';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  message: string = '';

  constructor(private http:HttpClient) {}

  onSubmit(form: any): void {
    if (form.valid) {
      const email = form.value.email;
      this.http.post('https://football-kits-shop-45q5.onrender.com/api/users/forgot-password', {email}).subscribe(
        (response: any) => {
          this.message = 'Password reset link sent! Please check your email.';
        },
        (error) => {
          this.message = 'Failed to send reset link.';
          console.error(error);
        }
      );
    }
  }
}
