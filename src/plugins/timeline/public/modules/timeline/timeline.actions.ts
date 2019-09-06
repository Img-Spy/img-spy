import { Action }               from "redux-actions";

import { CrtTimelinePayload,
         TimelineInfo,
         TableSettings }        from "./timeline.models";
import types                    from "./timeline.types"


const createTimeline = (
    payload: CrtTimelinePayload
): Action<CrtTimelinePayload> => ({
    type: types.CREATE,
    payload
});

const updateTimeline = (
    payload: Partial<TimelineInfo>
): Action<Partial<TimelineInfo>> => ({
    type: types.UPDATE,
    payload
});

const selectTimeline = (
    payload: string
): Action<string> =>({
    type: types.SELECT,
    payload
});

const deleteTimeline = (
    payload: string
): Action<string> =>({
    type: types.DELETE,
    payload
});

const updateTimelineTable = (
    payload: TableSettings
): Action<TableSettings> => ({
    type: types.UPDATE_TABLE,
    payload
});

export default {
    createTimeline,
    updateTimeline,
    selectTimeline,
    deleteTimeline,
    updateTimelineTable,
};
