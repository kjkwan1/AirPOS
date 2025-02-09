import { ApplicationRef, ComponentRef, createComponent, Injectable, signal, ViewContainerRef } from '@angular/core';
import { ModalComponent } from './modal.component';
import { ModalConfig } from './modal.type';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalRef: ComponentRef<ModalComponent<any>> | null = null;

  public readonly isOpen = signal(false);

  constructor(private appRef: ApplicationRef) { }

  open<T>(config: ModalConfig<T>): Promise<T | null> {
    return new Promise<T | null>((resolve, reject) => {
      if (this.modalRef) {
        return reject(new Error('Modal is already open!'));
      }

      this.modalRef = createComponent(ModalComponent<T>, {
        environmentInjector: this.appRef.injector
      });
      this.modalRef.instance.config = config;
      this.modalRef.instance.onClose = (payload: T) => {
        resolve(payload);
        this.close();
      };
      this.modalRef.instance.onCancel = () => {
        resolve(null);
        this.close();
      }

      this.appRef.attachView(this.modalRef.hostView);
      const el = this.modalRef.location.nativeElement;
      document.body.appendChild(el);

      this.isOpen.set(true);
    })
  }

  private close() {
    if (this.modalRef) {
      this.modalRef.destroy();
      this.modalRef = null;
      this.isOpen.set(false);
    }
  }
}
