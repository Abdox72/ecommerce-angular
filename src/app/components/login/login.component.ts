import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule , CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    loginForm:FormGroup = new FormGroup({
    email: new FormControl('' , [Validators.required, Validators.email]),
    password: new FormControl('' , [Validators.required, Validators.pattern(/^[a-zA-z0-9_@&%$-.#]{6,}$/)]),
  });

  constructor(private _authService:AuthService , private _router :Router , private _toastrService:ToastrService){}

  onLoginForm(form:FormGroup):void{
    if (this.loginForm.invalid){
      this._toastrService.error('Please fill all the fields correctly');
      return;
    }
    else{
          const {email , password} = this.loginForm.value;
          this._authService.login( email , password).then((token:string | null) => {
            if (token) {
              // Store token in local storage
              localStorage.setItem('token', token);              
              // Signed in 
            this._toastrService.success('User logged in successfully');
            // Redirect to home page
            this._router.navigate(['/home']);
            }
        }).catch( (error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
          this._toastrService.error('Error while logging in user');
          console.log(errorCode , errorMessage);
        });

        //compelte
    }
  }
}
