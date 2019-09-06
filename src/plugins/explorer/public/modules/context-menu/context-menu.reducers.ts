import produce                  from "immer";

import { Reducer }              from "redux-actions";
import { reducerBuilder }       from "img-spy-core";

import { ContextMenuItem,
         ContextMenu }          from "./context-menu.models";
import types                    from "./context-menu.types"


const menuItemDefaults: Partial<ContextMenuItem> = {
    group: "default",
    address: "all",
    type: "all"
};

const add: Reducer<ContextMenu, ContextMenuItem> = (
    state, action
) => produce(state, draft => {
    const menuItem = Object.assign({}, menuItemDefaults, action.payload);
    const { group } = menuItem;

    if(!draft[group]) {
        draft[group] = [];
    }
    draft[group].push(menuItem);
});


type Payload = ContextMenuItem;
export default reducerBuilder<ContextMenu, Payload>({
    [types.ADD]: add,
}, {});
