import * as React from "react";


export class Header extends React.Component<undefined, undefined> {

    public render() {
        return (
            <div className="fixed-table-header flex row">
                {this.props.children}
            </div>
        );
    }
}
