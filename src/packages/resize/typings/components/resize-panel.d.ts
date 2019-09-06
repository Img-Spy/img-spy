import * as React from "react";
import { HTMLAttributes } from "react";
import { ResizeSize, ResizeItemModel, ResizeModel } from "../module";
declare type MapChildrenFn = (child: React.ReactNode, index: number) => React.ReactNode;
interface InputProps {
    name: string;
}
interface StateProps {
    resizeModel: ResizeModel;
}
interface DispatchProps {
    actions: {
        updateSize: (name: string, size: ResizeSize) => void;
        start: (name: string, index: number) => void;
        move: (name: string, mouse: MouseEvent) => void;
        stop: (name: string, mouse: MouseEvent) => void;
    };
}
declare type ResizePanelProps = InputProps & StateProps & DispatchProps & HTMLAttributes<HTMLDivElement>;
export declare class ResizePanelClass extends React.Component<ResizePanelProps> {
    static displayName: string;
    private resizeSubscription;
    private moveSubscription;
    private stopSubscription;
    constructor(props?: ResizePanelProps, context?: any);
    resizeStart(ev: React.MouseEvent<HTMLElement>, index: number): void;
    resize(ev: MouseEvent): void;
    resizeEnd(ev: MouseEvent): void;
    processChildren(children: React.ReactNode, fn: MapChildrenFn): React.ReactNode;
    readonly directionProperty: string;
    onContainerAttached(container: HTMLDivElement): void;
    onResize(size: ResizeSize): void;
    getItemProps(item: ResizeItemModel): React.HTMLAttributes<HTMLDivElement>;
    render(): JSX.Element;
}
export declare const ResizePanel: React.ComponentClass<InputProps & React.HTMLAttributes<HTMLDivElement>, any>;
export {};
