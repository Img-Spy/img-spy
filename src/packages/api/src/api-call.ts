import { ApiTranslator }    from "./api-translator";
import { Observable }       from "rxjs";


export type ApiCall<R> = (api: ApiTranslator) => Observable<R>;
