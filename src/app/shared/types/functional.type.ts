import { combineLatest, Observable, of, OperatorFunction } from 'rxjs';
import { catchError, filter, map as rxMap, tap } from 'rxjs/operators';

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
    r.type === 'error' ? error(f(r.error)) : r;

export const getOrElse = <E, A>(r: Result<E, A>, defaultValue: A): A =>
    r.type === 'ok' ? r.value : defaultValue;

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

// rxjs interop

/**
 * Extracts only successful values from Result<E, A>. 
 */
export const unwrapResult = <E, A>(): OperatorFunction<Result<E, A>, A> =>
    rxMap(r => {
        if (r.type === 'ok') return r.value;
        throw r.error; // Preserves error handling without forcing an operator.
    });
/**
 * Extracts values from Result<E, A>, but if it's an error, emits a fallback value instead of throwing.
 */
export const unwrapOr = <E, A>(fallback: A) => (obs$: Observable<Result<E, A>>): Observable<A> =>
    obs$.pipe(rxMap(r => (r.type === 'ok' ? r.value : fallback)));

/**
 * Filters an Observable<Result<E, A>> to emit only successful values.
 */
export const filterOkOnly = <E, A>() => (obs$: Observable<Result<E, A>>): Observable<A> =>
    obs$.pipe(filter((r) => r.type === 'ok'), rxMap((r) => (r as { type: 'ok', value: A }).value));

/**
 * Filters an Observable<Result<E, A>> to emit only error values.
 */
export const filterErrorOnly = <E, A>() => (obs$: Observable<Result<E, A>>): Observable<E> =>
    obs$.pipe(filter((r) => r.type === 'error'), rxMap((r) => (r as { type: 'error', error: E }).error));

/**
 * Maps only successful values within an Observable<Result<E, A>>.
 */
export const mapOk = <E, A, B>(fn: (a: A) => B) => (obs$: Observable<Result<E, A>>): Observable<Result<E, B>> =>
    obs$.pipe(rxMap(r => (r.type === 'ok' ? ok(fn(r.value)) : r)));

/**
 * Maps only error values within an Observable<Result<E, A>>, transforming the error type from E to F.
 */
export const mapErr = <E, A, F>(fn: (e: E) => F): OperatorFunction<Result<E, A>, Result<F, A>> =>
    rxMap<Result<E, A>, Result<F, A>>(r =>
        r.type === 'error' ? error(fn(r.error)) : (r as Result<F, A>)
    );

/**
 * Converts an Observable<T> into an Observable<Result<unknown, T>>.
 */
export const toResult = <T>(source$: Observable<T>): Observable<Result<unknown, T>> =>
    source$.pipe(
        rxMap(value => ok(value)),
        catchError(error => of(error(error)))
    );

/**
 * Triggers side effects on errors without modifying the Observable flow.
 */
export const tapError = <E, A>(fn: (e: E) => void) => (obs$: Observable<Result<E, A>>): Observable<Result<E, A>> =>
    obs$.pipe(tap(r => r.type === 'error' && fn(r.error)));

/**
 * Merges multiple Observable<Result<E, A>> into a single Observable<Result<E, A[]>>.
 */
export const mergeResults = <E, A>(sources: Observable<Result<E, A>>[]): Observable<Result<E, A[]>> =>
    combineLatest(sources).pipe(rxMap(sequence));