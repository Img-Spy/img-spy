import ExplorerState            from "img-spy-explorer-plugin/public/state";
import { SettingsModuleState }  from "img-spy-modules/settings";

import { SearchModuleState }    from "../modules/search";


type SearchState = SettingsModuleState & ExplorerState & SearchModuleState;

export default SearchState;
