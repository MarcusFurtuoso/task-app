import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  @Input() title: string;
  @Input() backButton: string;
  @Input() isModal: boolean;
  @Input() color: string;
  @Input() centerTitle: boolean;


  darkMode: BehaviorSubject<boolean>;

  constructor(private themeService: ThemeService) { }

  ngOnInit() {
    this.darkMode = this.themeService.darkMode;
  }

  setTheme(darkmode: boolean) {
    this.themeService.setTheme(darkmode);
  }

}
