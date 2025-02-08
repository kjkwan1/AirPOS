import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Category } from '../menu/menu.model';
import { CategoryItemComponent } from './category-item/category-item.component';

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
}
