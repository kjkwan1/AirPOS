import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, signal, SimpleChanges } from '@angular/core';
import { ModalView, ModalViewAbstract } from '@core/modal/modal.type';
import { OrderItem } from '@shared/types/order.model';

@Component({
  selector: 'app-item-view',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './item-view.component.html',
  styleUrl: './item-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemViewComponent extends ModalViewAbstract {
  @Input() override props!: {
    item: OrderItem
  };

  @Input() override close: EventEmitter<any> = new EventEmitter();

  quantityMap?: Record<string, { qty: number, price: number }>;
  itemTotal = signal(0);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['props']) {
      const newValue = changes['props'].currentValue.item as OrderItem;
      this.itemTotal.set(newValue.price);
      this.quantityMap = this.createQuantityMap(newValue);
    }
  }

  increment(key: string) {
    if (!this.quantityMap) {
      this.quantityMap = this.createQuantityMap(this.props.item);
    }

    this.quantityMap[key].qty++;
    this.itemTotal.set(this.itemTotal() + this.quantityMap[key].price);
  }

  decrement(key: string) {
    if (!this.quantityMap) {
      this.quantityMap = this.createQuantityMap(this.props.item);
    }

    if (this.quantityMap[key].qty > 0) {
      this.quantityMap[key].qty--;
      this.itemTotal.set(this.itemTotal() - this.quantityMap[key].price);
    }
  }

  getQuantity(key: string) {
    return this.quantityMap?.[key].qty;
  }

  private createQuantityMap(item: OrderItem): Record<string, { qty: number, price: number }> {
    const childItemNames = item.childItems.map((i) => ({ name: i.name, price: i.price }));
    const modifierNames = item.modifiers.map((m) => ({ name: m.name, price: m.price }));
    const data = [...childItemNames, ...modifierNames];

    return data.reduce((acc, d) => {
      acc[d.name] = { qty: 0, price: d.price };
      return acc;
    }, {} as Record<string, { qty: number, price: number }>)
  }
}
