declare type Optional<T> = T | undefined;
export interface PluginPackage {
    imgspy: Optional<{
        name: Optional<string>;
        view: Optional<string>;
        workers: Optional<string>;
    }>;
}
export {};
