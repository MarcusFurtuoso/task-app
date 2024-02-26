import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, tap } from 'rxjs';
import { User } from 'src/app/models/user.model';

import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private firebaseService: FirebaseService,
    private utilService: UtilsService
  ) {}

  ngOnInit(): void {
    null;
  }

  submit(): void {
    if (this.form.valid) {
      this.utilService.presentLoading({ message: 'Authenticating...' });

      this.firebaseService.login(this.form.value as User).then(
        async (res) => {
          console.log(res);

          this.firebaseService
            .getUser(res.user.uid)
            .pipe(
              map((user) => {
                return {
                  dateOfBirth: user.dateOfBirth,
                  country: user.country,
                };
              })
            )
            .subscribe((userAttributes) => {
              let user: User = {
                uid: res.user.uid,
                name: res.user.displayName,
                email: res.user.email,
                dateOfBirth: userAttributes.dateOfBirth,
                country: userAttributes.country,
              };

              this.utilService.setElementFromLocalStorage('user', user);
            });

          this.utilService.routerLink('/tabs/home');
          this.utilService.dismissLoading();

          this.utilService.presentToast({
            message: `Login successfully!`,
            duration: 1500,
            color: 'primary',
            icon: 'person-outline',
          });

          this.form.reset();
        },
        (error) => {
          this.utilService.dismissLoading();

          console.log(error);

          this.utilService.presentToast({
            message: 'Error when authenticating',
            duration: 5000,
            color: 'danger',
            icon: 'alert-circle-outline',
          });
        }
      );
    }
  }
}
