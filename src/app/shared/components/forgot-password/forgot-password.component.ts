import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(
    private firebaseService: FirebaseService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {}

  async sendPasswordResetEmail() {
    if (this.form.valid) {
      console.log(this.form.value.email);
      await this.firebaseService
        .sendPasswordResetEmail(this.form.value.email)
        .then(
          (res) => {
            console.log(res);
            console.log('Password reset email sent');

            this.utilsService.presentToast({
              message: `Password reset email sent!`,
              duration: 1500,
              color: 'primary',
              icon: 'mail-outline',
            });
          },
          (error) => {
            console.log(error);

            this.utilsService.presentToast({
              message: 'Error sending password reset email!',
              duration: 5000,
              color: 'danger',
              icon: 'alert-circle-outline',
            });
          }
        );
    }
  }
}
