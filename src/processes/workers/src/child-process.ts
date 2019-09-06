import * as path                from "path";
import { PluginLoader,
         apiCodes,
         environment,
         QueueRequest,
         ChildProcessHelper,
         ChildProcessHandler }  from "img-spy-core";


export class ChildProcess  {
    pluginLoader: PluginLoader;
    handlers: {
        [handlerPath: string]: ChildProcessHandler
    }

    constructor() {
        const pluginFolder = path.join(environment.rootAppPath, "./assets/plugins");
        this.pluginLoader = new PluginLoader(pluginFolder);

        this.handlers = {};
    }

    public run() {
        const workerPlugins = this.pluginLoader
            .loadAll()
            .filter(p => !!p.workers);
            
        workerPlugins.forEach(plugin => {
            plugin.workers.handlers.forEach(handler => {
                this.handlers[handler.messageType] = handler;
            });
        });

        this.listen();
    }

    private listen() {
        process.on("message", (message: QueueRequest<any>, sendHandle: NodeJS.MessageListener) => {
            const handler = this.handlers[message.type];
            const helper = new ChildProcessHelper(
                process.send.bind(process),
                message.id,
                message.type,
                message.worker,
                message.queue);

            if(!handler) {
                helper.error(apiCodes.NOT_FOUND_404);
                return;
            }

            handler.handle(message, helper);
        });
    }
}
