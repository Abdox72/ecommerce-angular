import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormControlOptions, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService  } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupForm:FormGroup = new FormGroup({
    displayName: new FormControl('', [Validators.required, Validators.minLength(3) , Validators.maxLength(30)]),
    email: new FormControl('' , [Validators.required, Validators.email]),
    password: new FormControl('' , [Validators.required, Validators.pattern(/^[a-zA-z0-9_@&%$-.#]{6,}$/)]),
    confirmPassword: new FormControl('' , [Validators.required]),
    phoneNumber: new FormControl('' , [Validators.required, Validators.pattern(/^[01][0125][0-9]{9}$/)]),
    address: new FormControl(''),
    photoURL: new FormControl(''),
  } ,{validators: [this.validateConfirmPassword] } as FormControlOptions );

  constructor(private authService: AuthService , private _router: Router , private _toastrService: ToastrService){
  }
  validateConfirmPassword(formGroup:FormGroup):void{
    const pass = formGroup.get('password');
    const confirmPass = formGroup.get('confirmPassword');
    if(confirmPass?.value === ''){
      confirmPass?.setErrors({required:true});
    }else if(pass?.value !== confirmPass?.value){
      confirmPass?.setErrors({notMatched:true});
    }
  }
  onSubmitForm(form:FormGroup):void{
    if(form.valid){
      const {confirmPassword , ...FormData} = this.signupForm.value;
      FormData.photoURL = (FormData.photoURL && FormData.photoURL != '') ?
        FormData.photoURL : "assets/imgs/default-avatar-profile-icon.jpg" ;
      FormData.role = "customer";
      this.authService.registerUser(FormData).then((registered) => {
        if(registered?.success){
          this._toastrService.success('User registered successfully. Please check your inbox for verification email.');
          this._router.navigate(['/login']);
        }
        if(registered?.error){
          this._toastrService.error('Error while registering user');
        }
      }).catch((error:Error) => {
        this._toastrService.error('Error while registering user');
      });

    }else{
      this._toastrService.error('Please fill all the fields correctly');
    }
  }
}
