import { combineEpics }     from "redux-observable";

import State                from "@public/state";

import openInExplorer       from "./open-in-explorer";
import exportFile           from "./export-file";


export default combineEpics<any, any, State>(
    openInExplorer,
    exportFile
);
