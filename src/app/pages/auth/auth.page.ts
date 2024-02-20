import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
    private router: Router,
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

          let user: User = {
            uid: res.user.uid,
            name: res.user.displayName,
            email: res.user.email,
          };

          this.utilService.setElementFromLocalStorage('user', user);
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

          this.utilService.presentToast({
            message: error,
            duration: 5000,
            color: 'warning',
            icon: 'alert-circle-outline',
          });
        }
      );
    }
  }
}
