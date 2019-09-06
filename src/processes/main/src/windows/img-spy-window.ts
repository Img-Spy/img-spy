import * as url_             from "url";
import * as path            from "path";
import uuidv1               from "uuid/v1";
import { BrowserWindow,
         Menu }             from "electron";
import { CONFIG }           from "config";

const url = url_;


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

        const windowUrl = url.format({
            pathname: path.join(__dirname, "./assets/index.html"),
            protocol: "file:",
            slashes: true,
            query: query
        });
        if(CONFIG.isDevelopment) {
            const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');
            installExtension(REACT_DEVELOPER_TOOLS)
                .then((name) => console.log(`Added Extension:  ${name}`))
                .catch((err) => console.log('An error occurred: ', err));
            installExtension(REDUX_DEVTOOLS)
                .then((name) => console.log(`Added Extension:  ${name}`))
                .catch((err) => console.log('An error occurred: ', err));
        //     windowUrl = url.format({
        //         host: "localhost:2003",
        //         protocol: "http:",
        //         slashes: true,
        //         query: query
        //     });

            console.log(`Loading window ${windowUrl.toString()}`);
            this.webContents.openDevTools();
        }

        this.loadURL(windowUrl);
    }

    protected buildContextMenu() {}
}
