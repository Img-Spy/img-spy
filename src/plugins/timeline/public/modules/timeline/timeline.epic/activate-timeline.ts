import { merge }                    from "rxjs";
import { map,
         filter }                   from "rxjs/operators";
import { ofType }                   from "redux-observable";

import { ActionEpic,
         EpicObservable }           from "img-spy-core";

import { CrtTimelinePayload,
         TimelineModuleState }      from "../timeline.models";
import actions                      from "../timeline.actions";
import types                        from "../timeline.types";


/*
 * One active element should be selected if possible
 */
type Payload = CrtTimelinePayload | string;
const activateTimelineEpic: ActionEpic<Payload, TimelineModuleState> = (
    action$, state$
) => merge(
    /* The a timeline has been created, select it */
    (action$ as EpicObservable<CrtTimelinePayload>).pipe(
        ofType(types.CREATE),
        map((action) => actions.selectTimeline(action.payload.path))
    ),

    /* Active item is deleted, select another one if possible */
    (action$ as EpicObservable<string>).pipe(
        ofType(types.DELETE),
        filter((action) => {
            const { timeline } = state$.value;
            return timeline.selected === action.payload &&
                    Object.keys(timeline.timelines).length > 0;
        }),
        map(() => {
            const { timelines } = state$.value.timeline;
            return actions.selectTimeline(Object.keys(timelines)[0]);
        })
    )
);

export default activateTimelineEpic;
