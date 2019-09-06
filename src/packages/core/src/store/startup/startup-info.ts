import { SettingsModel }    from "../../models";

import { WindowArgs }       from "./window-args";


export interface StartupInfo<T = any> {
    initialSettings: SettingsModel<T>;
    args: WindowArgs;
}
