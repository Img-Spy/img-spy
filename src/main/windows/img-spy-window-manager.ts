import * as url                 from "url";
import * as path                from "path";
import * as uuidv1              from "uuid/v1";
import * as fs                  from "fs";
import { BrowserWindow,
         Menu }                 from "electron";

import { CONFIG }               from "main/config";
import { SettingsModel }        from "app/models";

import { CaseWindow }           from "./case";
import { CaseSelectorWindow }   from "./case-selector";
import { SettingsWindow }       from "./settings";
import { WindowManager}         from "./window-manager";


export class ImgSpyWindowManager extends WindowManager {
    public folder: string;

    constructor(app) {
        super(app);

        this.folder = CONFIG.currentFolder;
    }

    public onReady() {
        if (this.folder) {
            this.openEditor(this.folder);
        } else {
            this.openCaseSelector();
        }
    }

    private onFstChange(ev: string, path: string) {
        this.send("case", "log-terminal", {
            text: `Detected file system event '${ev}' on file ${path}.`
        });
    }

    public openSettings(): void {
        if (!this.isOpen("case")) {
            throw Error("A main window must be open to open a dialog.");
        }

        const settingsWindow = new SettingsWindow(this.folder, this.getWindow("case"));
        this.registerWindow(settingsWindow);
    }

    private openEditor(folder: string): void {
        const caseWindow = new CaseWindow(folder);
        this.registerWindow(caseWindow);
    }

    private openCaseSelector(): void {
        const selectCaseWindow = new CaseSelectorWindow();
        this.registerWindow(selectCaseWindow);
    }

    public setFolder(folder: string) {
        this.folder = CONFIG.currentFolder = folder;

        // Close all windows
        this.reload = true;
        Object.keys(this.ctx.openWindows).forEach((windowName) => {
            const win = this.ctx.openWindows[windowName];
            win.close();
        });
    }
}
