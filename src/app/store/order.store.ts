import { computed, EventEmitter } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { Order } from "@shared/types/order.model";
import { Observable, ReplaySubject, Subject } from "rxjs";

type OrderState = {
    order: Order | null;
}

const initialState: OrderState = {
    order: null
};

export class BaseOrderHooks {
    private _onBeforeUpdate = new ReplaySubject<Partial<Order>>(1);
    private _onAfterUpdate = new ReplaySubject<Order>(1);
    private _onLifecycleChanged = new ReplaySubject<Order['state']>(1);
    private _onOrderUnset = new ReplaySubject<void>(1);

    public readonly onBeforeUpdate$: Observable<Partial<Order>> = this._onBeforeUpdate.asObservable();
    public readonly onAfterUpdate$: Observable<Order> = this._onAfterUpdate.asObservable();
    public readonly onLifecycleChanged$: Observable<Order['state']> = this._onLifecycleChanged.asObservable();
    public readonly onOrderUnset$: Observable<void> = this._onOrderUnset.asObservable();

    emitBeforeUpdate(updates: Partial<Order>): void {
        this._onBeforeUpdate.next(updates);
    }

    emitAfterUpdate(order: Order): void {
        this._onAfterUpdate.next(order);
    }

    emitLifecycleChanged(newState: Order['state']): void {
        this._onLifecycleChanged.next(newState);
    }

    emitOrderUnset(): void {
        this._onOrderUnset.next();
    }
}

export const OrderStore = signalStore(
    withState(initialState),
    withComputed((store) => ({
        orderState: computed(() => {
            const order = store.order();
            if (!order) {
                return null;
            }

            return order.state;
        }),
        orderItems: computed(() => {
            const order = store.order();
            if (!order) {
                return [];
            }

            return order.items;
        })
    })),
    withMethods((store) => ({
        setOrderActive(order: Order) {
            patchState(store, () => ({ order }))
        },
        updateActiveOrder(updates: Partial<Order>) {
            const order = store.order();
            if (!order) {
                throw new Error('Cannot update non-existent order');
            }

            if (!Object.keys(updates).length) {
                throw new Error('Must use unsetActiveOrder to reset order state');
            }

            OrderHooks.emitBeforeUpdate(updates);
            const updatedOrder = { ...order, ...updates };
            patchState(store, () => ({ order: updatedOrder }));

            if (order.state !== updatedOrder.state) {
                OrderHooks.emitLifecycleChanged(updatedOrder.state);
            }

            OrderHooks.emitAfterUpdate(updatedOrder);
        },
        unsetActiveOrder() {
            patchState(store, () => ({ order: null }));
            OrderHooks.emitOrderUnset();
        }
    }))
)

export const OrderHooks = new BaseOrderHooks();
