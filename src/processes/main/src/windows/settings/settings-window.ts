import { ImgSpyWindow } from "../img-spy-window";
import { IMG_SCAN_MENU } from "./menu";


const DEFAULT_OPTIONS: Electron.BrowserWindowConstructorOptions = {
    minWidth: 600,
    minHeight: 400,
    width: 600,
    height: 400,
    show: false,
    modal: true
};

interface SettingsArgs {
    folder: string;
}

export class SettingsWindow extends ImgSpyWindow<SettingsArgs> {
    constructor(folder: string, parent: Electron.BrowserWindow, options?: Electron.BrowserWindowConstructorOptions) {
        const newOptions = Object.assign({}, options, DEFAULT_OPTIONS, {
            parent: parent
        });
        super("settings", newOptions);
        this.args = { folder };

        this.setMenu(IMG_SCAN_MENU);
    }
}
