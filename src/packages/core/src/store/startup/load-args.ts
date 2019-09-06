import { WindowArgs }   from "./window-args";

function loadArgs(): WindowArgs {
    const args: WindowArgs = _loadArgs();
    if (args.view === undefined) {
        throw Error("The parameter 'view' is missing.");
    }
    if (args.uuid === undefined) {
        throw Error("The parameter 'uuid' is missing.");
    }

    return args as WindowArgs;

    /////

    function _loadArgs(): WindowArgs {

        const searchParams = new URL(window.location.toString()).searchParams as any;
        const args: any = {};
        for (const key of searchParams.keys()) {
            args[key] = searchParams.get(key);
        }
        args.theme = "dark";

        return args as WindowArgs;
    }
}

export default loadArgs;
