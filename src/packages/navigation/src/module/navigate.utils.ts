import { RouterData, 
         NavigatorAction }      from "./navigate.models";
import actions                  from "./navigate.actions";


function updatePath(
    root: RouterData, path: string, name: string, args: any
): RouterData {
    return _updatePath()

    ///

    function _updatePath(currRouter = root, splittedName = name.split("."), index = 0): RouterData {

        const currName = splittedName[index];

        if (index === splittedName.length - 1) {
            const prevPath = currRouter[currName] ? currRouter[currName].path : undefined;
            return {
                ...currRouter,
                [currName]: {
                    path,
                    prevPath,
                    subroutes: {},
                    args: { ...args }
                }
            };
        }

        const newRouter = { ...currRouter };
        if (!currRouter[currName]) {
            newRouter[currName] = {
                path: undefined,
                prevPath: undefined,
                subroutes: {}
            };
        }

        newRouter[currName].subroutes = _updatePath(
            currRouter[currName].subroutes,
            splittedName,
            index + 1
        );

        return newRouter;
    }
}

function createNavigator<T>(name: string): NavigatorAction<T> {
    const navigator: NavigatorAction<T> = (path, args) => {
        return actions.navigate(name, path, args);
    };

    return navigator;
}


function getAppNavigator(): NavigatorAction<undefined> {
    return createNavigator<undefined>("main.caseApp");
}

export default {
    updatePath,
    createNavigator,
    getAppNavigator
}
