import { from, Observable, of } from 'rxjs';
import { catchError, map as rxMap } from 'rxjs/operators';

export type Result<E, A> = { type: 'ok'; value: A } | { type: 'error'; error: E };

export const ok = <A>(value: A): Result<never, A> => ({
    type: 'ok',
    value
});

export const error = <E>(error: E): Result<E, never> => ({
    type: 'error',
    error
});

export const map = <E, A, B>(
    r: Result<E, A>,
    f: (a: A) => B
): Result<E, B> =>
    r.type === 'ok' ? ok(f(r.value)) : r;

export const flatMap = <E, A, B>(
    r: Result<E, A>,
    f: (a: A) => Result<E, B>
): Result<E, B> =>
    r.type === 'ok' ? f(r.value) : r;

export const sequence = <E, A>(
    results: Result<E, A>[]
): Result<E, A[]> => {
    const errors = results.filter((r): r is Result<E, never> => r.type === 'error');

    return errors.length > 0 ? errors[0] : ok(results.map((r) => (r as any).value));
}

export const mapError = <E, F, A>(
    r: Result<E, A>,
    f: (e: E) => F
): Result<F, A> =>
    r.type === 'error' ? error(f(r.error)): r;

export const getOrElse = <E, A>(r: Result<E, A>, defaultValue: A): A =>
    r.type === 'ok'? r.value : defaultValue;

export const orElse = <E, A>(
    r: Result<E, A>,
    alternative: () => Result<E, A>
): Result<E, A> =>
    r.type === 'ok' ? r : alternative();

export const tryCatch = <A>(fn: () => A): Result<unknown, A> => {
    try {
        return ok(fn());
    } catch (e) {
        return error(e);
    }
}

// interop

export const resultMap = <E, A, B>(f: (a: A) => B) =>
    rxMap((r: Result<E, A>): Result<E, B> => map(r, f));

export const asResult = <T>(source$: Observable<T>): Observable<Result<unknown, T>> =>
    source$.pipe(
        rxMap((v) => ok(v)),
        catchError((err) => of(error(err)))
    );

export const fromPromiseResult = <T>(promise: Promise<T>): Observable<Result<unknown, T>> =>
    from(promise).pipe(
        rxMap((v) => ok(v)),
        catchError((e) => of(error(e)))
    );