import { actions as formActions }   from "react-redux-form";
import { map }                      from "rxjs/operators";
import { ofType }                   from "redux-observable";

import { ActionEpic }               from "img-spy-core";

import { fstWatcherSelectors, 
         FileSelector }             from "img-spy-modules/fst-watcher";

import { explorerTypes }            from "@public/modules/explorer";
import State                        from "@public/state";


const updateActiveFstItemForm: ActionEpic<FileSelector, State> = (
    action$, state$
) => action$.pipe(
    ofType(explorerTypes.ACTIVATE_FILE),
    map((action) => {
        const selector = action.payload,
                    state = state$.value;

        return fstWatcherSelectors.getFstItem(
            state.fstRoot,
            selector.path,
            selector.address
        );
    }),
    map((fstItem) => {
        // TODO: Fix this any
        const { parent, children, ...formFstItem } = fstItem as any;
        return formActions.change("fstItem", formFstItem) as any;
    })
);

export default updateActiveFstItemForm;
