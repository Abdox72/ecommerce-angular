import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav-blank',
  imports: [RouterLink , RouterLinkActive],
  templateUrl: './nav-blank.component.html',
  styleUrl: './nav-blank.component.css'
})
export class NavBlankComponent {
  constructor(private auth:AuthService) { }
  logout(){
    this.auth.logoutUser();
  }
}
