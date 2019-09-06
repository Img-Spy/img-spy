import { TimelineModuleState } from "./timeline.models";


function getSelected(state: TimelineModuleState) {
    return state.timeline.timelines[state.timeline.selected];
}

export default {
    getSelected
};
