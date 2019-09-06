import { OperatorFunction, 
         pipe}                  from "rxjs";
import { filter,
         map, 
         exhaustMap}                  from "rxjs/operators";


export class Sink<T = any> {
    private subSinksUsed: { [name: string]: boolean };

    constructor(private map: (input: T) => string = () => "default") {
        this.subSinksUsed = {};
    }

    public start<S>(
        mapFunc: (input: S) => T
    ): OperatorFunction<S, S> {
        return pipe(
            filter(input => {
                const obj = mapFunc(input);
                const hashValue = this.map(obj);
                if (this.subSinksUsed[hashValue]) {
                    console.log(`Filter ${hashValue}`);
                    return false;
                }
                this.subSinksUsed[hashValue] = true;
                 
                return true;
            })
        );
    }

    public end<S>(
        mapFunc: (input: S) => T
    ): OperatorFunction<S, S> {
        return pipe(
            filter(input => {
                const obj = mapFunc(input);
                const hashValue = this.map(obj);
                delete this.subSinksUsed[hashValue];
    
                return true;
            })
        );  
    }

    public finalize(input: T) {
        const hashValue = this.map(input);
        delete this.subSinksUsed[hashValue];
    }
}
