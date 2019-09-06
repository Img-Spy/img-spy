export interface PluginAppSettings {
    icon: string;
}
export interface PluginApp extends PluginAppSettings {
    name: string;
    view: JSX.Element;
}
