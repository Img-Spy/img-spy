import { WindowMetadata,
         ReDuckModule }         from "img-spy-core";

import { resizeModule }         from "img-spy-resize";
import { navigateModule }       from "img-spy-navigation";

import globalEpic               from "./epics";
import State                    from "./state";


const metadata: WindowMetadata<State> = {
    modules: [
        new ReDuckModule(resizeModule),
        new ReDuckModule(navigateModule),
    ],
    globalEpic
}

export default metadata;
