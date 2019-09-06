import { Epic }         from "redux-observable";
import { Action }       from "redux-actions";


export type ActionEpic<I, S> = Epic<Action<I>, Action<any>, S>;
