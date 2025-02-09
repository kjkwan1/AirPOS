import { AsyncPipe } from '@angular/common';
import { Component, computed, OnInit, Signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthenticationService } from '@core/auth/authentication.service';
import { FooterComponent } from '@core/layout/footer/footer.component';
import { HeaderComponent } from '@core/layout/header/header.component';
import { ModalComponent } from '@core/modal/modal.component';
import { ModalService } from '@core/modal/modal.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, AsyncPipe, ModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(
    private authService: AuthenticationService,
    private modalService: ModalService
  ) {
  }

  isAuthenticated$ = this.authService.isAuthenticated$;
  isOpen: Signal<boolean> = this.modalService.isOpen;
}
