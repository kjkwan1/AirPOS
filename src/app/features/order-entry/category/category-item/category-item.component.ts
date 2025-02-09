import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TapDirective } from '@shared/directives/tap.directive';
import { OrderItem } from '@shared/types/order.model';

@Component({
    selector: 'app-category-item',
    standalone: true,
    imports: [TapDirective],
    templateUrl: './category-item.component.html',
    styleUrl: './category-item.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryItemComponent {
  @Input({ required: true }) item!: OrderItem
  @Output() doubleTap = new EventEmitter<OrderItem>();
  @Output() tap = new EventEmitter<OrderItem>();

  onDoubleTap() {
    this.doubleTap.emit(this.item);
  }

  onSingleTap() {
    this.tap.emit(this.item);
  }
}
