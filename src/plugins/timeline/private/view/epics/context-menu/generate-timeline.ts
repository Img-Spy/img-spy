import { flatMap, map }             from "rxjs/operators";
import { ofType }                   from "redux-observable";

import { ActionEpic }               from "img-spy-core";
import { terminalActions }          from "img-spy-modules/terminal";
import { navigateUtils }            from "img-spy-navigation";
import { ClickEvent,
         contextMenuOperations,
         contextMenuTypes }         from "img-spy-plugin-explorer/public/modules/context-menu";

import { contextMenuTags }          from "@public/context-menu";
import { timelineActions }          from "@public/modules/timeline";
import State                        from "@public/state";


type Input = ClickEvent;
const openInExplorerEpic: ActionEpic<Input, State> = (
    action$, state$
) => action$.pipe(
    ofType(contextMenuTypes.CLICK),
    contextMenuOperations.withTag(contextMenuTags.TIMELINE),
    map(action => action.payload.item),
    flatMap(item => [
        terminalActions.pushLine({
            level: "notice",
            text: `Generating timeline for "${item.name}"`
        }),
        timelineActions.createTimeline({
            name: item.name,
            path: item.path,
            imgPath: item.imgPath,
            date: new Date(),

            offset: item.offset,
            inode: item.inode
        }),
        navigateUtils.getAppNavigator()("Timeline")
    ])
);

export default openInExplorerEpic;
