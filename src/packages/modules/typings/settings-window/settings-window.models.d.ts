import { DataSource } from "img-spy-core";
export { DataSource } from "img-spy-core";
export interface SettingsWindowModel {
    sources: {
        selectedSource?: DataSource;
    };
}
export interface SettingsWindowState {
    settingsWindow: SettingsWindowModel;
}
