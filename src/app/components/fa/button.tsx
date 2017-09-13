import * as React from "react";


type FaIcons = "chevron-left";


export interface ResizeableBoxProps {
    icon: FaIcons;
    onClick: React.MouseEventHandler<undefined>;
    style?: React.CSSProperties;
}

export class Button extends React.Component<ResizeableBoxProps, undefined> {

    public render() {
        return <i className={`fa fa-${this.props.icon} fa-button`}
                  aria-hidden="true"
                  onClick={this.props.onClick}
                  style={this.props.style}></i>;
    }
}
