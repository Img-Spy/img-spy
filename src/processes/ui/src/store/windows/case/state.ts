import { FormState }            from "react-redux-form";

import { SettingsModel }        from "img-spy-core";

import { NavigateModuleState }  from "img-spy-navigation";
import { ResizeModuleState }    from "img-spy-resize";
import { FstState,
         FstItem }              from "img-spy-modules/fst-watcher";
import { TerminalModel }        from "img-spy-modules/terminal";
import { WindowsModelState }    from "img-spy-modules/windows";


type CaseState =
    NavigateModuleState &
    WindowsModelState &
    ResizeModuleState &
    FstState & {
    terminal: TerminalModel;

    settings: SettingsModel;

    folder: string;
    windowId: string;

    // Forms
    fstItem: FstItem;
    searchForm: any;

    forms: {
        fstItem: { $form: FormState };
        searchForm: { $form: FormState };
    }
}

export default CaseState;
