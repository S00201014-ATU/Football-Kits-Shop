import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  username: string = '';
  password: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService  // Inject AuthService
  ) {}

  ngOnInit(): void {
    // Log out the user if they are already logged in
    if (this.authService.checkLoginStatus()) {
      alert('Since you were loggedin - you have now been logged out.');
      this.authService.logout();  // Log the user out
    }
  }

  onSubmit(form: any): void {
    if (form.valid) {
      const loginData = {
        username: form.value.username,
        password: form.value.password,
      };

      this.http.post('http://localhost:3000/api/users/login', loginData).subscribe(
        (response: any) => {
          alert('Login successful!');

          // Save the token via AuthService
          this.authService.login(response.token);

          // Redirect to home or another page
          this.router.navigate(['/']);
        },
        (error) => {
          alert('Login failed: ' + error.error.message);
        }
      );
    }
  }
}
