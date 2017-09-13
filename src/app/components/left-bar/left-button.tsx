import * as React from "react";
import { Component } from "react";


export interface AppButtonProps {
    icon: string;
    active?: boolean;

    onClick: () => void;
}


export class LeftBarButton extends Component<AppButtonProps, undefined> {
    public render() {
        return (
            <div className={this.containerClass} onClick={this.props.onClick}>
                <i className={this.iconClass} aria-hidden="true"></i>
            </div>
        );
    }

    public get containerClass() {
        return "left-bar-button" + (this.props.active ? " active" : "");
    }

    public get iconClass() {
        return `fa fa-${this.props.icon}`;
    }
}
