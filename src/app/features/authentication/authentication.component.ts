import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '@core/auth/authentication.service';
import { NavigationService } from '@core/services/navigation.service';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthenticationComponent {
  constructor(
    private authService: AuthenticationService,
    private navigationService: NavigationService
  ) {

  }

  formGroup = new FormGroup({
    username: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(6)])
  });

  async submit() {
    const usernameFormControl = this.formGroup.get('username')!;
    const passwordFormControl = this.formGroup.get('password')!;
    const username = usernameFormControl.value!;
    const password = passwordFormControl.value!;

    const result = await this.authService.authenticate(username, password);

    if (!result) {
      console.error('auth failed');
      return;
    }

    this.navigationService.navigateToOrderEntry();
  }
}
