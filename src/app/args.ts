

interface Args {
    view: string;
    uuid: string;
    theme: string;

    [k: string]: string;
}


function loadArgs(): Args {
    const args: Args = _loadArgs();
    if (args.view === undefined) {
        throw Error("The parameter 'view' is missing.");
    }
    if (args.uuid === undefined) {
        throw Error("The parameter 'uuid' is missing.");
    }

    return args as Args;

    /////

    function _loadArgs(): Args {

        const searchParams = new URL(window.location.toString()).searchParams as any;
        const args: any = {};
        for (const key of searchParams.keys()) {
            args[key] = searchParams.get(key);
        }
        args.theme = "dark";

        return args as Args;
    }
}

export default loadArgs();
