import * as React from "react";


interface InputProps {}


type HeaderProps = InputProps;
export class Header extends React.Component {

    public render() {
        return (
            <div className="fixed-table-header flex row">
                {this.props.children}
            </div>
        );
    }
}
