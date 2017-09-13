import { handleActions,
         Action }           from "redux-actions";

import { RouterData,
         RouteData,
         NavigatePayload }  from "app/models";
import { actions }          from "app/constants";
import args                 from "app/args";


export default () => {
    const initialState: RouterData = loadInitialState();
    function loadInitialState(): RouterData {
        const main: RouteData<any> = {
            path: args.view,
            subroutes: {},
            args: Object.assign({}, args)
        };
        delete main.args.view;

        return { main };
    }

    return handleActions<RouterData, NavigatePayload>({
        [actions.NAVIGATE]: (state: RouterData, action: Action<NavigatePayload>): RouterData => {
            const { name, path, args } = action.payload;
            return updatePath();

            ///

            function updatePath(currRouter = state, splittedName = name.split("."), index = 0): RouterData {
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

                newRouter[currName].subroutes = updatePath(
                    currRouter[currName].subroutes,
                    splittedName,
                    index + 1
                );

                return newRouter;
            }
        }
    }, initialState);
};
