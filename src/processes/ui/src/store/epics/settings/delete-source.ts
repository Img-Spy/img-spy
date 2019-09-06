import { actions as formActions }   from "react-redux-form";
import { ofType }                   from "redux-observable";
import { mapTo }                    from "rxjs/operators";

import { ActionEpic }               from "img-spy-core";
import { DataSource, 
         settingsTypes }            from "img-spy-modules/settings";

import State                        from "./state"


const deleteSourceEpic: ActionEpic<DataSource, State> = (
    action$, state$
) => action$.pipe(
    ofType(settingsTypes.DELETE_SOURCE),
    // TODO: Fix this any
    mapTo(formActions.setTouched("settings") as any)
);

export default deleteSourceEpic;
