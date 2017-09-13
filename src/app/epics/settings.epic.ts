import { Observable }               from "rxjs";
import { Action }                   from "redux-actions";
import { actions as formActions }   from "react-redux-form";
import { combineEpics }             from "redux-observable";

import { actions }                  from "app/constants";
import { ApiObservable }            from "app/api";
import { EpicObservable,
         ActionObservable,
         ActionObserver,
         DataSource,
         SettingsModel,
         ImgSpyState }              from "app/models";
import { ApplySettingsPayload,
         closeModal }               from "app/actions";


const acceptOrApplySettingsEpic = (action$: EpicObservable<ApplySettingsPayload>, store) =>
    action$.ofType(actions.APPLY_SETTINGS)
        .mergeMap((action) => {
            const state: ImgSpyState = store.getState();
            return ApiObservable
                .create((api, cb) => api.saveSettings(state.settings, cb))
                .mapTo(action);
        })
        .flatMap((action) => {
            const actionList: Array<Action<any>> = [
                formActions.setUntouched("settings")
            ];

            if (action.payload.close) {
                actionList.push(closeModal());
            }

            return actionList;
        });

const deleteSourceEpic = (action$: EpicObservable<DataSource>, store) =>
    action$.ofType(actions.DELETE_SOURCE)
        .mapTo(formActions.setTouched("settings"));

const updateSourceEpic = (action$: EpicObservable<DataSource>, store) =>
        action$.ofType(actions.UPDATE_SOURCE)
            .mapTo(formActions.setTouched("settings"));

export default () =>
    combineEpics(
        acceptOrApplySettingsEpic,
        deleteSourceEpic,
        updateSourceEpic
    );
