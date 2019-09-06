import { Observable }                   from "rxjs";

import { ApiCall }                      from "./api-call";
import   apiTranslator                  from "./api-translator";


const api$ = <R>(
    apiCall: ApiCall<R>
): Observable<R> => {
    return apiCall(apiTranslator);
}

export default api$;
