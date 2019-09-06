import { combineEpics }     from "redux-observable";

import State                from "@public/state";

import autoSaveTimeline     from "./auto-save-timeline";
import populateTimeline     from "./populate-timeline";
import contextMenu          from "./context-menu";


export default combineEpics<any, any, State>(
    autoSaveTimeline,
    populateTimeline,
    contextMenu
);
