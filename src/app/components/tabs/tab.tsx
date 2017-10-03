import * as React   from "react";

import { TabModel } from "app/models";


interface TabProps extends TabModel {
    active: boolean;

    onClick: () => void;
}


export class Tab extends React.Component<TabProps, undefined> {

    public get containerClass() {
        return "tab" + (this.props.active ? " active" : "");
    }

    public render() {
        return (
            <div className={this.containerClass} onClick={this.props.onClick}>
                <span>{this.props.text}</span>
            </div>
        );
    }
}
