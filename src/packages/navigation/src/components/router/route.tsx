import * as React from "react";
import { Component, ReactSVG } from "react";


export interface RouteProps {
    path: string;
}

export class Route extends Component<RouteProps, undefined> {

    public render() {
        return React.Children.only(this.props.children);
    }
}
