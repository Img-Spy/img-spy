import { SettingsModel, Theme, DataSource } from "./settings.models";
declare type Payload = SettingsModel | DataSource | string | Theme;
declare const _default: import("img-spy-core").ReducerBuilder<SettingsModel<any>, Payload, any>;
export default _default;
