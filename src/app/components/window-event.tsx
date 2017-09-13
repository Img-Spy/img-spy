import { ipcRenderer }          from "electron";
import * as React               from "react";
import { connect,
         MapStateToProps }      from "react-redux";

import { api }                  from "app/api";
import { ImgSpyState }          from "app/models";
import { ImgSpyEvents }         from "main/models";


interface InputWindowEventProps {
    event: ImgSpyEvents;
    action: Function;
}

interface WindowEventProps {
    event?: ImgSpyEvents;
    uuid?: string;

    action?: Function;
}

const mapStateToProps: MapStateToProps<WindowEventProps, InputWindowEventProps> =
    (state: ImgSpyState, props) => {
        const mapProps: WindowEventProps = {
            uuid:  state.navigate.main.args.uuid
        };
        return mapProps as any;
    };

export class WindowEventClass extends React.Component<WindowEventProps, InputWindowEventProps> {

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

export const WindowEvent = connect(mapStateToProps)(WindowEventClass) as React.ComponentClass<InputWindowEventProps>;
