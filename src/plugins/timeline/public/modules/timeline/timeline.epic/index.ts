import { combineEpics }         from "redux-observable";

import { TimelineModuleState }  from "../timeline.models";

import activateTimeline         from "./activate-timeline";


export default combineEpics<any, any, TimelineModuleState>(
    activateTimeline
);
