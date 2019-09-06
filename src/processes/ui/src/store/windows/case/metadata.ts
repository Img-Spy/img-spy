import { WindowMetadata,
         ReDuckModule,
         SimpleModule,
         ReducerModule,
         FormModule }           from "img-spy-core";

import { resizeModule }         from "img-spy-resize";
import { navigateModule }       from "img-spy-navigation";
import * as fstWatcherModule    from "img-spy-modules/fst-watcher";
import * as terminalModule      from "img-spy-modules/terminal";
import * as settingsModule      from "img-spy-modules/settings";
import * as exportModule        from "img-spy-modules/export";
import * as windowsModule       from "img-spy-modules/windows";

import globalEpic               from "./epics";
import State                    from "./state";


const metadata: WindowMetadata<State> = {
    modules: [
        new ReDuckModule(resizeModule),
        new ReDuckModule(navigateModule),
        new ReDuckModule(fstWatcherModule),
        new ReDuckModule(terminalModule),
        new ReDuckModule(settingsModule),
        // new ReDuckModule(exportModule),
        new ReDuckModule(windowsModule),

        new SimpleModule("folder", i => i.args["folder"]),
        new SimpleModule("windowId", i => i.args.uuid),

        // Forms
        new FormModule("fstItem",    {}),
        new FormModule("searchForm", {}),
    ],
    globalEpic
}

export default metadata;
