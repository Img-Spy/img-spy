import { ActionsObservable }    from "redux-observable";
import { Observable,
         Observer }             from "rxjs";
import { Action }               from "redux-actions";


export { ImgSpyState }          from "./img-spy-state.model";
export { RouteData,
         RouterData,
         getRouter,
         NavigatePayload }      from "./route-data.model";
export { SettingsModel,
         DataSourceForm,
         Theme,
         DataSource }           from "./settings.model";
export { SettingsWindowModel }  from "./settings-window.model";
export { TerminalModel,
         TerminalLine }         from "./terminal.model";
export { getFstItem,
         getFstType,
         getFstParent,
         getFstChildren,
         getSortedChildren,
         getMountPoint,
         hasFstItem,
         isFstSelected,
         FstType,
         FstDirectory,
         FstInfo,
         FstRoot,
         FstFile,
         FstItem,
         FstParent,
         FstDataSource,
         FstUnlinkPayload,
         FstAddPayload,
         FstHashPayload }       from "./fst-watcher.model";
export { CaseWindowModel,
         FileSelector,
         DockPanelModel }       from "./case-window.model";
export { ResizeModel,
         ResizeSize,
         ResizeItemModel,
         UpdateResizePayload,
         ResizeObservable,
         StartResizePayload,
         ResizePayload,
         ResizeDirection,
         ResizeModelMap }       from "./resize.model";


export type EpicObservable<T>   = ActionsObservable<Action<T>> & Observable<Action<T>>;
export type ActionObservable<T> = Observable<Action<T>>;
export type ActionObserver<T>   = Observer<Action<T>>;
