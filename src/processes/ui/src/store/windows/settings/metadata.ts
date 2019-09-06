import { WindowMetadata, 
         ReDuckModule,
         FormModule, 
         SimpleModule }             from "img-spy-core";

import settingsReducer              from "img-spy-modules/settings";

import { resizeModule }             from "img-spy-resize";
import { navigateModule }           from "img-spy-navigation";
import * as settingsWindowModule    from "img-spy-modules/settings-window";
import * as windowsModule           from "img-spy-modules/windows";

import globalEpic                   from "./epics";
import State                        from "./state";


const metadata: WindowMetadata<State> = {
    modules: [
        new ReDuckModule(resizeModule),
        new ReDuckModule(navigateModule),
        new ReDuckModule(settingsWindowModule),
        new ReDuckModule(windowsModule),

        // Forms
        new FormModule("settings", i => settingsReducer(i)),
    ],
    globalEpic
}

export default metadata;
