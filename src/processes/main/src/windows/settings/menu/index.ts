import { app, Menu }    from "electron";
import { CONFIG }       from "config";

import { devMenu }      from "./dev.menu";


const template: Electron.MenuItemConstructorOptions[] = [
    devMenu
];

export const IMG_SCAN_MENU = CONFIG.isDevelopment ? Menu.buildFromTemplate(template) : null;
