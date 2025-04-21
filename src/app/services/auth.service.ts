import { Injectable } from '@angular/core';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, confirmPasswordReset, sendEmailVerification,getRedirectResult, signInWithRedirect, getAuth ,updateProfile ,updatePhoneNumber  } from "firebase/auth";
import {auth , db} from '../../main';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { User as IUser, UserLogin } from '../interfaces/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user$ = new BehaviorSubject<User | null>(null);
  private googleProvider = new GoogleAuthProvider();

  constructor(private firestoreService:FirestoreService) {
    onAuthStateChanged(auth, (user) => {
      this.user$.next(user);
    });
  }

  async registerUser(usr:IUser): Promise<any> {
    try {
      // Create user in Firebase Authentication
      const {password , ...userData} = usr; // Destructure user data
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);
      const user: User = userCredential.user;
      await updateProfile(user, {
        displayName: userData.displayName,
        photoURL: userData.photoURL,
      });
      // Store user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
          role: userData.role||"customer",
          phoneNumber:userData.phoneNumber || "",
          address:userData.Address || ""
      });
      await sendEmailVerification(userCredential.user);
      return {success:'Verification email sent. Please check your inbox.'};
    } catch (_error:any) {
      return {error : _error?.message};  // Registration failed
    }
  }

  async login(userLogin:UserLogin): Promise<any> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, userLogin.email, userLogin.password);
      // userCredential.user.displayName = user.displayName;
      // if (!userCredential.user.emailVerified) {
      //   throw new Error('Please verify your email before signing in.');
      // }
      return {success:"Logged in successfully." , token: await userCredential.user.getIdToken()};
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
        const result = await signInWithPopup(auth, this.googleProvider);
        return result.user;
    }

    // Google Sign-In
    async signInwithgoogleRedirect(){
      await signInWithRedirect(auth, this.googleProvider);
    }
}
