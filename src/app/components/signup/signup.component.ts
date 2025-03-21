import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormControlOptions, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupForm:FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3) , Validators.maxLength(30)]),
    email: new FormControl('' , [Validators.required, Validators.email]),
    password: new FormControl('' , [Validators.required, Validators.pattern(/^[a-zA-z0-9_@&%]{6,}$/)]),
    confirmPassword: new FormControl(''),
    phoneNumber: new FormControl('' , [Validators.required, Validators.pattern(/^[01][0125][0-9]{9}$/)])
  } ,{validators: [this.validateConfirmPassword] } as FormControlOptions );

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
    console.log(form.invalid);
    console.log(form);
    console.log(form.errors);
  }
}
