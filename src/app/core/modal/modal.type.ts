import { EventEmitter } from '@angular/core';

export interface ModalConfig<TProps = any> {
    props: TProps;
    params: ModalParams;
}

export interface ModalParams {
    title?: string;
    subtitle?: string;
    headerButtons?: ModalButton[];
    footerButtons?: ModalButton[];
}

export interface ModalButton {
    label: string;
    action: () => void;
    cssClass?: string;
}

export interface ModalView<TProps = any, TResult = any> {
    props: TProps;
    close: EventEmitter<TResult>;
}

export abstract class ModalViewAbstract<TProps = any, TResult = any> implements ModalView<TProps, TResult> {
    props: TProps = {} as TProps;
    close = new EventEmitter<TResult>();
    params: ModalParams = {};
}