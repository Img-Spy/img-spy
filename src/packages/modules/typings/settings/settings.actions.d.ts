import { Action } from "redux-actions";
import { SettingsModel, Theme, ApplySettingsPayload, DataSource } from "./settings.models";
declare const _default: {
    applySettings: (payload: ApplySettingsPayload) => Action<ApplySettingsPayload>;
    updateSettings: <T = any>(payload: SettingsModel<T>) => Action<SettingsModel<T>>;
    updateSource: (payload: DataSource) => Action<DataSource>;
    deleteSource: (path: string) => Action<string>;
    updateTheme: (theme: Theme) => Action<Theme>;
};
export default _default;
