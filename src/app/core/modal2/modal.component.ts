import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalConfig } from './modal.type';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent<T> implements OnInit {
  @ViewChild('modalContent', { read: ViewContainerRef, static: true })
  modalContent!: ViewContainerRef;

  config!: ModalConfig<T>;
  onClose!: (payload: T) => void;
  onCancel!: () => void;

  ngOnInit(): void {
    const componentRef = this.modalContent.createComponent(this.config.view);

    if (this.config.inputs) {
      for (const [key, value] of Object.entries(this.config.inputs)) {
        componentRef.setInput(key, value);
      }
    }
  }

  onBackgroundClick() {
    if (this.onCancel) {
      this.onCancel();
    }
  }
}
