import * as React from "react";
import { WindowEventType } from "img-spy-core";
interface InputProps {
    event: WindowEventType;
    uuid: string;
    action: Function;
}
export declare class WindowEvent extends React.Component<InputProps> {
    static displayName: string;
    componentWillMount(): void;
    render(): any;
}
export {};
