import { DataSource }   from "./settings.model";


export interface SettingsWindowModel {
    sources: {
        selectedSource?: DataSource;
    };
}
