import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(form: any): void {
    if (form.valid) {
      const userData = {
        username: form.value.username,
        email: form.value.email,
        password: form.value.password,
        role: form.value.role,
      };

      this.http.post('http://localhost:3000/api/users/register', userData).subscribe(
        (response: any) => {
          alert('Registration successful!');
          // Clear form upon successful registration and redirect to login page
          form.resetForm();
          this.router.navigate(['/']);  // Redirect after successful registration
        },
        (error) => {
          const errorMessage = error.error?.message || 'Registration failed';
          alert(errorMessage);  // Display error message in alert
          console.error(error);
        }
        //Showcasing I know multiple ways of displaying messages
      );
    }
  }
}
