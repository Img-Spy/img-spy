import { createStore,
         applyMiddleware,
         Reducer }              from "redux";
import { Action,
         handleActions }        from "redux-actions";
import { createEpicMiddleware } from "redux-observable";

import epicBuilder              from "app/epics";
import reducerBuilder           from "app/reducers";
import args                     from "app/args";
import { api }                  from "app/api";


const buildStore = (name) => {
    const initialState = {};
    const rootEpic = epicBuilder(name);
    const rootReducer = reducerBuilder(name);

    let store;
    if (!rootEpic) {
        store = createStore(rootReducer, initialState);
    } else {
        const epicMiddleware = createEpicMiddleware(rootEpic);
        store = createStore(
            rootReducer,
            initialState,
            applyMiddleware(epicMiddleware)
        );
    }

    return store;
};

export default buildStore;
export const appStore = buildStore(args.view);
