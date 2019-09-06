import { OperatorFunction,
         Observable }           from "rxjs";
import { map }                  from "rxjs/operators";


import   apiTranslator,
       { ApiTranslator }        from "./api-translator";


export type ApiQuery<I, R> = { input: I, response: R };
export type ApiCallOperator<I, R> = (api: ApiTranslator, input: I) => Observable<R>;

function apiQuery<I, R>(
    api: ApiCallOperator<I, R>
): OperatorFunction<I, Observable<ApiQuery<I, R>>> {
    return map(input =>
        api(apiTranslator, input).pipe(
            map(response => ({ input, response })),
        )
    );
}


export default apiQuery;
