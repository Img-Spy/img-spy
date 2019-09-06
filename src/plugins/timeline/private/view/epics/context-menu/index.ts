import { combineEpics }     from "redux-observable";

import State                from "@public/state";

import generateTimeline     from "./generate-timeline";


export default combineEpics<any, any, State>(
    generateTimeline
);
