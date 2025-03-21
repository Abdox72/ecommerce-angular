import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NavAuthComponent } from '../../components/nav-auth/nav-auth.component';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, RouterLink , RouterLinkActive, NavAuthComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css',
})
export class AuthLayoutComponent {

}
