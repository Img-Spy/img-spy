import { Action } from "redux-actions";


export interface Navigator<T> {
    (path: string, args?: T): void;
}

export interface TabModel {
    path: string;
    text: string;
}

export interface NavigatorAction<T> {
    (path: string, args?: T): Action<NavigatePayload<T>>;
}

export interface RouteData<T = undefined, S = undefined> {
    path: string;
    prevPath?: string;
    args?: T;

    subroutes: RouterData<S>;
}

export interface RouterData<T = undefined> {
    [name: string]: RouteData<T>;
}

export interface NavigatePayload<T = undefined> {
    path: string;
    name: string;

    args?: T;
}

export interface NavigateModuleState {
    navigate: RouterData;
}
