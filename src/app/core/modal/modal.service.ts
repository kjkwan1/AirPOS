import { ApplicationRef, ComponentRef, createComponent, Injectable, signal, Type } from '@angular/core';
import { ModalComponent } from './modal.component';
import { ModalViewAbstract } from './modal.type';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalViewRef?: ComponentRef<any>;
  private modalResolver?: (result: any) => void;

  public isOpen = signal(false);

  constructor(
    private appRef: ApplicationRef
  ) { }

public open<View extends ModalViewAbstract, Payload>(view: Type<View>, config: View): Promise<Payload> {
  return new Promise<Payload>((resolve) => {
    this.modalResolver = resolve;
    
    this.modalViewRef = createComponent(ModalComponent, { elementInjector: this.appRef.injector, environmentInjector: this.appRef.injector });
    this.modalViewRef.setInput('component', view);
    this.modalViewRef.setInput('config', config);

    this.appRef.attachView(this.modalViewRef.hostView);
    const element = this.modalViewRef.location.nativeElement as HTMLElement;
    document.body.appendChild(element);
    this.modalViewRef.changeDetectorRef.detectChanges();

    this.isOpen.set(true);
  });
}

  public close(data?: any) {
    if (this.modalViewRef) {
      this.appRef.detachView(this.modalViewRef.hostView);
      this.modalViewRef.destroy();
      this.modalViewRef = undefined;
    }

    if (this.modalResolver) {
      this.modalResolver(data);
      this.modalResolver = undefined;
    }

    this.isOpen.set(false);
  }

}
