import { app, Menu }    from "electron";

import { CONFIG }       from "config";

import { fileMenu }     from "./file.menu";
import { editMenu }     from "./edit.menu";
import { windowMenu }   from "./window.menu";
import { helpMenu }     from "./help.menu";
import { devMenu }      from "./dev.menu";

const template: Electron.MenuItemConstructorOptions[] = [
    fileMenu,
    editMenu,
    // windowMenu,
    // helpMenu
];

if (CONFIG.isMacOs) {
    template.unshift({
        label: app.getName(),
        submenu: [
            { role: "about" },
            { type: "separator" },
            { role: "services", submenu: [] },
            { type: "separator" },
            { role: "hide" },
            { role: "hideothers" },
            { role: "unhide" },
            { type: "separator" },
            { role: "quit" }
        ]
    });
}

if (CONFIG.isDevelopment) {
    template.push(devMenu);
}

export const IMG_SCAN_MENU = Menu.buildFromTemplate(template);
