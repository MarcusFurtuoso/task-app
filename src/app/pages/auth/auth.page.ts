import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
  ) {}

  ngOnInit(): void {
    null;
  }

  submit(): void {
    if (this.form.valid) {
      console.log(this.form.value);
      // this.router.navigate(['']);
      return;
    }
    console.log('Please provide all the required values!');
  }

}
