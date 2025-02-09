import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../menu/menu.model';
import { CategoryItemComponent } from './category-item/category-item.component';
import { OrderItem } from '@shared/types/order.model';

@Component({
    selector: 'app-category',
    standalone: true,
    imports: [CategoryItemComponent],
    templateUrl: './category.component.html',
    styleUrl: './category.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent {
  @Input({ required: true }) category!: Category;
  @Output() itemPreviewed = new EventEmitter<OrderItem>();
  @Output() itemSelected = new EventEmitter<OrderItem>();
}
