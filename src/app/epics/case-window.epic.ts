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
         FileSelector,
         getFstItem,
         FstItem,
         ImgSpyState }              from "app/models";
import { applySettings,
         fstOpen,
         fstAdd }                   from "app/actions";


const updateActiveFstItemForm = (action$: EpicObservable<FileSelector>, store) =>
    action$.ofType(actions.CASE_ACTIVATE_FILE)
        .map((action) => {
            const selector = action.payload,
                  state: ImgSpyState = store.getState();

            return getFstItem(state.fstRoot, selector.path, selector.address);
        })
        .map((fstItem) => {
            const { parent, children, ...formFstItem } = fstItem as any;
            return formActions.change("fstItem", formFstItem);
        });


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


const openActivePath = (action$: EpicObservable<FileSelector>, store) =>
    action$.ofType(actions.CASE_ACTIVATE_FILE)
        .filter(action => !!action.payload)
        .map(action => fstOpen(action.payload.path, action.payload.address));

export default () =>
    (combineEpics as Function)(
        updateActiveFstItemForm,
        saveFstItemFormChanges,
        openActivePath
    );
