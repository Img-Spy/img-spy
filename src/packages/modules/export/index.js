import { writeFile } from 'fs';
import { parse } from 'json2csv';
import { Observable } from 'rxjs';

var export_selectors = {};

const EXPORT_CSV = "imgspy/export/CSV";
var types = {
    EXPORT_CSV
};

const exportCsv = (payload) => ({
    type: types.EXPORT_CSV,
    payload
});
var export_actions = {
    exportCsv
};

var export_utils = {};

class ExportCsvObservable {
    static create(data) {
        return Observable.create((observer) => {
            const csv = parse(data);
            writeFile(data.file, csv, (err) => {
                observer.next(data);
            });
        });
    }
}

const name = "export";

export default undefined;
export { ExportCsvObservable, export_actions as exportActions, export_selectors as exportSelectors, types as exportTypes, export_utils as exportUtils, name };
//# sourceMappingURL=index.js.map
