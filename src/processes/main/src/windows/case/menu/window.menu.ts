import { CONFIG } from "config";


export const windowMenu: Electron.MenuItemConstructorOptions = {
    role: "window",
    submenu: [
        { role: "minimize" },
        { role: "close" }
    ]
};


if (CONFIG.isMacOs) {
    windowMenu.submenu = [
        { role: "close" },
        { role: "minimize" },
        { role: "zoom" },
        { type: "separator" },
        { role: "front" }
    ];
}
