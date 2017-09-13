import { Observable }               from "rxjs";
import { Action }                   from "redux-actions";
import { actionTypes as fromActionTypes,
         actions as formActions,
         ModelAction }              from "react-redux-form";
import { combineEpics,
         ActionsObservable }        from "redux-observable";

import { actions }                  from "app/constants";
import { api }                      from "app/api";
import { EpicObservable,
         getFstItem,
         FstItem,
         ImgSpyState }              from "app/models";
import { applySettings,
         fstOpen,
         fstAdd }                   from "app/actions";


const updateActiveFstItemForm = (action$: EpicObservable<string>, store) =>
    action$.ofType(actions.CASE_ACTIVATE_FILE)
        .map((action) => {
            const path = action.payload,
                  state: ImgSpyState = store.getState();

            return getFstItem(state.fstRoot, path);
        })
        .map((fstItem) => formActions.change("fstItem", fstItem));


const saveFstItemFormChanges = (action$: ActionsObservable<ModelAction>, store) =>
    action$.ofType(fromActionTypes.CHANGE)
        .filter((action) => {
            return action.model.startsWith("fstItem.");
        })
        .debounceTime(500)
        .map((action) => {
            const state: ImgSpyState = store.getState();
            return fstAdd(state.fstItem);
        });


const openActivePath = (action$: EpicObservable<string>, store) =>
    action$.ofType(actions.CASE_ACTIVATE_FILE)
        .map(action => fstOpen(action.payload));

export default () =>
    (combineEpics as Function)(
        updateActiveFstItemForm,
        saveFstItemFormChanges,
        openActivePath
    );
