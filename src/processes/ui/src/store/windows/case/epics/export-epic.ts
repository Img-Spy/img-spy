import { Action }                   from "redux-actions";
import { combineEpics,
         ofType }                   from "redux-observable";
import { switchMap,
         map }                      from "rxjs/operators";

import { ActionEpic }               from "img-spy-core";
import { terminalActions }          from "img-spy-modules/terminal";
import { ExportCsvObservable,
         ExportCsvData,
         exportTypes }              from "img-spy-modules/export";

import State                        from "../state";


const exportCsv: ActionEpic<ExportCsvData, State> = (
    action$, state$
) => action$.pipe(
    ofType(exportTypes.EXPORT_CSV),
    switchMap(action => ExportCsvObservable.create(action.payload)),
    map(action => terminalActions.pushLine({
        level: "notice",
        text: `Exported CSV file "${action.file}".`
    }))
);

export default combineEpics(
    exportCsv,
);
