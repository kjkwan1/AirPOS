import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, signal, SimpleChanges, WritableSignal } from '@angular/core';
import { ModalViewAbstract } from '@core/modal/modal.type';
import { OrderItem } from '@shared/types/order.model';

type QuantitySignalMap = Record<string, WritableSignal<{ qty: number; price: number }>>

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

  quantityMap: QuantitySignalMap = {};
  itemTotal = signal(0);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['props']) {
      const newValue = changes['props'].currentValue.item as OrderItem;
      this.itemTotal.set(newValue.price);
      this.quantityMap = this.createQuantityMap(newValue);
    }
  }

  increment(key: string) {
    this.quantityMap[key].update((v) => ({...v, qty: v.qty + 1}));
    this.itemTotal.set(this.itemTotal() + this.quantityMap[key]().price);
  }

  decrement(key: string) {
    if (this.quantityMap[key]().qty > 0) {
      this.quantityMap[key].update((v) => ({...v, qty: v.qty - 1}));
      this.itemTotal.set(this.itemTotal() - this.quantityMap[key]().price);
    }
  }

  getQuantity(key: string) {
    return this.quantityMap[key]();
  }

  private createQuantityMap(item: OrderItem): QuantitySignalMap {
    const childItemNames = item.childItems.map((i) => ({ name: i.name, price: i.price }));
    const modifierNames = item.modifiers.map((m) => ({ name: m.name, price: m.price }));
    const data = [...childItemNames, ...modifierNames];

    return data.reduce((acc, d) => {
      acc[d.name] = signal({ qty: 0, price: d.price });
      return acc;
    }, {} as QuantitySignalMap)
  }
}
