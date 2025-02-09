import {
  Component,
  Input,
  Injector,
  ComponentRef,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ModalConfig, ModalView } from './modal.type';
import { ModalService } from './modal.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent<TProps = any> implements OnInit, OnDestroy {
  @Input() component!: { new(...args: any[]): ModalView<TProps> };
  @Input() config!: ModalConfig<TProps>;

  modalInjector = Injector.NULL;

  private subscription = new Subscription();

  constructor(private modalService: ModalService, private injector: Injector) { }

  ngOnInit(): void {
    this.modalInjector = Injector.create({
      providers: [{ provide: 'modalConfig', useValue: this.config }],
      parent: this.injector,
    });
  }

  onComponentLoaded(componentRef: ComponentRef<ModalView<TProps>>): void {
    if (componentRef.instance?.close) {
      const sub = componentRef.instance.close.subscribe((result: any) => {
        this.handleClose(result);
      });
      this.subscription.add(sub);
    }
  }

  handleClose(result: any): void {
    this.modalService.close(result);
  }

  close(): void {
    this.modalService.close();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}