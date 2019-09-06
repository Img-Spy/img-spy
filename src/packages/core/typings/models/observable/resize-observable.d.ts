import { Observable } from "rxjs";
import { ResizeSize } from "./resize-size";
declare type ResizeStrategy = "scroll" | "object";
export declare class ResizeObservable extends Observable<ResizeSize> {
    static create(element: HTMLElement, strategy?: ResizeStrategy): ResizeObservable;
}
export {};
