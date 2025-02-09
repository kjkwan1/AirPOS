import { EventEmitter } from '@angular/core';

export interface ModalConfig<TProps = any> {
    props: TProps;
    params: ModalParams;
}

export interface ModalParams {
    title?: string;
    subtitle?: string;
    headerButtons?: ModalHeaderButton[];
}

export interface ModalHeaderButton {
    label: string;
    action: () => void;
    cssClass?: string;
}

export interface ModalView<TProps = any> {
    props: TProps;
    close: EventEmitter<any>;
}

export abstract class ModalViewAbstract<TProps = any> implements ModalView<TProps> {
    props!: TProps;
    close = new EventEmitter<any>();
    params!: ModalParams;
}
