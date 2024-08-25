import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Changed 'styleUrl' to 'styleUrls' (correct Angular syntax)
})
export class LoginComponent {
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService  // Inject AuthService
  ) {}

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
