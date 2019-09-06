import { Action }               from "redux-actions";

import { ExportCsvData }        from "./export.models";
import types                    from "./export.types";


const exportCsv = (
    payload: ExportCsvData
): Action<ExportCsvData> => ({
    type: types.EXPORT_CSV,
    payload
});

export default {
    exportCsv
};
