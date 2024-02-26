import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user = {} as User;
  userSubscription: Subscription;

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    dateOfBirth: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
  });

  constructor(
    private firebaseService: FirebaseService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    null;
  }

  ionViewWillEnter() {
    this.getUserLocalStorage();

    this.form.setValue({
      name: this.user.name,
      email: this.user.email,
      dateOfBirth: this.user.dateOfBirth,
      country: this.user.country,
    });

    this.setUserCreationDate();
  }

  private setUserCreationDate() {
    this.firebaseService.getUserCreationDate().then(async (res) => {
      const dateCreationInput = document.getElementById('dateCreation') as HTMLInputElement;
      dateCreationInput.value = res;
    });
  }

  getUserLocalStorage() {
    this.user = this.utilsService.getElementFromLocalStorage('user');
  }

  submit() {
    if (this.form.valid) {
      return this.updateUser();
    }
    console.log('Form is invalid');
  }

  // Update user
  updateUser() {
    let path = `Users/${this.user.uid}`;
    this.utilsService.presentLoading();

    let updatedUserProfile = {
      ...this.form.value,
      uid: this.user.uid
    };

    this.firebaseService
      .updateDocument(path, updatedUserProfile)
      .then(
        (res) => {
          this.utilsService.dismissLoading();
          this.utilsService.presentToast({
            message: 'User updated successfully',
            duration: 1500,
            color: 'primary',
            icon: 'person-outline',
          });
          this.form.updateValueAndValidity();

          this.firebaseService.updateUser({
            displayName: this.form.value.name,
          });
          console.log(this.form.value);
          this.utilsService.setElementFromLocalStorage('user', updatedUserProfile);
        },
        (err) => {
          this.utilsService.dismissLoading();
          console.log(err);

          this.utilsService.presentToast({
            message: 'There was an error updating the user',
            duration: 1500,
            color: 'danger',
            icon: 'alert-circle-outline',
          });
        }
      )
  }

  signOut() {
    this.utilsService.presentAlert({
      header: 'Log out',
      message: 'Do you want to end the session?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Yes, log out',
          handler: () => {
            this.firebaseService.signOut();
          },
        },
      ],
    });
  }
}
