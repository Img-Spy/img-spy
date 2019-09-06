import { Theme } from "./theme.model";
import { DataSource } from "./data-source.model";
export interface SettingsModel<PluginSettings = any> {
    global: {
        caseName: string;
        investigator?: string;
        description?: string;
    };
    sources: {
        [id: string]: DataSource;
    };
    theme: Theme;
    plugins: PluginSettings;
}
