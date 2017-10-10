import { handleActions,
         Action }               from "redux-actions";

import { SettingsModel,
         TimelinesModel,
         TimelineInfo,
         TableSettings,
         CrtTimelinePayload }   from "app/models";
import { actions }              from "app/constants";


const createTimelineReducer = (
    state: TimelinesModel,
    action: Action<CrtTimelinePayload>
): TimelinesModel => {
    const { name, path, date, imgPath, offset, inode } = action.payload;
    const { timelines } = state;

    return {
        ...state,
        timelines: {
            ...timelines,

            [path]: {
                name, path, date, imgPath, offset, inode,

                // Defaults
                tableSettings: {
                    defaultSorted: [ { id: "date", desc: true } ]
                },
                complete: false,
                rawItems: [],
                sortedItems: []
            }
        }
    };
};

const updateTimelineReducer = (
    state: TimelinesModel,
    action: Action<Partial<TimelineInfo>>
): TimelinesModel => {
    const { path, ...update } = action.payload;
    const { [path]: prev } = state.timelines;
    const { timelines } = state;

    return {
        ...state,
        timelines: {
            ...timelines,

            [path]: {
                ...prev,
                ...update
            }
        }
    };
};

const deleteTimelineReducer = (
    state: TimelinesModel,
    action: Action<string>
): TimelinesModel => {
    const path = action.payload;
    const { [path]: deleted, ...timelines } = state.timelines;

    return {
        ...state,
        timelines,
    };
};

const selectTimelineReducer = (
    state: TimelinesModel,
    action: Action<string>
): TimelinesModel => {
    const { payload: selected } = action;

    return { ...state, selected };
};

const updateTimelineTableReducer = (
    state: TimelinesModel,
    action: Action<Partial<TableSettings>>
): TimelinesModel => {
    const { payload: update } = action;
    const { tableSettings: prev } = state;

    return {
        ...state,
        tableSettings: {
            ...prev,
            ...update
        }
    };
};

export default (settings: SettingsModel) => {

    const initialState: TimelinesModel = {
        timelines: settings.timelines || {},
        selected: settings.timelines ?
            Object.keys(settings.timelines)[0] :
            undefined,
        tableSettings: {}
     };

    return handleActions<TimelinesModel, any>({
        [actions.CREATE_TIMELINE]: createTimelineReducer,
        [actions.UPDATE_TIMELINE]: updateTimelineReducer,
        [actions.DELETE_TIMELINE]: deleteTimelineReducer,
        [actions.SELECT_TIMELINE]: selectTimelineReducer,
        [actions.TABLE_TIMELINE]:  updateTimelineTableReducer

    }, initialState);
};
