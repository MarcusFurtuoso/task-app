import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CustomValidators } from 'src/app/utils/custom-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl(''),
  });

  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private utilService: UtilsService
  ) {}

  ngOnInit(): void {
    this.confirmPasswordValidator();
  }

  confirmPasswordValidator() {
    this.form.controls.confirmPassword.setValidators([
      Validators.required,
      CustomValidators.matchValues(this.form.controls.password),
    ]);

    this.form.controls.confirmPassword.updateValueAndValidity();
  }

  submit(): void {
    if (this.form.valid) {
      this.utilService.presentLoading({ message: 'Registering...' })

      this.firebaseService.register(this.form.value as User).then(
        async (res) => {
          console.log(res);

          await this.firebaseService.updateUser({
            displayName: this.form.value.name,
          });

          let user: User = {
            uid: res.user.uid,
            name: res.user.displayName,
            email: res.user.email,
          };

          this.utilService.setElementFromLocalStorage('user', user);
          this.utilService.routerLink('/tabs/home');
          this.utilService.dismissLoading();

          this.utilService.presentToast({
            message: `Registration successful ${user.name}!`,
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
