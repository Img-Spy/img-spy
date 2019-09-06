import produce                  from "immer";
import { Reducer }              from "redux-actions";
import { reducerBuilder }       from "img-spy-core";

import { TableSettings,
         TimelinesModel,
         TimelineInfo,
         CrtTimelinePayload,
         TimelineSettings }     from "./timeline.models";
import types                    from "./timeline.types";


const createTimeline: Reducer<TimelinesModel, CrtTimelinePayload> = (
    state, action
) => produce(state, draft  => {
    const { name, path, date, imgPath, offset, inode } = action.payload;

    draft.timelines[path] =  {
        name, path, date, imgPath, offset, inode,

        // Defaults
        tableSettings: {
            defaultSorted: [ { id: "date", desc: true } ]
        },
        complete: false,
        rawItems: [],
        sortedItems: []
    };
});

const updateTimeline: Reducer<TimelinesModel, Partial<TimelineInfo>> = (
    state, action
) => produce(state, draft => {
    const { path, ...update } = action.payload;
    Object.assign(draft.timelines[path], update);
});

const deleteTimeline: Reducer<TimelinesModel, string> = (
    state, action
) => produce(state, draft => {
    const { payload: path } = action;
    delete draft.timelines[path];
});

const selectTimeline: Reducer<TimelinesModel, string> = (
    state, action
) => produce(state, draft => {
    const { payload: selected } = action;
    draft.selected = selected;
});

const updateTimelineTable: Reducer<TimelinesModel, Partial<TableSettings>> = (
    state, action
) => produce(state, draft => {
    const { payload: update } = action;
    Object.assign(draft.tableSettings, update);
});


type Payload = CrtTimelinePayload | Partial<CrtTimelinePayload> | 
               string | Partial<TableSettings>;
export default reducerBuilder<TimelinesModel, Payload, TimelineSettings>({
    [types.CREATE]: createTimeline,
    [types.DELETE]: deleteTimeline,
    [types.SELECT]: selectTimeline,
    [types.UPDATE]: updateTimeline,

    [types.UPDATE_TABLE]: updateTimelineTable
}, info => {
    const timelines = info.initialSettings.plugins.timelines || {};
    const selected = info.initialSettings.plugins.timelines ?
        Object.keys(info.initialSettings.plugins.timelines)[0] :
        undefined;

    return { timelines, selected, tableSettings: {} };
});
