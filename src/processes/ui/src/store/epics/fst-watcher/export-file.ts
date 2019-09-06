import * as fs                      from "fs";
import { from, ObservableInput }    from "rxjs";
import { mapTo,
         mergeMap, 
         filter,
         map}                       from "rxjs/operators";
import { ofType }                   from "redux-observable";

import { ActionEpic }               from "img-spy-core";
import { terminalActions }          from "img-spy-modules/terminal";
import { FstFile,
         FstExportPayload,fstWatcherTypes,
         fstWatcherSelectors,
         fstWatcherActions }        from "img-spy-modules/fst-watcher";

import State                        from "./state";
import { Action }                   from "redux-actions";


type Input = FstExportPayload;
const exportFileEpic: ActionEpic<Input, State> = (
    action$, state$
) => action$.pipe(
    ofType(fstWatcherTypes.EXPORT),
    mergeMap(action => {
        const state = state$.value;
        const { file: selector, path } = action.payload;
        const file = fstWatcherSelectors.getFstItem(
            state.fstRoot,
            selector.path,
            selector.address
        ) as FstFile;
        let newAction$: ObservableInput<any>;

        if (!file.content) {
            newAction$ = from([
                fstWatcherActions.content(file),
                fstWatcherActions.exportFile(selector, path)
            ]);
        } else {
            newAction$ = new Promise<Action<any>>(resolve => {
                console.log();
                fs.writeFile(action.payload.path, file.content, (err) => {
                    if(!err) {
                        const resultAction = terminalActions.pushLine({
                            level: "notice",
                            text: `Exported file '${file.name}'`
                        })
                        resolve(resultAction);
                    }
                });
            });
        }

        return newAction$;
    })
);

export default exportFileEpic;
