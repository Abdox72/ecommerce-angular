import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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
    name: new FormControl('', [Validators.required, Validators.minLength(3) , Validators.maxLength(30)]),
    username: new FormControl('' , [Validators.required, Validators.minLength(3) , Validators.maxLength(20)]),
    email: new FormControl('' , [Validators.required, Validators.email]),
    password: new FormControl('' , [Validators.required, Validators.pattern(/^[a-zA-z0-9_@&%$-.#]{6,}$/)]),
    confirmPassword: new FormControl(''),
    phoneNumber: new FormControl('' , [Validators.required, Validators.pattern(/^[01][0125][0-9]{9}$/)])
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
      this.authService.checkUserExists(form.get('email')?.value).subscribe({
        next: (userExist) => {
          if (userExist){
            this._toastrService.error('User already exists with this email');
          }
          else {
            const {confirmPassword , ...usrData} = form.value;
            this.authService.registerUser(usrData).subscribe({
              next: (response) => {
                this._toastrService.success('User registered successfully');
                console.log(response);
                this._router.navigate(['/login']);
              },
              error: (error) => {
                this._toastrService.error('Error while registering user');
                console.log(error);
              }
            });
          }
        }
      });
    } else{
      this._toastrService.error('Please fill all the fields correctly');
    }
  }
}
