import * as React from "react";
import { Component } from "react";
export interface RouteProps {
    path: string;
}
export declare class Route extends Component<RouteProps, undefined> {
    render(): string | number | boolean | {} | React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)>) | (new (props: any) => React.Component<any, any, any>)> | React.ReactPortal;
}
