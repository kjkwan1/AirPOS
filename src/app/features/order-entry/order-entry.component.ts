import { ChangeDetectionStrategy, Component, EventEmitter, OnInit } from '@angular/core';
import { MenuService } from './menu/menu.service';
import testItems from 'src/app/assets/test-items';
import testChildItems from 'src/app/assets/test-child-items';
import testModifiers from 'src/app/assets/test-modifiers';
import testMenu from 'src/app/assets/test-relations';
import { InitialData } from '@core/workers/relation-parser/relation-parser.model';
import { Observable, tap } from 'rxjs';
import { Menu } from './menu/menu.model';
import { AsyncPipe } from '@angular/common';
import { CategoryComponent } from './category/category.component';
import testRules from 'src/app/assets/test-rules';
import { filterOkOnly } from '@shared/types/functional.type';
import { OrderItem } from '@shared/types/order.model';
import { ModalService } from '@core/modal/modal.service';
import { ItemViewComponent } from './item-view/item-view.component';

@Component({
  selector: 'app-order-entry',
  standalone: true,
  imports: [AsyncPipe, CategoryComponent],
  templateUrl: './order-entry.component.html',
  styleUrl: './order-entry.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderEntryComponent implements OnInit {
  menu$!: Observable<Menu>;

  constructor(private menuService: MenuService, private modalSerivce: ModalService) { 
    this.menu$ = menuService.getMenu().pipe(
      filterOkOnly(),
      tap(console.log)
    )
  }

  ngOnInit(): void {
    const initializationParams: InitialData = {
      items: testItems,
      childItems: testChildItems,
      modifiers: testModifiers,
      rules: testRules,
      menu: testMenu
    }

    this.menuService.initializeMenu(initializationParams);
  }

  onPreview(item: OrderItem) {
  }

  onSelected(item: OrderItem) {
    this.modalSerivce.open(ItemViewComponent, {
      props: {
        item
      },
      params: {
        title: 'Item'
      },
    })
  }
}
