import * as React               from "react";

import { ResizeDirection,
         ResizeItemModel }      from "../module";


interface ResizeItemProps extends ResizeItemModel  {
    children: React.ReactNode;
    parentRefs: {
        [key: string]: React.ReactInstance;
    };
    direction: ResizeDirection;
}

export const ResizeItem = (resizeProps: ResizeItemProps) => {
    const { children, parentRefs, direction, ...props } = resizeProps;
    const total = getDirectionDimension(parentRefs.container as HTMLDivElement, direction);
    console.log(`Dimension: ${total}px`);

    return (
        <div className="resize-item">
            {React.Children.only(children)}
        </div>
    );

};

function getDirectionDimension(element: HTMLDivElement, direction: ResizeDirection): number {
    console.log("Get height");
    switch (direction) {
        case "horizontal":  return element.clientWidth;
        case "vertical":    return element.clientHeight;

        default:
            throw new Error(`Unknown direction: "${direction}"`);
    }

}
