import { combineEpics }     from "redux-observable";

import   State              from "@public/state";

import   autoSaveSearch     from "./auto-save-search";
import   populateSearch     from "./populate-search";


export default combineEpics<any, any, State>(
    autoSaveSearch,
    populateSearch
);
