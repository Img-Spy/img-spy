import * as React from "react";
import { Component } from "react";
declare type FaIcons = "chevron-left";
export interface ResizeableBoxProps {
    icon: FaIcons;
    onClick: React.MouseEventHandler<undefined>;
    style?: React.CSSProperties;
}
export declare class Button extends Component<ResizeableBoxProps, undefined> {
    render(): JSX.Element;
}
export {};
