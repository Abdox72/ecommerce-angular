import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav-blank',
  imports: [RouterLink , RouterLinkActive],
  templateUrl: './nav-blank.component.html',
  styleUrl: './nav-blank.component.css'
})
export class NavBlankComponent {
  constructor(private auth:AuthService , private _router:Router) { }
  logout(){
    this.auth.logout().then(() => {
      this._router.navigate(['/login']);  
    });
  }
}
