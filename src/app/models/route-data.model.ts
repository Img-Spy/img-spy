import { ImgSpyState } from "./img-spy-state.model";


export interface RouteData<T = undefined> {
    path: string;
    prevPath?: string;
    args?: T;

    subroutes: RouterData;
}

export interface RouterData {
    [name: string]: RouteData<any>;
}

export interface NavigatePayload<T = undefined> {
    path: string;
    name: string;

    args?: T;
}

export function getRouter<T>(state: ImgSpyState, name: string): RouteData<T> {
    return _getRouter(state.navigate, name.split("."));
}

function _getRouter(currRouter: RouterData, splittedName: Array<string>, index = 0): RouteData {
    const currName = splittedName[index];

    if (index === splittedName.length - 1) {
        return currRouter[currName];
    }

    if (!currRouter[currName]) {
        return undefined;
    }

    return _getRouter(currRouter[currName].subroutes, splittedName, index + 1);
}