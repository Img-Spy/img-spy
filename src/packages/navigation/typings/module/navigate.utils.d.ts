import { RouterData, NavigatorAction } from "./navigate.models";
declare function updatePath(root: RouterData, path: string, name: string, args: any): RouterData;
declare function createNavigator<T>(name: string): NavigatorAction<T>;
declare function getAppNavigator(): NavigatorAction<undefined>;
declare const _default: {
    updatePath: typeof updatePath;
    createNavigator: typeof createNavigator;
    getAppNavigator: typeof getAppNavigator;
};
export default _default;
