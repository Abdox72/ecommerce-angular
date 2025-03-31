import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { initializeApp } from "firebase/app";
import { environment } from "./environments/environment";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));


const firebaseApp = initializeApp(environment.firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
export { auth , db ,storage };