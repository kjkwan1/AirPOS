import { Type } from "@angular/core";

export interface ModalConfig<T, I = {}> {
    view: Type<ModalView<T> & I>;
    size?: 'sm' | 'md' | 'lg';
    inputs?: Partial<I>;
}

export interface ModalView<T> {
    close: (payload: T) => void;
    cancel?: () => void;
    [key: string]: any;
}