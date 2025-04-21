import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from 'firebase/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-blank',
  imports: [RouterLink , RouterLinkActive , CommonModule],
  templateUrl: './nav-blank.component.html',
  styleUrl: './nav-blank.component.css'
})
export class NavBlankComponent implements OnInit {
  usernme?: string|null;
  imgurl?: string|null;
  constructor(private auth:AuthService , private _router:Router) { }
  logout(){
    this.auth.logout().then(() => {
      this._router.navigate(['/login']);  
    });
  }
  ngOnInit(): void {
      this.auth.getCurrentUser().subscribe(user => {
        this.usernme = user?.displayName;
        this.imgurl = user?.photoURL || "assets/imgs/default-avatar-profile-icon.jpg";
      });
  }
}
