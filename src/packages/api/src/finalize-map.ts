import { OperatorFunction,
         Observable,
         Observer }             from "rxjs";

         
const finalizeMap = <T>(
    mapFunc: (input: T) => T
): OperatorFunction<T, T> =>
    (source) => Observable.create((observer: Observer<T>) => {
        let lastValue: T = undefined;
        source.subscribe(
            (value) =>  {
                console.log("emit value");
                observer.next(value);
                lastValue = value;
            },
            null,
            () => {
                console.log("completed!");
                observer.next(mapFunc(lastValue));
                observer.complete();
            }
        );
    });

export default finalizeMap;