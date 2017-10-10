import { Action }               from "redux-actions";

import { CrtTimelinePayload,
         TableSettings,
         TimelineInfo }         from "app/models";
import { actions }              from "app/constants";


export const createTimeline =
    (payload: CrtTimelinePayload): Action<CrtTimelinePayload> =>
        ({ type: actions.CREATE_TIMELINE, payload });

export const updateTimeline =
    (payload: Partial<TimelineInfo>): Action<Partial<TimelineInfo>> =>
        ({ type: actions.UPDATE_TIMELINE, payload });

export const selectTimeline = (payload: string): Action<string> =>
        ({ type: actions.SELECT_TIMELINE, payload });

export const deleteTimeline = (payload: string): Action<string> =>
        ({ type: actions.DELETE_TIMELINE, payload });

export const updateTimelineTable =
    (payload: TableSettings): Action<TableSettings> =>
        ({ type: actions.TABLE_TIMELINE, payload });
