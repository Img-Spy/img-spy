import * as React               from "react";


interface ResizeBarProps {
    index: number;
}

export const ResizeBar = (props: ResizeBarProps): JSX.Element => {

    return (
        <span className={`resize-bar`}/>
    );
};
