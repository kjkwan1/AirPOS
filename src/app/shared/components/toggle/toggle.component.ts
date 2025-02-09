import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, signal, WritableSignal } from '@angular/core';

@Component({
    selector: 'app-toggle',
    standalone: true,
    imports: [],
    templateUrl: './toggle.component.html',
    styleUrl: './toggle.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleComponent implements OnInit {
  @Input({ required: false }) state: WritableSignal<boolean> = signal(false);
  @Input({ required: false }) label = '';
  @Input({ required: false }) disabled = false;
  @Input({ required: false }) size: 'sm' | 'md' | 'lg' = 'md';
  @Input({ required: false }) id = `toggle-${Math.random().toString(36).slice(2, 11)}`;
  @Input({ required: false }) initialState?: boolean;
  @Output() toggle = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.state.set(this.initialState || false);
  }

  onClick() {
    if (this.disabled) return;
    
    const value = this.state();
    this.state.set(!value);
    this.toggle.emit(!value);
  }

  onKeyDown(event: KeyboardEvent) {
    if (this.disabled) return;
    
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onClick();
    }
  }
}
