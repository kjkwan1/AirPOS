import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[tap]',
  standalone: true
})
export class TapDirective {
  @Input() tapDelay = 200;
  @Output() doubleTap = new EventEmitter<void>();
  @Output() singleTap = new EventEmitter<void>();

  private lastTapped = 0;
  private tapTimeout: any;

  @HostListener('click', ['$event'])
  onTap() {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - this.lastTapped;

    clearTimeout(this.tapTimeout);

    if (tapLength < this.tapDelay) {
      this.doubleTap.emit();
    } else {
      this.lastTapped = currentTime;
      this.tapTimeout = setTimeout(() => {
        if (this.lastTapped === currentTime) {
          this.singleTap.emit();
          this.lastTapped = 0;
        }
      }, this.tapDelay);
    }
  }

  constructor() { }

}
