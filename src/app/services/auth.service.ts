import { Injectable } from '@angular/core';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, confirmPasswordReset, sendEmailVerification, signInWithRedirect, getRedirectResult, updateProfile  } from "firebase/auth";
import {auth , db} from '../../main';
import { doc, setDoc } from 'firebase/firestore';
import { User as IUser, UserLogin } from '../interfaces/user';
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

  async handleRedirectResult(): Promise<User|null> {
    try {
      console.log('Checking Firebase redirect result…');
      const result = await getRedirectResult(auth);
      console.log('Raw redirect result', result);

      if (result?.user) {
        const user = result.user;
        // merge your Firestore profile if you like
        await setDoc(doc(db, 'users', user.uid), {
          role: 'customer',
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }, { merge: true });
        return user;
      }
      return null;
    } catch (e: any) {
      console.error('Error during getRedirectResult:', e);
      throw e;
    }
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
      if (!userCredential.user.emailVerified) {
        throw new Error('Please verify your email before signing in.');
      }
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
        try {
          const provider = new GoogleAuthProvider();
          provider.setCustomParameters({ prompt: 'select_account' });
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            // Store user data in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                role: "customer",
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
            }, { merge: true });
            return user;
        } catch (error) {
            console.error('Error signing in with Google:', error);
            throw error;
        }
    }

    // Google Sign-In with redirect
    async signInwithgoogleRedirect() {
        try {
            // Initiate new redirect
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ prompt: 'select_account' });
            await signInWithRedirect(auth, provider);

        } catch (error) {
            console.error('Error initiating Google sign-in redirect:', error);
            throw error;
        }
    }
}
