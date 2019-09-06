import * as React from "react";

import { Cell } from "./cell";


interface InputProps {
    columnWidths: Array<number>;

    className?: string;
}


type TableProps = InputProps;
export class Table extends React.Component<TableProps, undefined> {
    public static defaultProps = {
        className: ""
    };

    public render() {
        const styles =
            this.props.columnWidths
                .map((width, i) =>
                    `div.fixed-table-cell:nth-child(${i + 1}) { ${this.getColumnStyle(width, i)} }`
                )
                .reduce((acc, curr) => {
                    return `${acc} ${curr}`;
                }, "");


        return (
            <div className={`fixed-table flex column ${this.props.className}`}>
                <style>{styles}</style>
                {this.props.children}
                <div className="fixed-table-footer flex row">
                    {this.props.columnWidths.map((w, i) => <Cell key={i}/>)}
                </div>
            </div>
        );
    }

    public getColumnStyle(width, i): string {
        return width ?
            `min-width: ${width}px;` :
            `flex: 1 1 auto;`;
    }
}
