import { ApplicationRef, ComponentRef, createComponent, Injectable, signal, TemplateRef, Type } from '@angular/core';
import { ModalComponent } from './modal.component';
import { ModalConfig, ModalParams, ModalViewAbstract } from './modal.type';
import { Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modalViewRef?: ComponentRef<any>;
  private modalResolver?: (result: any) => void;
  private subscription = new Subscription();

  public isOpen = signal(false);

  constructor(private appRef: ApplicationRef) { }

  public open<View extends ModalViewAbstract<Props, Result>, Props = any, Result = any>(
    view: Type<View>,
    config: Omit<ModalConfig<Props>, 'params'> & { params?: ModalParams }
  ): Promise<Result> {
    return new Promise<Result>((resolve) => {
      this.modalResolver = resolve;

      this.modalViewRef = createComponent(ModalComponent, {
        elementInjector: this.appRef.injector,
        environmentInjector: this.appRef.injector
      });

      const fullConfig: ModalConfig<Props> = {
        ...config,
        params: {
          ...config.params,
          footerButtons: [
            ...(config.params?.footerButtons || []),
          ]
        }
      };

      this.modalViewRef.setInput('component', view);
      this.modalViewRef.setInput('config', fullConfig);

      const componentInstance = this.modalViewRef.instance as ModalComponent<Props, Result>;

      this.subscription.add(
        componentInstance.closeModal.subscribe((result: Result) => {
          this.close(result);
        })
      );

      this.appRef.attachView(this.modalViewRef.hostView);
      const element = this.modalViewRef.location.nativeElement as HTMLElement;
      document.body.appendChild(element);

      this.isOpen.set(true);
    });
  }

  public close(data?: any) {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = new Subscription();
    }

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

interface ModalContext<T> {
  $implicit: {
    close: (result: T) => any;
  };
  [key: string]: any;
}