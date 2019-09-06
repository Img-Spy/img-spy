import * as React               from "react";
import { PluginViewBuilder }    from "img-spy-core";

import { searchModule }         from "@public/modules";
import State                    from "@public/state";

import { Search }               from "./apps";
import globalEpic               from "./epics";


export default (viewBuilder: PluginViewBuilder<State>) => {
    viewBuilder
        .setGlobalEpic(globalEpic)
        .addReDuckModule(searchModule)
        .addApp("Search", <Search/>, {
            icon: "search",
        });
}
