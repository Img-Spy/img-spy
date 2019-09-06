export type FunctionMap<T> = {
    [K in keyof T]: (...args: any[]) => any;
}
