import { ChangeDetectionStrategy, Component, EventEmitter, Input } from '@angular/core';
import { ModalView, ModalViewAbstract } from '@core/modal/modal.type';
import { OrderItem } from '@shared/types/order.model';

@Component({
  selector: 'app-item-view',
  standalone: true,
  imports: [],
  templateUrl: './item-view.component.html',
  styleUrl: './item-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemViewComponent extends ModalViewAbstract {
  @Input() override props!: {
    item: OrderItem
  };

  @Input() override close: EventEmitter<any> = new EventEmitter();
}
