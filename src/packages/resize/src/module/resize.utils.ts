import { ResizeModel,
         ResizeItemModel,
         ResizeDirection }          from "./resize.models";


function getMouseValue(direction: ResizeDirection, mouse: MouseEvent): number {
    switch (direction) {
        case "horizontal":  return mouse.clientX;
        case "vertical":    return mouse.clientY;

        default:
            throw new Error(`Unknown direction: "${direction}"`);
    }
}

function getSizeValue(direction: ResizeDirection, resize: ResizeModel): number {
    switch (direction) {
        case "horizontal":  return resize.size.width;
        case "vertical":    return resize.size.height;

        default:
            throw new Error(`Unknown direction: "${direction}"`);
    }
}

function getInitialSizeValue(direction: ResizeDirection, resize: ResizeModel): number {
    switch (direction) {
        case "horizontal":  return resize.size.widthStart;
        case "vertical":    return resize.size.heightStart;

        default:
            throw new Error(`Unknown direction: "${direction}"`);
    }
}

function doResize(mouse: MouseEvent, resize: ResizeModel): Array<ResizeItemModel> {
    const items = [...resize.items];
    const { direction } = resize;
    const size = getSizeValue(direction, resize);
    const initialSize = getInitialSizeValue(direction, resize);
    const mouseValue = getMouseValue(direction, mouse);
    let mousePercent = (mouseValue - initialSize) / size * 100;

    let percentAcc = 0;
    for (let i = 0; i < resize.rszIndex; i++) {
        const item = items[i];
        percentAcc += item.current.value;
    }

    if (mousePercent < percentAcc) {
        mousePercent = percentAcc;
    }

    if (mousePercent > 100) {
        mousePercent = 100;
    }

    items[resize.rszIndex] = {
        ...resize.items[resize.rszIndex],

        current: { value: mousePercent, units: "percent" }
    };

    items[resize.rszIndex + 1] = {
        ...resize.items[resize.rszIndex + 1],
        
        current: { value: 100 - mousePercent, units: "percent" }
    };

    return items;
}


export default {
    doResize
}