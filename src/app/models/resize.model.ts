import { Observable,
         Observer }                     from "rxjs";
import * as elementResizeDetectorMaker  from "element-resize-detector";


export type ResizeModelMap =  { [name: string]: ResizeModel };

export type ResizeUnit = "percent";
export type ResizeDirection = "horizontal" | "vertical";

export interface ResizeModel {
    size: ResizeSize;
    name: string;
    direction: ResizeDirection;
    rszIndex?: number;
    items: Array<ResizeItemModel>;
}

export interface ResizeSize {
    height: number;
    width: number;

    heightStart: number;
    widthStart: number;
}

export interface SizeUnits {
    value: number;
    units: ResizeUnit;
}

export interface ResizeItemModel {
    current: SizeUnits;

    minValue?: SizeUnits;
    maxValue?: SizeUnits;
    defValue?: SizeUnits;
}

export interface UpdateResizePayload {
    name: string;
    size?: ResizeSize;
    items?: Array<ResizeItemModel>;
}

export interface StartResizePayload {
    name: string;
    index: number;
}

export interface ResizePayload {
    name: string;
    mouse: MouseEvent;
}

const erdUltraFast = elementResizeDetectorMaker({
    strategy: "scroll" // <- For ultra performance.
});

export class ResizeObservable {

    public static create(element: HTMLElement): Observable<ResizeSize> {

        const resize$ = Observable.create((observer: Observer<ResizeSize>) => {

            erdUltraFast.listenTo(element, () => {
                const { clientHeight: height,
                        clientWidth: width,
                        offsetLeft: widthStart,
                        offsetTop: heightStart } = element;

                observer.next({
                    height,
                    width,
                    heightStart,
                    widthStart
                });
            });

        });

        return resize$;
    }

}
