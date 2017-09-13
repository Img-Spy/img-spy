
export const helpMenu: Electron.MenuItemConstructorOptions = {
    role: "help",
    submenu: [
        {
            label: "Learn More",
            click() { require("electron").shell.openExternal("https://electron.atom.io") }
        }
    ]
};
