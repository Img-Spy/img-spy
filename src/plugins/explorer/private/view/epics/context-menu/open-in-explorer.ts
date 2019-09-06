import { flatMap }                  from "rxjs/operators";
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
const openInExplorerEpic: ActionEpic<Input, State> = (
    action$, state$
) => action$.pipe(
    ofType(contextMenuTypes.CLICK),
    contextMenuOperations.withTag(contextMenuTags.OPEN),
    flatMap(action => [
        terminalActions.pushLine({
            level: "notice",
            text: `Open "${action.payload.item.name}"`
        }),
        fstWatcherActions.openOut(action.payload.item)
    ])
);

export default openInExplorerEpic;
