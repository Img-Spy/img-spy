import { Action }                   from "redux-actions";
import { FstItem }                  from "img-spy-modules/fst-watcher";

import { ContextMenuItem,
         ClickEvent }               from "./context-menu.models";
import types                        from "./context-menu.types";


const add = (
    item: ContextMenuItem
): Action<ContextMenuItem> => ({
    type: types.ADD,
    payload: item
});

const click = (
    menuItem: ContextMenuItem, item: FstItem
): Action<ClickEvent> => ({
    type: types.CLICK,
    payload: { menuItem, item }
});


export default {
    add,
    click,
};
