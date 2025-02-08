import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { OrderItem } from '@shared/types/order.model';

@Component({
  selector: 'app-category-item',
  standalone: true,
  imports: [],
  templateUrl: './category-item.component.html',
  styleUrl: './category-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryItemComponent {
  @Input({ required: true }) item!: OrderItem
}
