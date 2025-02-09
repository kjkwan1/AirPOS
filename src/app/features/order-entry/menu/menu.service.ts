import { Injectable } from '@angular/core';
import { InitialData, MenuUpdate, RelationParserMessage, RelationParserResponse } from '@core/workers/relation-parser/relation-parser.model';
import { error, map, ok, Result } from '@shared/types/functional.type';
import { BehaviorSubject, firstValueFrom, Observable, Subject, map as rxMap, filter, shareReplay } from 'rxjs';
import { Menu } from './menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private worker = new Worker(new URL('../../../core/workers/relation-parser/relation-parser.worker.ts', import.meta.url));
  private updates$ = new Subject<MenuUpdate>();
  private menuState$ = new BehaviorSubject<Result<string, Menu>>(
    error('Menu not initialized')
  );
  private initialized$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.worker.onmessage = ({ data }: MessageEvent<RelationParserResponse>) => {
      switch (data.type) {
        case 'MENU_READY':
          this.menuState$.next(ok(data.menu));
          this.initialized$.next(true);
          break;
        case 'CATEGORY_UPDATED':
          this.menuState$.next(
            map(this.menuState$.value, (menu) => ({
              ...menu,
              categories: menu.categories.map((category) =>
                category.id === data.category.id ? data.category : category
              )
            }))
          );
          break;
        case 'ERROR':
          this.menuState$.next(data.error);
          break;
      }
    };

    this.worker.onerror = (err) => {
      this.menuState$.next(error(`Worker error: ${err.message}`));
    };
  }

  initializeMenu(data: InitialData): Promise<void> {
    const message: RelationParserMessage = {
      type: 'INIT_MENU',
      payload: data
    };
    this.worker.postMessage(message);
    return firstValueFrom(this.initialized$.pipe(
      filter(Boolean),
      rxMap(() => void 0)
    ))
  }

  updateCategory(update: MenuUpdate): void {
    const message: RelationParserMessage = {
      type: 'UPDATE_MENU',
      payload: update
    };
    this.worker.postMessage(message);
    this.updates$.next(update);
  }

  getMenu(): Observable<Result<string, Menu>> {
    return this.menuState$.asObservable().pipe(
      shareReplay(1)
    );
  }

  getUpdates(): Observable<MenuUpdate> {
    return this.updates$.asObservable();
  }

  ngOnDestroy() {
    this.worker.terminate();
    this.updates$.complete();
    this.menuState$.complete();
  }
}