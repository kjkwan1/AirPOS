import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { OrderItem } from '@shared/types/order.model';
import { ModalView } from '../modal.type';

@Component({
  selector: 'app-item-view',
  imports: [],
  templateUrl: './item-view.component.html',
  styleUrl: './item-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemViewComponent implements ModalView<OrderItem> {
  @Input() set item(orderItem: OrderItem) {
    console.log('order item was set: ', orderItem);
  }

  close(payload: OrderItem) {

  }
  cancel?: (() => void) | undefined;
}
