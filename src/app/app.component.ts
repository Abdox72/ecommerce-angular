import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { AuthService } from './services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet , SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'ecommerce-angular';
  constructor(
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  async ngOnInit() {
    // This always runs, on every app load
    try {
      const user = await this.auth.handleRedirectResult();
      console.log(user);
      if (user) {
        // we got a real redirect UserCredential
        const token = await user.getIdToken();
        localStorage.setItem('token', token);
        this.toastr.success('Welcome back, ' + (user.displayName || user.email));
        this.router.navigate(['/home']);
      }
    } catch (err: any) {
      // you can still show an error toast if you like
      console.error('Redirect error', err);
      this.toastr.error('Google sign-in failed: ' + err.message);
    }
  }
}