import { Action } from "redux-actions";
export declare type ActionCreator<R, A = undefined, B = undefined, C = undefined> = (a?: A, b?: B, c?: C) => Action<R>;
