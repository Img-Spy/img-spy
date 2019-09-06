import * as React from "react";


interface InputProps {
    width: string;
}


type ColumnProps = InputProps;
export class Column extends React.Component<ColumnProps> {

    public render() {
        return (
            <div className="fixed-table-cell">
                {this.props.children}
            </div>
        );
    }
}
