import * as React from "react";



export class Cell extends React.Component<undefined, undefined> {

    public render() {
        return (
            <div className="fixed-table-cell">
                {this.props.children}
            </div>
        );
    }
}
