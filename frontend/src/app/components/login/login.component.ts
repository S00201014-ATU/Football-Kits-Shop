import { error } from 'console';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private http:HttpClient, private router:Router){}

  onSubmit(form:any): void {
    if (form.valid) {
      const loginData = {
        username: form.value.username,
        password: form.value.password,
      };

      this.http.post('http://localhost:3000/api/users/login', loginData).subscribe(
        (response: any) => {
          alert('Login successful!');
          //Save the token
          localStorage.setItem('token', response.token);
          this.router.navigate(['/']);
        },
        (error) => {
          alert('Login failed: ' + error.error.message);
        }
      )
    }
  }

}
