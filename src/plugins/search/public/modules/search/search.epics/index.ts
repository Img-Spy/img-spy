import { combineEpics }         from "redux-observable";

import { SearchModuleState }    from "../search.models";

import activateSearch           from "./activate-search";


export default combineEpics<any, any, SearchModuleState>(
    activateSearch
);
