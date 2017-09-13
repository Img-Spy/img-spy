import * as React from "react";


export class Body extends React.Component<undefined, undefined> {

    public render() {
        return (
            <div className="fixed-table-body">
                {this.props.children}
            </div>
        );
    }
}
