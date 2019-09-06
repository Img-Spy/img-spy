import * as React from "react";

import { DockWindow } from "./dock-window";


interface EditorProps {
    compiler: string;
    framework: string;
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export class EditorPanel extends React.Component<EditorProps, undefined> {

    public get title(): any {
        return {
            label: this.props.framework,
            closable: true
        };
    }

    public render() {
        return  (
            <div className="full-height">
                <textarea defaultValue={this.props.compiler}></textarea>
            </div>
        );
    }
}
