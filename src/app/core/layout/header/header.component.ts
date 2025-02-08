import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ThemeService } from '@core/services/theme.service';
import { ToggleComponent } from '@shared/components/toggle/toggle.component';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { IconButtonComponent } from "../../../shared/components/icon-button/icon-button.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ToggleComponent, IconButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  readonly cartIcon = faCartShopping;

  theme: boolean;

  constructor(private themeService: ThemeService) {
    this.theme = themeService.getTheme()() === 'light'
      ? false
      : true;
  }

  onToggleTheme(state: boolean) {
    if (state) {
      this.themeService.setTheme('dark');
    } else {
      this.themeService.setTheme('light');
    }
  }
}
