import { actions as formActions }   from "react-redux-form";
import { ofType }                   from "redux-observable";
import { flatMap, switchMap }       from "rxjs/operators";
import { Action }                   from "redux-actions";

import { ActionEpic }               from "img-spy-core";
import { apiQuery }                 from "img-spy-api";
import { ApplySettingsPayload,
         settingsTypes }            from "img-spy-modules/settings";
import { windowsActions }           from "img-spy-modules/windows";

import State                        from "./state"


const saveSettingsOnDisk: ActionEpic<ApplySettingsPayload, State> = (
    action$, state$
) => action$.pipe(
    ofType(settingsTypes.APPLY),
    apiQuery(api => api.saveSettings(state$.value.settings)),
    switchMap(query$ => query$.pipe(
        flatMap(({ input: action }) => {
            const actions: Array<any> = [
                formActions.setUntouched("settings")
            ];

            if (action.payload.close) {
                actions.push(windowsActions.closeModal());
            }

            return actions;
        })
    ))
);

export default saveSettingsOnDisk;
