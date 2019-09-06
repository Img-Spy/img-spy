import { NavigateModuleState, RouteData } from "./navigate.models";
declare function getRouter<T>(state: NavigateModuleState, name: string): RouteData<T>;
declare function getPath<T>(state: NavigateModuleState, name: string): string;
declare function getPrevPath<T>(state: NavigateModuleState, name: string): string;
declare function getArgs<T>(state: NavigateModuleState, name: string): T;
declare const _default: {
    getRouter: typeof getRouter;
    getPath: typeof getPath;
    getPrevPath: typeof getPrevPath;
    getArgs: typeof getArgs;
};
export default _default;
