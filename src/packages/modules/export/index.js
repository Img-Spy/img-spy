import { writeFile } from 'fs';
import { parse } from 'json2csv';
import { Observable } from 'rxjs';

var export_selectors = {};
//# sourceMappingURL=export.selectors.js.map

const EXPORT_CSV = "imgspy/export/CSV";
var types = {
    EXPORT_CSV
};
//# sourceMappingURL=export.types.js.map

const exportCsv = (payload) => ({
    type: types.EXPORT_CSV,
    payload
});
var export_actions = {
    exportCsv
};
//# sourceMappingURL=export.actions.js.map

var export_utils = {};
//# sourceMappingURL=export.utils.js.map

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
//# sourceMappingURL=export.models.js.map

//# sourceMappingURL=export.reducers.js.map

const name = "export";
//# sourceMappingURL=index.js.map

export default undefined;
export { ExportCsvObservable, export_actions as exportActions, export_selectors as exportSelectors, types as exportTypes, export_utils as exportUtils, name };
//# sourceMappingURL=index.js.map
