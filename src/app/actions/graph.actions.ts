import { Action }               from "redux-actions";

import { GraphInfo }           from "app/models";
import { actions }              from "app/constants";


export const updateGraph =
    (payload: Partial<GraphInfo>): Action<Partial<GraphInfo>> =>
        ({ type: actions.UPDATE_GRAPH, payload });
