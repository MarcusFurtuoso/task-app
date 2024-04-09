import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription, tap } from 'rxjs';
import { ThemeService } from 'src/app/services/theme.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
})
export class CustomInputComponent implements OnInit {
  @Input() control: FormControl;
  @Input() label: string;
  @Input() icon: string;
  @Input() type: string;
  @Input() autocomplete: string;

  isPassword: boolean;
  hide: boolean = true;
  darkMode: boolean;

  constructor(
    private themeService: ThemeService,
  ) {}

  ngOnInit(): void {
    if (this.type == 'password') this.isPassword = true;
    this.themeService.darkMode.pipe(
      tap((darkMode) => {
        this.darkMode = darkMode;
      })
    ).subscribe();
  }

  showOrHidePassword() {
    this.hide = !this.hide;

    if(this.hide) {
      this.type = 'password';
      return;
    }
    this.type = 'text';
  }
}
