import { Observable }               from "rxjs";
import { Store }                    from "redux";
import { Action }                   from "redux-actions";
import { combineEpics }             from "redux-observable";

import { actions }                  from "app/constants";
import { EpicObservable,
         ImgSpyState }              from "app/models";
import { applySettings }            from "app/actions";


const autoSaveSettings = (
    action$: EpicObservable<any>,
    store: Store<ImgSpyState>
) =>
action$
    .ofType(
        actions.UPDATE_SETTINGS,
        actions.UPDATE_SOURCE,
        actions.UPDATE_THEME)
    .debounceTime(100)
    .mapTo(applySettings({close: false}));


export default () =>
    combineEpics(
        autoSaveSettings,
    );
