import { collection, doc, addDoc, getDocs, getDoc, query, where, updateDoc, deleteDoc, limit as _limit,orderBy } from "firebase/firestore";
import { db } from "../../main"; 
import { Injectable } from "@angular/core";

@Injectable({
  providedIn:"root"
})
export class FirestoreService {
  constructor() {}

  
  async addData(collectionName:string, data:any) : Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      console.log("Document written with ID: ", docRef.id);
      return docRef.id;
    } catch (e) {
      console.error("Error adding document: ", e);
      return null;
    }
  }
  
  async  getData(collectionName:string) : Promise<any[]> {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const results:any[] = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    }); 
    return results ;
  }
  
  async  getDocument(collectionName:string, documentId:string): Promise<any> {
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() };
      } else {
          console.log("No such document!");
          return null;
      }
  }
  
  async  queryData(collectionName:string, field:string, operator:any, value:any) : Promise<any[]> {
    // Ensure the operator is a valid Firestore operator
    try {
      const q = query(collection(db, collectionName), where(field, operator, value));
      const querySnapshot = await getDocs(q);
      const results:any[] = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      return results;
    } catch (e) {
      console.error("Error querying document: ", e);
      return [];
    }
  }
  
  async  updateDocument(collectionName:string, documentId:string, newData:any) : Promise<boolean> {
    // Ensure the document ID is valid and the new data is an object
  
    if (!documentId || typeof newData !== "object") {
      console.error("Invalid document ID or new data");
      return false;
    }
    
    const docRef = doc(db, collectionName, documentId);
    try {
      await updateDoc(docRef, newData);
      console.log("Document updated successfully");
      return true;
    } catch (e) {
      console.error("Error updating document: ", e);
      return false;
    }
  }
  
  async  deleteDocument(collectionName:string, documentId:string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, collectionName, documentId));
      console.log("Document deleted successfully");
      return true;
    } catch (e) {
      console.error("Error deleting document: ", e);
      return false;
    }
  }
  async  getDocumentById(collectionName:string, documentId:string): Promise<any> {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No such document!");
      return null;
    }
  }
  async  getDocumentByField(collectionName:string, field:string, value:any): Promise<any[]> {
    const q = query(collection(db, collectionName), where(field, "==", value));
    const querySnapshot = await getDocs(q);
    const results:any[] = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
    return results;
  }
  async  getDocumentByFieldWithLimit(collectionName:string, field:string, value:any, limit:number): Promise<any[]> {
    const q = query(collection(db, collectionName), where(field, "==", value), _limit(limit));
    const querySnapshot = await getDocs(q);
    const results:any[] = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
    return results;
  }
  async  getDocumentByFieldWithLimitAndOrder(collectionName:string, field:string, value:any, limit:number, orderByField:string): Promise<any[]> {
    const q = query(collection(db, collectionName), where(field, "==", value), _limit(limit), orderBy(orderByField));
    const querySnapshot = await getDocs(q);
    const results:any[] = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
    return results;
  }
}
