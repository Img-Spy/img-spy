
import * as ElectronStore from "electron-store";

class Version {
    public static CURR = new Version("0.0.5");

    protected _version: number[];
    constructor(strVersion: string) {
        this._version = strVersion.split(".").map((v) => parseInt(v));
    }

    public equals(other: Version): number {
        const length = Math.max(this._version.length, other._version.length);

        for (let i = 0; i < length; i++) {
            const vA = this._version[i],
                  vB = other._version[i];

            if (vA > vB) {
                return 1;
            } else if (vA < vB) {
                return -1;
            }
        }

        return 0;
    }

    public toString() {
        return this._version.join(".");
    }
}

const DEFAULT_CONFIG = {
    version: Version.CURR.toString(),
    isDevelopment: process.env.NODE_ENV === "development"
};

class ImgSpyConfig extends ElectronStore {
    constructor() {
        super({
            defaults: DEFAULT_CONFIG
        });

        switch (Version.CURR.equals(this.version)) {
            case 1: this.upgrade(); break;
            case 0: break;
            case -1: this.downgrade(); break;
        }
    }

    private upgrade() {
        this.store = DEFAULT_CONFIG;
    }
    private downgrade() {

    }

    public get isDevelopment(): boolean {
        return this.get("isDevelopment");
    }
    public set isDevelopment(v: boolean) {
        this.set("isDevelopment", v);
    }

    public get isMacOs() {
        return process.platform === "darwin";
    }

    public get version(): Version {
        return new Version(this.get("version"));
    }

    public get currentFolder(): string {
        return this.get("currentFolder");
    }
    public set currentFolder(v: string) {
        this.set("currentFolder", v);
    }
}


export const CONFIG = new ImgSpyConfig();
