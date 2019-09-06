import { Reducer }          from "redux-actions";
import { reducerBuilder,
         loadArgs }         from "img-spy-core";

import { RouterData,
         RouteData,
         NavigatePayload }  from "./navigate.models";
import types                from "./navigate.types";
import utils                from "./navigate.utils";


const navigate: Reducer<RouterData, NavigatePayload<any>> = (
    state, action
): RouterData => {
    const { name, path, args } = action.payload;
    return utils.updatePath(state, path, name, args);
}

function loadInitialState(): RouterData {
    const args = loadArgs();
    const main: RouteData<any> = {
        path: args.view,
        subroutes: {},
        args: Object.assign({}, args)
    };
    delete main.args.view;

    return { main };
}


type Payload = NavigatePayload;
export default reducerBuilder<RouterData, Payload>({
    [types.NAVIGATE]: navigate,
}, loadInitialState);
