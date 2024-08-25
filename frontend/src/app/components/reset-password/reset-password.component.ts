import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit{
  token: string = '';
  message: string = '';

  constructor(private route: ActivatedRoute, private http:HttpClient,
    private router:Router) {}

    ngOnInit(): void {
      //Extract the reset token from the query parameters
      this.token = this.route.snapshot.queryParams['token'];
    }

    onSubmit(form: any): void {
      if (form.valid) {
        const newPassword = form.value.newPassword;
        const confirmPassword = form.value.confirmPassword;

        //Check if passwords match
        if (newPassword !== confirmPassword) {
          this.message = 'Passwords do not match!';
          return;
        }

        //Send the new password and token to the backend
        this.http.post('http://localhost:3000/api/users/reset-password', {
          token: this.token,
          newPassword: newPassword
        }).subscribe(
          (response: any) => {
            this.message = 'Password has been reset successfully!';
            //Redirect to login page after a successful reset
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000);
          },
          (error) => {
            this.message = 'Failed to reset password.';
            console.error(error);
          }
        )
      }
    }

}
