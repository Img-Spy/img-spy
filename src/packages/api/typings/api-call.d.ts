import { ApiTranslator } from "./api-translator";
import { Observable } from "rxjs";
export declare type ApiCall<R> = (api: ApiTranslator) => Observable<R>;
