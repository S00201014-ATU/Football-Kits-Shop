import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  passwordMismatch: boolean = false;
  allFieldsFilled: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(form: any): void {
    if (form.valid && !this.passwordMismatch) {
      const userData = {
        username: form.value.username,
        email: form.value.email,
        password: form.value.password,
        role: form.value.role,
      };

      this.http.post('http://localhost:3000/api/users/register', userData).subscribe(
        (response: any) => {
          alert('Registration successful!');
          form.resetForm();
          this.router.navigate(['/login']);
        },
        (error) => {
          const errorMessage = error.error?.message || 'Registration failed';
          alert(errorMessage);
          console.error(error);
        }
      );
    }
  }

  // Check password mismatch whenever the confirm password field loses focus
  onConfirmPasswordBlur(form: any): void {
    if (form.value.password && form.value.confirmPassword) {
      this.passwordMismatch = form.value.password !== form.value.confirmPassword;
    }
  }

  // Check if all fields are filled and form is valid
  onInputChange(form: any): void {
    this.allFieldsFilled = form.valid;
  }

}
