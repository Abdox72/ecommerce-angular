import { Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import {auth , db} from '../../main';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { User as IUser } from '../interfaces/user';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user$ = new BehaviorSubject<User | null>(null);

  constructor() {
    onAuthStateChanged(auth, (user) => {
      this.user$.next(user);
    });
  }

  async registerUser(usr:IUser): Promise<boolean> {
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, usr.email, usr.password);
      const user: User = userCredential.user;

      const { name, email, username , phoneNumber } = usr; // Destructure user data

      // Store user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        username: username,
        email: email,
        phoneNumber: phoneNumber,
        role: 'customer',
        createdAt: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      return false;  // Registration failed
    }
  }

  async login(email: string, password: string): Promise<string | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return await userCredential.user.getIdToken();
    } catch (error) {
      return null;
    }
  }
  async logout() {
    await signOut(auth);
    localStorage.removeItem('token');
  }
  getCurrentUser(): Observable<User | null> {
    return this.user$.asObservable();
  }
}
