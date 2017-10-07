import { Observable,
         Observer }                 from "rxjs";
import { Store }                    from "redux";
import { Action }                   from "redux-actions";
import { actions as formActions }   from "react-redux-form";
import { combineEpics }             from "redux-observable";

import { TimelineAnalysis }         from "main/models";

import { actions }                  from "app/constants";
import { EpicObservable,
         ImgSpyState,
         ApiObservable,
         Sink,
         TimelineInfo,
         CrtTimelinePayload }       from "app/models";
import { updateTimeline,
         selectTimeline,
         updateSettings }           from "app/actions";


/*
 * Each time a timline is created, populate it.
 */
const populateTimelineEpic = (
    action$: EpicObservable<CrtTimelinePayload>,
    store: Store<ImgSpyState>
) =>
action$
    .ofType(actions.CRT_TIMELINE)
    .mergeMap((action) => {
        const { imgPath, offset, inode, path } = action.payload;

        return ApiObservable
            .create<TimelineAnalysis>((api, cb) =>
                api.timelineImage(imgPath, offset, inode, cb))
            .map((res) => {
                return updateTimeline({
                    path,
                    complete: res.finish,
                    rawItems: res.files,
                    sortedItems: res.files
                });
            });
    });


/*
 * One active element should be selected if posible
 */
const activateTimlineEpic = (
    action$: EpicObservable<CrtTimelinePayload | string>,
    store: Store<ImgSpyState>
) =>
Observable
    .merge(
        /* The a timeline has been created, select it */
        (action$
            .ofType(actions.CRT_TIMELINE) as EpicObservable<CrtTimelinePayload>)
            .map((action) => selectTimeline(action.payload.path)),

        /* Active item is deleted, select another one of possible */
        (action$
            .ofType(actions.DELETE_TIMELINE) as EpicObservable<string>)
            .filter((action) => {
                const { timeline } = store.getState();
                return timeline.selected === action.payload &&
                        Object.keys(timeline.timelines).length > 0;
            })
            .map(() => {
                const { timelines } = store.getState().timeline;
                return selectTimeline(Object.keys(timelines)[0]);
            })
    );


/*
 * Update settings autosave the current timelines
 */
const autosaveTimlineEpic = (
    action$: EpicObservable<Partial<TimelineInfo>>,
    store: Store<ImgSpyState>
) =>
Observable
    .merge(
        /* When it's finished */
        action$
            .ofType(actions.UPDATE_TIMELINE)
            .filter(action => {
                const { path } = action.payload;
                const timeline = store.getState().timeline.timelines[path];

                return timeline.complete;
            }),

        /* When it's deleted */
        action$
            .ofType(actions.DELETE_TIMELINE)
    )
    .debounceTime(1000)
    .map(action => {
        const { settings, timeline } = store.getState();
        return updateSettings({
            ...settings,
            timelines: timeline.timelines
        });
    });


export default () =>
    (combineEpics as any)(
        populateTimelineEpic,
        activateTimlineEpic,
        autosaveTimlineEpic
    );
