import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
import { getAuth, updateProfile } from 'firebase/auth';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private utilService: UtilsService
  ) {}

  //========== AUTH ==============
  login(user: User) {
    return this.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  register(user: User) {
    return this.auth.createUserWithEmailAndPassword(user.email, user.password);
  }

  updateUser(user: any) {
    const auth = getAuth();
    return updateProfile(auth.currentUser, user);
  }

  getAuthState() {
    return this.auth.authState;
  }

  async signOut() {
    await this.auth.signOut();

    this.utilService.routerLink('/auth');
    localStorage.removeItem('user');
  }

  // Firebase CRUD
  getSubCollection(path: string, subCollectionName: string) {
    return this.db.doc(path).collection(subCollectionName).valueChanges({ idField: 'id' });
  }

  addToSubCollection(path: string, subCollectionName: string, object: any) {
    return this.db.doc(path).collection(subCollectionName).add(object);
  }

  updateDocument(path: string, object: any) {
    return this.db.doc(path).update(object);
  }

  deleteDocument(path: string) {
    return this.db.doc(path).delete();
  }
}
