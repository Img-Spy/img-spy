import { CONFIG }   from "main/config";
import api          from "main/main";


export const fileMenu: Electron.MenuItemConstructorOptions = {
    label: "File",
    submenu: [
        { label: "Open Folder...", accelerator: "CmdOrCtrl+a" },
        { type: "separator" },
        { label: "Close Folder", accelerator: "CmdOrCtrl+O", click: closeFolder },
        { type: "separator" },
        { label: "Settings", accelerator: "CmdOrCtrl+Alt+S", click: () => api.openSettings() },
        { type: "separator" },
        { role: "quit" }
    ]
};

function closeFolder() {
    api.setFolder(undefined);
}
