import { Injectable } from '@angular/core';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, confirmPasswordReset, sendEmailVerification,getRedirectResult, signInWithRedirect, getAuth } from "firebase/auth";
import {auth , db} from '../../main';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { User as IUser } from '../interfaces/user';
import { BehaviorSubject, Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user$ = new BehaviorSubject<User | null>(null);
  private googleProvider = new GoogleAuthProvider();

  constructor() {
    onAuthStateChanged(auth, (user) => {
      this.user$.next(user);
    });
  }

  async registerUser(usr:IUser): Promise<any> {
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, usr.email, usr.password);
      await sendEmailVerification(userCredential.user);
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
      return {success:'Verification email sent. Please check your inbox.'};
    } catch (_error:any) {
      return {error : _error?.message};  // Registration failed
    }
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // if (!userCredential.user.emailVerified) {
      //   throw new Error('Please verify your email before signing in.');
      // }
      return {success:"Logged in successfully." , token:await userCredential.user.getIdToken()};
    } catch (error:any) {
      return {error : error?.message}; // Registration failed
    }
  }
  async logout() {
    await signOut(auth);
    localStorage.removeItem('token');
  }

  getCurrentUser(): Observable<User | null> {
    return this.user$.asObservable();
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    return sendPasswordResetEmail(auth, email);
  }

  async confirmPasswordReset(oobCode: string, newPassword: string): Promise<void> {
    return confirmPasswordReset(auth, oobCode, newPassword);
  }

    // Google Sign-In popup
    async signInWithGooglePopup() {
      try {
        const result = await signInWithPopup(auth, this.googleProvider);
        return result.user;
      } catch (error) {
        console.error('Google sign-in error:', error);
        throw error;
      }
    }

    // Google Sign-In
    async signInwithgoogleRedirect(){
      this.googleProvider.setCustomParameters({  
        prompt: "select_account"
      });
      await signInWithRedirect(auth, this.googleProvider);
    }
    async getGoogleRedirectResult() : Promise<any> {
      getRedirectResult(auth)
      .then((result) => {
        if(result){
          return {sucess:'signed in successfully' , result}
        }else{
          return{error: 'Google sign-in error' , result:null}
        }
      }).catch((error) => {
        return{error: error.message , result:null}
      });
    }
  
}
