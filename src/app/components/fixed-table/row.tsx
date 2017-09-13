import * as React from "react";


interface RowProps {
    className?: string;
    selected?: boolean;
    clickable?: boolean;

    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export class Row extends React.Component<RowProps, undefined> {
    public static defaultProps = {
        className: "",
        selected: false,
        clickable: false
    };

    public get className(): string {
        let className = `fixed-table-row flex row`;
        if (this.props.className) {
            className += ` ${this.props.className}`;
        }

        if (this.props.selected) {
            className += " selected";
        }

        if (this.props.clickable) {
            className += " clickable";
        }

        return className;
    }

    public onClick(event: React.MouseEvent<HTMLDivElement>): void {
        if (this.props.onClick) {
            this.props.onClick(event);
        }
    }

    public render() {
        return (
            <div className={this.className} onClick={(ev) => this.onClick(ev)}>
                {this.props.children}
            </div>
        );
    }
}
