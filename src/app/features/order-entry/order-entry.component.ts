import { ChangeDetectionStrategy, Component, EventEmitter, inject, OnInit } from '@angular/core';
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
import { ModalService as ModalService2 } from '@core/modal2/modal.service';
import { ItemViewComponent } from './item-view/item-view.component';
import { ItemViewComponent as ItemViewComponent2 } from '@core/modal2/item-view/item-view.component';
import { OrderStore } from 'src/app/store/order.store';

@Component({
    selector: 'app-order-entry',
    standalone: true,
    imports: [AsyncPipe, CategoryComponent],
    providers: [OrderStore],
    templateUrl: './order-entry.component.html',
    styleUrl: './order-entry.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderEntryComponent implements OnInit {
  menu$!: Observable<Menu>;
  store = inject(OrderStore);

  constructor(
    private menuService: MenuService,
    private modalSerivce: ModalService,
    private modal2Service: ModalService2,
  ) { 
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

  async onSelected(item: OrderItem) {
    this.modal2Service.open<OrderItem>({
      view: ItemViewComponent2,
      size: 'lg',
      inputs: {
        item
      }
    })
    // const appliedItem = await this.modalSerivce.open<ItemViewComponent, any, OrderItem>(ItemViewComponent, {
    //   props: {
    //     item
    //   },
    //   params: {
    //     title: 'Item'
    //   },
    // });

    // console.log('selected item: ', appliedItem);
  }
}
