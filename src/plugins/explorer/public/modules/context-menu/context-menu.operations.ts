import { OperatorFunction }     from "rxjs";
import { Action }               from "redux-actions";
import { filter }               from "rxjs/operators";

import { ClickEvent }           from "./context-menu.models";


const withTag = (
    tag: string
): OperatorFunction<Action<ClickEvent>, Action<ClickEvent>> => {
    return filter(action => action.payload.menuItem.tag === tag);
}


export default {
    withTag
};
