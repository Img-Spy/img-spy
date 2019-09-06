import { ipcMain }      from "electron";
import { channels }     from "img-spy-core";

export const fileMenu: Electron.MenuItemConstructorOptions = {
    label: "File",
    submenu: [
        // { label: "Open Folder...", accelerator: "CmdOrCtrl+a" },
        { label: "Close Folder", accelerator: "CmdOrCtrl+O", click: closeFolder },
        { type: "separator" },
        { label: "Settings", accelerator: "CmdOrCtrl+Alt+S", click: () => console.log("Not implemented") },
        { type: "separator" },
        { role: "quit" }
    ]
};

function closeFolder() {
    ipcMain.emit(channels.SET_FOLDER, undefined);
}
