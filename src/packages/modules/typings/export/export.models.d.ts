import { Observable } from "rxjs";
export interface ExportCsvData<T = any> {
    file: string;
    data: T;
    fields: Array<string>;
}
export declare class ExportCsvObservable {
    static create(data: ExportCsvData): Observable<ExportCsvData>;
}
