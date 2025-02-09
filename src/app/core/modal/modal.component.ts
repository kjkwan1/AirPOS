import {
  Component,
  Input,
  Injector,
  ComponentRef,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent<TProps = any, TResult = any> implements OnInit, OnDestroy {
  @Input() component!: { new(...args: any[]): ModalView<TProps, TResult> };
  @Input() config!: ModalConfig<TProps>;
  @Output() closeModal = new EventEmitter<TResult>();

  modalInjector = Injector.NULL;
  private subscription = new Subscription();
  private componentRef?: ComponentRef<ModalView<TProps, TResult>>;

  constructor(private modalService: ModalService, private injector: Injector) { }

  ngOnInit(): void {
    this.modalInjector = Injector.create({
      providers: [
        { provide: 'modalConfig', useValue: this.config }
      ],
      parent: this.injector,
    });

    this.subscription.add(
      this.componentRef?.instance.close.subscribe((result: TResult) => {
        this.closeModal.emit(result);
      })
    );
  }

  close(): void {
    this.modalService.close();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}