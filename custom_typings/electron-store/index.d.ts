


/*~ This declaration specifies that the class constructor function
 *~ is the exported object from the file
 */
declare module "electron-store" {
    export = ElectronStore;
}


/*~ Write your module's methods and properties in this class */
declare class ElectronStore {
    public store: any;

    constructor(options?: ElectronStore.Options);

    public set(key: string, value: any): void;
    public set(object: any): void;

    public get(key: string, defaultValue?: any): any;

    public has(key: string): boolean;

    public delete(key: string): void;

    public clear(): void;
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
