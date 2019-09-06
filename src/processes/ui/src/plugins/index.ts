import * as path            from "path";
import { PluginLoader,
         environment }      from "img-spy-core";
import { ImgSpyState }      from "store/state";


const pluginsPath = path.join(environment.rootAppPath, "./assets/plugins");
const pluginLoader = new PluginLoader(pluginsPath);

const viewPlugins = pluginLoader.loadAll<ImgSpyState>().filter(p => !!p.view);

export { viewPlugins }
