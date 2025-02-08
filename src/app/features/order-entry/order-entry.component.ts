import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MenuService } from './menu/menu.service';
import testItems from 'src/app/assets/test-items';
import testChildItems from 'src/app/assets/test-child-items';
import testModifiers from 'src/app/assets/test-modifiers';
import testMenu from 'src/app/assets/test-relations';
import { InitialData } from '@core/workers/relation-parser/relation-parser.model';
import { map, NEVER, Observable, tap } from 'rxjs';
import { Menu } from './menu/menu.model';
import { AsyncPipe } from '@angular/common';
import { CategoryComponent } from './category/category.component';

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

  constructor(private menuService: MenuService) { 
    this.menu$ = menuService.getMenu().pipe(
      map((result) => {
        if (result.type === 'ok') {
          return result.value;
        }

        return NEVER;
      }),
      tap(console.log)
    )
  }

  async ngOnInit(): Promise<void> {
    const initializationParams: InitialData = {
      items: testItems,
      childItems: testChildItems,
      modifiers: testModifiers,
      menu: testMenu
    }

    await this.menuService.initializeMenu(initializationParams);
  }
}
