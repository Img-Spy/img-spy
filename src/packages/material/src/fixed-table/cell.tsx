import * as React from "react";


interface InputProps {}


type CellProps = InputProps;
export class Cell extends React.Component {

    public render() {
        return (
            <div className="fixed-table-cell">
                {this.props.children}
            </div>
        );
    }
}
