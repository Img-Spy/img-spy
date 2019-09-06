import { merge }                    from "rxjs";
import { map,
         filter,
         debounceTime }             from "rxjs/operators";
import { ofType }                   from "redux-observable";

import { ActionEpic }               from "img-spy-core";

import { settingsActions }          from "img-spy-modules/settings";

import { TimelineInfo,
         timelineTypes,
         TimelineSettings }         from "@public/modules/timeline";
import State                        from "@public/state";


/*
 * Update settings auto-save the current timelines
 */
type Payload = Partial<TimelineInfo>;
const autoSaveTimelineEpic: ActionEpic<Payload, State> = (
    action$, state$
) => merge(
    /* When it's finished */
    action$.pipe(
        ofType(timelineTypes.UPDATE),
        filter(action => {
            const { path } = action.payload;
            const timeline = state$.value.timeline.timelines[path];
            
            return timeline.complete;
        })
    ),

    /* When it's deleted */
    action$.pipe(
        ofType(timelineTypes.DELETE)
    )
).pipe(
    debounceTime(1000),
    map(action => {
        console.log("auto save settings")
        const { settings, timeline } = state$.value;
        return settingsActions.updateSettings<TimelineSettings>({
            ...settings,
            plugins: {
                timelines: timeline.timelines
            }
        });
    })
);

export default autoSaveTimelineEpic;

