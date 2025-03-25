import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, UserLogin } from '../interfaces/user';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = 'http://localhost:3000/users';
  constructor(private _httpClient : HttpClient , private router: Router) {
  }

    // Check if user exists by email
  checkUserExists(email: string): Observable<boolean> {
      return this._httpClient.get<User[]>(this.apiUrl).pipe(
        map( (users:User[]) => users.some(user => user.email === email))
      );
  }
  registerUser(user:User):Observable<any>{
    return this._httpClient.post(this.apiUrl,user);
  }
  loginUser(user:UserLogin):Observable<any>{
    return this._httpClient.get<User[]>(`${this.apiUrl}?email=${user.email}&password=${user.password}`).pipe(
      map(users => {
        if (users.length > 0) {
          return users[0];
        } else {
          throw new Error('Invalid credentials');
        }
      })
    );
  }
  logoutUser():void{
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
