import * as electron from "electron";

import { ImgSpyWindow } from "../img-spy-window";
import { IMG_SCAN_MENU } from "./menu";

const DEFAULT_OPTIONS: Electron.BrowserWindowConstructorOptions = {
    width: 500,
    height: 105,
    resizable: false,
    show: false,
    center: true
};


export class CaseSelectorWindow extends ImgSpyWindow<undefined> {
    constructor(options?: Electron.BrowserWindowConstructorOptions) {
        const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;
        const newOptions = Object.assign({
            x: Math.floor((width - DEFAULT_OPTIONS.width) / 2),
            y: Math.floor((height - DEFAULT_OPTIONS.height) / 2),
        }, options, DEFAULT_OPTIONS);
        super("case-selector", newOptions);

        this.setMenu(IMG_SCAN_MENU);
    }
}
