


/*~ Write your module's methods and properties in this class */
declare interface WcDockerConstructor {
    DOCK: Docks;

    new (container: HTMLElement, options?: WcDockerOptions): WcDocker;
}

declare interface WcDocker {
    addPanel(name: string, orientation: Dock);

    registerPanelType(name: string, registerOptions: WcPanelRegisterOptions, isPrivate?: boolean);
}

declare interface WcDockerOptions {
    themePath?: string;
}

declare interface WcPanelRegisterOptions {
    onCreate?: (panel: WcPanel, options?: any) => void;
}

declare interface WcPanel {
    addItem(item: HTMLElement)
}

declare interface Dock { }

declare interface Docks {
    LEFT: Dock;
    BOTTOM: Dock;
    RIGHT: Dock;
    TOP: Dock;
}