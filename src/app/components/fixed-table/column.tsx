import * as React from "react";

interface ColumnProps {
    width: string;
}

export class Column extends React.Component<ColumnProps, undefined> {

    public render() {
        return (
            <div className="fixed-table-cell">
                {this.props.children}
            </div>
        );
    }
}
