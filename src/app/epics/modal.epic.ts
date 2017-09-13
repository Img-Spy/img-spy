import { ActionsObservable }    from "redux-observable";
import { Observable }           from "rxjs";
import { Action }               from "redux-actions";

import { actions }              from "app/constants";
import { EpicObservable }       from "app/models";
import { api }                  from "app/api";


export default () =>
    (action$: EpicObservable<undefined>, store) =>
        action$.ofType(actions.CLOSE_MODAL)
            .map(() => {
                api.closeWindow("settings");
                return action$;
            });
