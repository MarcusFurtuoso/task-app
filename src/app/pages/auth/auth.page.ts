import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, tap } from 'rxjs';
import { User } from 'src/app/models/user.model';

import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ForgotPasswordComponent } from 'src/app/shared/components/forgot-password/forgot-password.component';

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
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    null;
  }

  loginWithGoogle() {
    this.firebaseService.loginWithGoogle();
  }

  submit(): void {
    if (this.form.valid) {
      this.utilsService.presentLoading({ message: 'Authenticating...' });

      this.firebaseService.login(this.form.value as User).then(
        async (res) => {
          console.log(res);

          this.firebaseService
            .getUser(res.user.uid)
            .pipe(
              map((user) => {
                return {
                  ... user,
                  dateOfBirth: user.dateOfBirth,
                  country: user.country,
                };
              }),
              tap((user) => {
                this.utilsService.setElementFromLocalStorage('user', user);
              })
            )
            .subscribe();

          this.utilsService.routerLink('/tabs/home');
          this.utilsService.dismissLoading();

          this.utilsService.presentToast({
            message: `Login successfully!`,
            duration: 1500,
            color: 'primary',
            icon: 'person-outline',
          });

          this.form.reset();
        },
        (error) => {
          this.utilsService.dismissLoading();

          console.log(error);

          this.utilsService.presentToast({
            message: 'Error when authenticating!',
            duration: 5000,
            color: 'danger',
            icon: 'alert-circle-outline',
          });
        }
      );
    }
  }
}
