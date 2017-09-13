import * as React               from "react";

export interface SlideProps {
    path: string;
    style?: React.CSSProperties;
}

export class Slide extends React.Component<SlideProps, undefined> {
    public render() {
        return <div className="slide" style={this.props.style}>
            <div className="slide-size-fixer">
                {this.props.children}
            </div>
        </div>;
    }
}
