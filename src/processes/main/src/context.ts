import { ImgSpyWindow } from "./windows/img-spy-window";

export interface IContext {
    openWindows: {
        [name: string]: ImgSpyWindow
    };
}
