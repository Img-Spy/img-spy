import { Observable,
         Observer }                     from "rxjs";

import { ResizeSize }                   from "./resize-size";


let strategies;
if(typeof window !== "undefined") {
    const elementResizeDetectorMaker = require("element-resize-detector");

    strategies = {
        // <- For ultra performance.
        scroll: elementResizeDetectorMaker( { strategy: "scroll"  } ),
        object: elementResizeDetectorMaker(),
    };
}


type ResizeStrategy = "scroll" | "object";
export class ResizeObservable extends Observable<ResizeSize> {

    public static create(
        element: HTMLElement,
        strategy: ResizeStrategy = "scroll"
    ): ResizeObservable {

        if(!strategies) {
            throw Error("Resize observable cannot be created if window object is not defined!");
        }
        const selectedStrategy = strategies[strategy];

        const resize$ = Observable.create((observer: Observer<ResizeSize>) => {
            selectedStrategy.listenTo(element, onResize);
            return unsubscribe;

            function onResize() {
                const { clientHeight: height,
                        clientWidth: width,
                        scrollHeight,
                        scrollWidth,
                        offsetLeft: widthStart,
                        offsetTop: heightStart } = element;

                observer.next({
                    height,
                    width,

                    scrollHeight,
                    scrollWidth,

                    heightStart,
                    widthStart
                });
            }

            function unsubscribe() {
                selectedStrategy.removeListener(element, onResize);
            }

        });

        return resize$;
    }
}
