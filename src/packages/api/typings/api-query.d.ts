import { OperatorFunction, Observable } from "rxjs";
import { ApiTranslator } from "./api-translator";
export declare type ApiQuery<I, R> = {
    input: I;
    response: R;
};
export declare type ApiCallOperator<I, R> = (api: ApiTranslator, input: I) => Observable<R>;
declare function apiQuery<I, R>(api: ApiCallOperator<I, R>): OperatorFunction<I, Observable<ApiQuery<I, R>>>;
export default apiQuery;
