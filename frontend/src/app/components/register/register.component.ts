import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_BASE_URL } from './../../../../api.config';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  passwordMismatch: boolean = false;
  allFieldsFilled: boolean = false;
  username: string  = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  role: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  handleInput(registerForm: any) {
    this.sanitizeUsernameAndPassword();
    this.onInputChange(registerForm);
  }

  preventInvalidCharactersUsernameAndPassword(event: KeyboardEvent): void {
    const charCode = event.charCode;
    if (
      (charCode >= 48 && charCode <= 57) ||
      (charCode >= 65 && charCode <= 90) || // Uppercase A-Z
      (charCode >= 97 && charCode <= 122) || // Lowercase a-z
      (charCode >= 192 && charCode <= 255) // Accented characters (À-ž)
    ) {
      return;
    }
    event.preventDefault();
  }

  sanitizeUsernameAndPassword(): void {
    const sanitizedUsername = this.username.replace(/[^a-zA-ZÀ-ž\s']/g, '');
    this.username = sanitizedUsername.replace(/\s+/g, ' ').trim();
    const sanitizedPassword1 = this.password.replace(/[^a-zA-ZÀ-ž\s']/g, '');
    this.password = sanitizedPassword1.replace(/\s+/g, ' ').trim();
    const sanitizedPassword2 = this.confirmPassword.replace(/[^a-zA-ZÀ-ž\s']/g, '');
    this.confirmPassword = sanitizedPassword2.replace(/\s+/g, ' ').trim();
  }

  onSubmit(form: any): void {
    if (form.valid && !this.passwordMismatch) {
      const userData = {
        username: form.value.username,
        email: form.value.email,
        password: form.value.password,
        role: form.value.role,
      };

      // Use the new API_BASE_URL from your api.config.ts file
      this.http.post(`${API_BASE_URL}/api/users/register`, userData).subscribe(
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
