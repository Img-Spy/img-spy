import { map,
         filter }                   from "rxjs/operators";
import { ofType }                   from "redux-observable";

import { ActionEpic }               from "img-spy-core";

import { fstWatcherActions,
         FileSelector }             from "img-spy-modules/fst-watcher";

import { explorerTypes }            from "@public/modules/explorer";
import State                        from "@public/state";


const openActivePath: ActionEpic<FileSelector, State> = (
    action$, state$
) => action$.pipe(
    ofType(explorerTypes.ACTIVATE_FILE),
    filter(action => !!action.payload),
    map(action => fstWatcherActions.open(action.payload.path, action.payload.address))
);

export default openActivePath;
