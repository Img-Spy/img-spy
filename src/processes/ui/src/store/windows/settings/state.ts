import { FormState }            from "react-redux-form";

import { SettingsModel, 
         DataSourceForm }       from "img-spy-core";
import { NavigateModuleState }  from "img-spy-navigation";
import { ResizeModuleState }    from "img-spy-resize";
import { FstState }             from "img-spy-modules/fst-watcher";
import { SettingsWindowState }  from "img-spy-modules/settings-window";
import { WindowsModelState }    from "img-spy-modules/windows";


type SettingsState =
    NavigateModuleState &
    SettingsWindowState &
    WindowsModelState &
    FstState &
    ResizeModuleState & {

    // Forms
    settings: SettingsModel;
    dataSource: DataSourceForm;

    forms: {
        settings: { $form: FormState },
        dataSource: { $form: FormState }
    };
}

export default SettingsState;
