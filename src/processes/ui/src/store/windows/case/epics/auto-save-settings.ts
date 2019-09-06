import { mapTo,
         debounceTime }             from "rxjs/operators";
import { ofType }                   from "redux-observable";

import { ActionEpic }               from "img-spy-core";
import { settingsActions,
         settingsTypes }            from "img-spy-modules/settings";

import State                        from "../state";


const autoSaveSettings: ActionEpic<any, State> = (
    action$, store$
) => action$.pipe(
    ofType(
        settingsTypes.UPDATE,
        settingsTypes.UPDATE_SOURCE,
        settingsTypes.UPDATE_THEME
    ),
    debounceTime(100),
    mapTo(settingsActions.applySettings({close: false}))
);

export default autoSaveSettings;
