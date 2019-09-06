import * as React from "react";
interface InputProps {
    className?: string;
    selected?: boolean;
    clickable?: boolean;
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}
declare type RowProps = InputProps;
export declare class Row extends React.Component<RowProps, undefined> {
    static defaultProps: {
        className: string;
        selected: boolean;
        clickable: boolean;
    };
    readonly className: string;
    onClick(event: React.MouseEvent<HTMLDivElement>): void;
    render(): JSX.Element;
}
export {};
