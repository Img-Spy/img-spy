import { remote, MenuItem }     from "electron";

import { FstItem }              from "img-spy-modules/fst-watcher";

import { ContextMenu,
         ContextMenuItem }      from "@public/modules/context-menu";

export class CaseHierarchyMenu {
    private _electronMenu: Electron.Menu;

    constructor(
        private folder: string,
        private item: FstItem,
        private menu: ContextMenu,
        private onClickEvent: (menuItem: ContextMenuItem, item: FstItem) => void
    ) {
        this.filterMenuItems.bind(this);
        this.buildMenuItem.bind(this);

        this.buildMenu();
    }

    filterMenuItems(menuItem: ContextMenuItem): boolean {
        return (
            menuItem.address === "all" || menuItem.address === this.item.address
        ) && (
            menuItem.type    === "all" || menuItem.type    === this.item.type
        );
    }

    buildMenuItem(menuItem: ContextMenuItem, item: FstItem): Electron.MenuItem {
        const onClickEvent = this.onClickEvent;
        return new remote.MenuItem({
            label: menuItem.text,
            click() { onClickEvent(menuItem, item); }
        });
    }

    buildMenu() {
        this._electronMenu = new remote.Menu();
        const menuGroups: Array<MenuItem[]> = Object.keys(this.menu)
            .map(group => this.menu[group])
            .map(menuItems => menuItems
                .filter(menuItem => this.filterMenuItems(menuItem))
                .map(menuItem => this.buildMenuItem(menuItem, this.item))
            )
            .filter(menuItems => !!menuItems.length);

        menuGroups.forEach((menuGroup, i) => {
            menuGroup.forEach(menuItem => this._electronMenu.append(menuItem));
            if(i < menuGroups.length - 1) {
                this.electronMenu.append(new remote.MenuItem({
                    type: "separator"
                }))
            }
        });
    }

    public get electronMenu(): Electron.Menu {
        return this._electronMenu;
    }
}
