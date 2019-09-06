import * as React from "react";
import { TabModel } from "../../module";
interface TabProps extends TabModel {
    active: boolean;
    onClick: () => void;
}
export declare class Tab extends React.Component<TabProps, undefined> {
    readonly containerClass: string;
    render(): JSX.Element;
}
export {};
