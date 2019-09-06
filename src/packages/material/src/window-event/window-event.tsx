import { ipcRenderer }          from "electron";
import * as React               from "react";

import { WindowEventType }      from "img-spy-core";


interface InputProps {
    event: WindowEventType;
    uuid: string;
    action: Function;
}

export class WindowEvent extends React.Component<InputProps> {
    public static displayName = "WindowEvent";

    public componentWillMount(): void {
        console.log(`Event binded: ${this.props.event}`);
        ipcRenderer.on(this.props.event, (sender, args) => {
            console.log("Event received");
            return this.props.action(sender, args);
        });
    }

    public render() {
        return null;
    }
}
