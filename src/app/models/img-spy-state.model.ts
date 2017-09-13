import { FstDirectory,
         FstItem }              from "./fst-watcher.model";
import { RouterData,
         RouteData }            from "./route-data.model";
import { SettingsModel,
         DataSourceForm }       from "./settings.model";
import { SettingsWindowModel }  from "./settings-window.model";
import { TerminalModel }        from "./terminal.model";
import { CaseWindowModel }      from "./case-window.model";
import { ResizeModelMap }       from "./resize.model";


export interface ImgSpyState {
    navigate: RouterData;
    resize: ResizeModelMap;
    forms: any;

    isPinging: boolean;
    settings: SettingsModel;
    dataSource: DataSourceForm;
    settingsWindow?: SettingsWindowModel;

    terminal: TerminalModel;

    fstRoot: FstDirectory;
    fstItem: FstItem;
    caseWindow: CaseWindowModel;
}

export interface CaseState {
    navigate: RouterData;

    settings: SettingsModel;
    terminal: TerminalModel;
    fstRoot: FstDirectory;
}
