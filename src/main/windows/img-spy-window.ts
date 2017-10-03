import * as url             from "url";
import * as path            from "path";
import * as uuidv1          from "uuid/v1";
import { BrowserWindow,
         Menu }             from "electron";


export abstract class ImgSpyWindow<T = any> extends BrowserWindow {
    public name: string;
    public uuid: string;
    protected args: T;

    constructor(name: string, options?: Electron.BrowserWindowConstructorOptions) {
        super(options);
        this.uuid = uuidv1();
        this.name = name;
    }

    public openWindow() {
        const query = {
            view: this.name,
            uuid: this.uuid
        };
        if (this.args) {
            Object.assign(query, this.args);
        }

        this.loadURL(url.format({
            pathname: path.join(__dirname, "../../app/index.html"),
            protocol: "file:",
            slashes: true,
            query: query
        }));
    }

    protected buildContextMenu() {}
}
