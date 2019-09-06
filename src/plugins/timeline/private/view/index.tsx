import * as React               from "react";
import { PluginViewBuilder }    from "img-spy-core";

import { contextMenuModule }    from "img-spy-plugin-explorer/public/modules";

import { timelineModule }       from "@public/modules";
import contextMenu              from "@public/context-menu";
import State                    from "@public/state";

import { Timeline }             from "./apps";
import globalEpic               from "./epics";


export default (viewBuilder: PluginViewBuilder<State>) => {
    const { contextMenuActions } = contextMenuModule;

    viewBuilder
        .setGlobalEpic(globalEpic)
        .addReDuckModule(timelineModule)
        .onStart(dispatch => {
            contextMenu.forEach(menuItem => {
                const action = contextMenuActions.add(menuItem);
                dispatch(action);
            });
        })
        .addApp("Timeline", <Timeline/>, {
            icon: "clock-o"
        });
}
