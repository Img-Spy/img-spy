import { Observable } from "rxjs";
import { ApiCall } from "./api-call";
declare const api$: <R>(apiCall: ApiCall<R>) => Observable<R>;
export default api$;
