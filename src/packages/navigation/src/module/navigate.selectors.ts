import { NavigateModuleState,
         RouteData,
         RouterData }       from "./navigate.models";


function getRouter<T>(state: NavigateModuleState, name: string): RouteData<T> {
    return _getRouter(state.navigate, name.split("."));
}

function _getRouter(currRouter: RouterData, splittedName: Array<string>, index = 0): RouteData {
    const currName = splittedName[index];

    if (index === splittedName.length - 1) {
        return currRouter[currName];
    }

    if (!currRouter[currName]) {
        return undefined;
    }

    return _getRouter(currRouter[currName].subroutes, splittedName, index + 1);
}

function getPath<T>(state: NavigateModuleState, name: string): string {
    const router = getRouter<T>(state, name);
    return router ? router.path : undefined;
}

function getPrevPath<T>(state: NavigateModuleState, name: string): string {
    const router = getRouter<T>(state, name);
    return router ? router.prevPath : undefined;
}

function getArgs<T>(state: NavigateModuleState, name: string): T {
    const router = getRouter<T>(state, name);
    return router ? router.args : undefined;
}


export default {
    getRouter,
    getPath,
    getPrevPath,
    getArgs
};
