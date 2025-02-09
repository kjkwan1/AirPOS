import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
    selector: 'app-icon-button',
    standalone: true,
    imports: [FaIconComponent],
    templateUrl: './icon-button.component.html',
    styleUrl: './icon-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconButtonComponent {
  @Input({ required: true }) icon!: IconDefinition;
  @Output() click = new EventEmitter<void>();

  onClick() {
    this.click.emit();
  }
}
