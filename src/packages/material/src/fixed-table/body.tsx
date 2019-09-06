import * as React from "react";


interface InputProps {}


type BodyProps = InputProps;
export class Body extends React.Component<BodyProps> {

    public render() {
        return (
            <div className="fixed-table-body">
                {this.props.children}
            </div>
        );
    }
}
