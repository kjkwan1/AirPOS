import { DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'; 
import { Observable } from "rxjs";

export class DestroySubject {
    private readonly destroyRef: DestroyRef = inject(DestroyRef);

    subscribe<T>(observable: Observable<T>) {
        observable.pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();
    }
}