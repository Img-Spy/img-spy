import * as React from "react";
import { Component } from "react";

export interface ResizeableBoxProps {
    initialWidth: number;
}

export interface ResizeableBoxState {
    style: React.CSSProperties;
}

export class ResizeableBox extends Component<ResizeableBoxProps, ResizeableBoxState> {
    public state = {
        style: {
            width: this.props.initialWidth
        }
    };

    public render() {
        return  (
            <div className="resizeable-box" style={this.state.style}>
                <div></div>
            </div>
        );
    }
}
