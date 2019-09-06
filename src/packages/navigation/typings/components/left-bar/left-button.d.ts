import { Component } from "react";
export interface AppButtonProps {
    icon: string;
    active?: boolean;
    onClick: () => void;
}
export declare class LeftBarButton extends Component<AppButtonProps, undefined> {
    render(): JSX.Element;
    readonly containerClass: string;
    readonly iconClass: string;
}
