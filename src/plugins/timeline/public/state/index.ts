import { SettingsModuleState }  from "img-spy-modules/settings";
import ExplorerState            from "img-spy-explorer-plugin/public/state";

import { TimelineModuleState }  from "../modules/timeline";


type TimelineState = SettingsModuleState & ExplorerState & TimelineModuleState;

export default TimelineState;
