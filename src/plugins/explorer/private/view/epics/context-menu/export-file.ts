import { Action }                   from "redux-actions";
import { remote }                   from "electron";
import { mergeMap }                 from "rxjs/operators";
import { ofType }                   from "redux-observable";

import { ActionEpic }               from "img-spy-core";
import { fstWatcherActions }        from "img-spy-modules/fst-watcher";
import { terminalActions }          from "img-spy-modules/terminal";

import { ClickEvent,
         contextMenuOperations,
         contextMenuTypes }         from "@public/modules/context-menu";
import { contextMenuTags }          from "@public/context-menu";
import State                        from "@public/state";


type Input = ClickEvent;
const exportFileEpic: ActionEpic<Input, State> = (
    action$, state$
) => action$.pipe(
    ofType(contextMenuTypes.CLICK),
    contextMenuOperations.withTag(contextMenuTags.EXPORT),
    mergeMap(action => new Promise<Action<any>>(async (dispatch) => {
        const { folder } = state$.value;
        const { item } = action.payload

        remote.dialog.showSaveDialog({
            title: "Export file",
            defaultPath: `${folder}/${item.name}`
        }, (exportPath) => {
            if (!exportPath) return;

            dispatch(fstWatcherActions.exportFile(item, exportPath));
            dispatch(terminalActions.pushLine({
                level: "notice",
                text: `Exported file "${item.name}" on path "${exportPath}"`
            }))
        });
    }))
);


export default exportFileEpic;
