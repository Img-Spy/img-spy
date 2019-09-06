import * as React from "react";
interface InputProps {
    columnWidths: Array<number>;
    className?: string;
}
declare type TableProps = InputProps;
export declare class Table extends React.Component<TableProps, undefined> {
    static defaultProps: {
        className: string;
    };
    render(): JSX.Element;
    getColumnStyle(width: any, i: any): string;
}
export {};
