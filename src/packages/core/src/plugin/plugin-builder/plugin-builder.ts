import * as fs                  from "fs";
import * as path                from "path";

import { environment }          from "../../env";
import { Plugin }               from "../plugin";
import { PluginView }           from "../view";
import { PluginWorkers }        from "../workers";
import { PluginPackage }        from "../plugin-loader";

import { Builder }              from "./builder";
import { BuilderFunction }      from "./builder-function";
import { PluginViewBuilder }    from "./plugin-view-builder";
import { PluginWorkersBuilder } from "./plugin-workers-builder";


export class PluginBuilder<State> implements Builder<Plugin> {
    constructor(
        public readonly pluginPackage: PluginPackage, 
        public readonly pluginPath: string,
        public readonly pluginDirName: string
    ) {}

    public build(): Plugin<State> {
        const { pluginPackage, pluginPath, pluginDirName } = this;
        // const pluginWorkersBuilder = new PluginWorkersBuilder();

        // Use undefined to say it is not loaded and null to say it has no
        // value to prevent multiple loads
        let view: PluginView<State> = undefined;
        let workers: PluginWorkers = undefined;

        const plugin: Plugin<State> = {
            info: {
                name: this.pluginPackage.imgspy.name
            },
            get view() {
                if(view === undefined) {
                    if(pluginPackage.imgspy.view === undefined) {
                        view = null;
                        return view;
                    }

                    if(pluginPackage.imgspy.view[0] === '/') {
                        console.warn(`[${pluginPackage.imgspy.name}] Has an absolute main and it's not supported. Skipping.....`);
                        view = null;
                        return view;
                    }

                    const viewPath = path.join(pluginPath, `./${pluginDirName}/${pluginPackage.imgspy.view}`);
                    if(!fs.existsSync(`${viewPath}`)) {
                        console.warn(`[${pluginPackage.imgspy.name}] View file '${viewPath}' do not exists. Skipping.....`);
                        view = null;
                        return view;
                    }

                    const pluginViewBuilder = new PluginViewBuilder<State>();
                    const viewBuilder: BuilderFunction<PluginViewBuilder<State>> = environment.loadExternal(viewPath);
                    viewBuilder(pluginViewBuilder);
                    view = pluginViewBuilder.build() || null;
                }

                return view;
            },
            get workers() {
                if(workers === undefined) {
                    if(pluginPackage.imgspy.workers === undefined) {
                        workers = null;
                        return workers;
                    }

                    if(pluginPackage.imgspy.workers[0] === '/') {
                        console.warn(`[${pluginPackage.imgspy.name}] Has an absolute main and it's not supported. Skipping.....`);
                        workers = null;
                        return workers;
                    }

                    const workersPath = path.join(pluginPath, `./${pluginDirName}/${pluginPackage.imgspy.workers}`);
                    if(!fs.existsSync(`${workersPath}`)) {
                        console.warn(`[${pluginPackage.imgspy.name}] View file '${workersPath}' do not exists. Skipping.....`);
                        workers = null;
                        return workers;
                    }


                    const pluginWorkerBuilder = new PluginWorkersBuilder();
                    const workerBuilder: BuilderFunction<PluginWorkersBuilder> = environment.loadExternal(workersPath);
                    workerBuilder(pluginWorkerBuilder);
                    workers = pluginWorkerBuilder.build() || null;
                }

                return workers;
            }
            
        }

        return plugin;
    }
}
