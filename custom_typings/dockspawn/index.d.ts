


/*~ Write your module's methods and properties in this class */
declare class dockspawn {
    public DockManager: DockManagerConstructor;
    public PanelContainer: PanelContainerConstructor;
}

declare interface DockManager {
    context: DockManagerContext;

    initialize(): void;
    dockLeft(documentNode: DockNode, outline: IDockContainer, numRatio?: number): void;
}

declare interface DockManagerContext {
    model: DockModel;
}

declare interface DockModel {
    documentManagerNode: DockNode;
}

declare interface IDockContainer {
    
}

declare interface DockNode {
    
}

declare interface PanelContainer {

}

declare interface DockManagerConstructor {
    new (el: HTMLElement): DockManager;
}

declare interface PanelContainerConstructor {
    new (el: HTMLElement, dockManager: DockManager): PanelContainer;
}

/*~ If you want to expose types from your module as well, you can
 *~ place them in this block.
 */
declare namespace ElectronStore {
    export interface Options {
        defaults?: Object;
        configName?: string;
        projectName?: string;
        cwd?: string;
    }
}
