import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
import { getAuth, updateProfile } from 'firebase/auth';
import { UtilsService } from './utils.service';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private userCollection = this.db.collection<User>('Users');

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private utilService: UtilsService
  ) {}

  //========== AUTH ==============
  login(user: User) {
    return this.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  async register(user: User) {
    const newUser = await this.auth.createUserWithEmailAndPassword(user.email, user.password);

    const newUserObject = Object.assign({}, user);

    delete newUserObject.password;

    await this.db.collection('Users').doc(newUser.user.uid).set(newUserObject);
    console.log('Cadastro efetuado com sucesso!');
    return newUser;
  }

  updateUser(user: any) {
    const auth = getAuth();
    return updateProfile(auth.currentUser, user);
  }

  async getUserCreationDate() {
    return this.auth.currentUser.then((user) => {
      return user.metadata.creationTime;
    });
  }

  getUserAttributes() {
    return this.userCollection.snapshotChanges().pipe(
      map((actions) => {
        return actions.map((a) => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getAuthState() {
    return this.auth.authState;
  }

  async signOut() {
    await this.auth.signOut();

    this.utilService.routerLink('/auth');
    localStorage.removeItem('user');
  }

  getUser(id: string) {
    return this.userCollection.doc<User>(id).valueChanges();
  }

  // Firebase CRUD
  getSubCollection(path: string, subCollectionName: string) {
    return this.db
      .doc(path)
      .collection(subCollectionName)
      .valueChanges({ idField: 'id' });
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
