import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { auth } from '../../../main';
import { getRedirectResult } from 'firebase/auth/cordova';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule , CommonModule ,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
    loginForm:FormGroup = new FormGroup({
    email: new FormControl('' , [Validators.required, Validators.email]),
    password: new FormControl('' , [Validators.required, Validators.pattern(/^[a-zA-z0-9_@&%$-.#]{6,}$/)]),
  });
  hostname:string = window.location.hostname;
  constructor(private _authService:AuthService , private _router :Router , private _toastrService:ToastrService){}
  ngOnInit(): void {
    getRedirectResult(auth).then((response)=>{
      console.log(response);
    }).catch((error)=>{
      console.log(error);
    });;
  }

  onLoginForm(form:FormGroup):void{
    if (this.loginForm.invalid){
      this._toastrService.error('Please fill all the fields correctly');
      return;
    }
    else{
          const {email , password} = this.loginForm.value;
          this._authService.login( email , password).then((result:any) => {
            if (result.success) {
              // Store token in local storage
              localStorage.setItem('token', result.token);              
              // Signed in 
            this._toastrService.success(result.success);
            // Redirect to home page
            this._router.navigate(['/home']);
            }
            if(result.error){
              this._toastrService.error(result.error);
            }
        }).catch( (error) => {
          // ..
          this._toastrService.error(error);
        });
    }
  }

  async signInWithgooglePopup() {
    try {
      const user = await this._authService.signInWithGooglePopup();
      if (user) {
        // Store token in local storage
        localStorage.setItem('token', await user.getIdToken());              
          // Signed in 
        this._toastrService.success('User logged in successfully');
        // Redirect to home page
        this._router.navigate(['/home']);
      }
      console.log(user);
    } catch (error) {
      console.log(error);
    }
  }
  async signInWithgoogleRedirect() {
    try {
      await this._authService.signInwithgoogleRedirect();
    } catch (error:any) {
      this._toastrService.error('Error while logging in with Google Auth: ' + error?.message);
    }
  }

}
