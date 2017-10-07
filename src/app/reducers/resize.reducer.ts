import { handleActions,
         Action }               from "redux-actions";
import * as deepcopy            from "deepcopy";

import { ResizeModel,
         ResizeItemModel,
         UpdateResizePayload,
         ResizeDirection,
         StartResizePayload,
         ResizePayload,
         ResizeModelMap }       from "app/models";
import { actions }              from "app/constants";


const explorer: ResizeModel = {
    size: undefined,
    name: "explorer",
    direction: "horizontal",
    items: [
        { current: { value: 10, units: "percent" } },
        { current: { value: 90, units: "percent" } },
    ]
};

const explorerLeftBar: ResizeModel = {
    size: undefined,
    name: "explorerLeftBar",
    direction: "vertical",
    items: [
        { current: { value: 70, units: "percent" } },
        { current: { value: 30, units: "percent" } },
    ]
};

const explorerEditor: ResizeModel = {
    size: undefined,
    name: "explorerEditor",
    direction: "vertical",
    items: [
        { current: { value: 90, units: "percent" } },
        { current: { value: 10, units: "percent" } },
    ]
};

const timeline: ResizeModel = {
    size: undefined,
    name: "timeline",
    direction: "horizontal",
    items: [
        { current: { value: 20, units: "percent" } },
        { current: { value: 80, units: "percent" } },
    ]
};

const timelineResults: ResizeModel = {
    size: undefined,
    name: "timelineResults",
    direction: "vertical",
    items: [
        { current: { value: 50, units: "percent" } },
        { current: { value: 50, units: "percent" } },
    ]
};

export default () => {
    const initialState: ResizeModelMap = {
        explorerLeftBar,
        explorer,
        explorerEditor,
        timeline,
        timelineResults
    };
    return handleActions<ResizeModelMap, UpdateResizePayload | StartResizePayload | ResizePayload>({
            [actions.RSZ_UPDATE]:
                (state: ResizeModelMap, action: Action<UpdateResizePayload>): ResizeModelMap => {
                    const { name, ...props } = action.payload;
                    return {
                        ...state,
                        [name]: {
                            ...state[name],
                            ...deepcopy(props)
                        }
                    };
                },

            [actions.RSZ_START]:
                (state: ResizeModelMap, action: Action<StartResizePayload>): ResizeModelMap => {
                    const { name, index } = action.payload;
                    return {
                        ...state,
                        [name]: {
                            ...state[name],
                            rszIndex: index
                        }
                    };
                },

            [actions.RSZ_MOVE]:
                (state: ResizeModelMap, action: Action<ResizePayload>): ResizeModelMap => {
                    const { name, mouse } = action.payload;
                    const { [name]: resize } = state;
                    const items = doResize(mouse, resize);

                    return {
                        ...state,
                        [name]: {
                            ...resize,
                            items
                        }
                    };
                },

            [actions.RSZ_STOP]:
                (state: ResizeModelMap, action: Action<ResizePayload>): ResizeModelMap => {
                    const { name, mouse } = action.payload;
                    const { [name]: resize } = state;
                    const { rszIndex, ...props } = resize;
                    const items = doResize(mouse, resize);

                    return {
                        ...state,
                        [name]: {
                            ...props,
                            items
                        }
                    };
                },

        }, initialState);
    };


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
