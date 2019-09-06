import * as React               from "react";
import { PluginViewBuilder }    from "img-spy-core";

import { explorerModule,
         contextMenuModule }    from "@public/modules";
import contextMenu              from "@public/context-menu";
import State                    from "@public/state";

import { Explorer }             from "./apps";
import globalEpic               from "./epics";


export default (viewBuilder: PluginViewBuilder<State>) => {
    const { contextMenuActions } = contextMenuModule;

    viewBuilder
        .setGlobalEpic(globalEpic)
        .onStart(dispatch => {
            contextMenu.forEach(menuItem => {
                const action = contextMenuActions.add(menuItem);
                dispatch(action);
            });
        })
        .addReDuckModule(explorerModule)
        .addReDuckModule(contextMenuModule)
        .addApp("Explorer", <Explorer/>, {
            icon: "archive"
        });
}
