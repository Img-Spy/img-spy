import * as fs                          from "fs";
import * as json2csv                    from "json2csv";
import { Observable,
         Observer }                     from "rxjs";


export interface ExportCsvData<T = any> {
    file: string;
    data: T;
    fields: Array<string>;
}

export class ExportCsvObservable {
    public static create(data: ExportCsvData): Observable<ExportCsvData> {
        return Observable.create((observer: Observer<ExportCsvData>) => {
            const csv = json2csv.parse(data);
            fs.writeFile(data.file, csv, (err) => {
                observer.next(data);
            });
        });
    }
}
