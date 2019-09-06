import fs                           from "fs";
import md5                          from "md5";
import { merge }                    from "rxjs";
import { remote }                   from "electron";
import { filter,
         map }                      from "rxjs/operators";
import { ofType }                   from "redux-observable";
import { Action }                   from "redux-actions";

import { ActionEpic }               from "img-spy-core";
import { FstItem,
         fstWatcherTypes }          from "img-spy-modules/fst-watcher";

import State                        from "./state";


// TODO: Create a do nothing action
function doNothing(): Action<undefined> {
    return { type: "FODERBARLALALA", payload: undefined };
}

type Input = FstItem;
const openOutFileEpic: ActionEpic<Input, State> = (
    action$, state$
) => merge(
    action$.pipe(
        ofType(fstWatcherTypes.OPEN_OUT),
        filter((action) => {
            const file = action.payload;
            return file.address === "physical";
        }),
        map((action) => {
            const { folder } = state$.value;
            const file = action.payload;
            const fullPath = `${folder}/${file.path}`;
            remote.shell.openItem(fullPath);

            return doNothing();
        })
    ),

    action$.pipe(
        ofType(fstWatcherTypes.OPEN_OUT),
        filter((action) => {
            const file = action.payload;
            return file.address === "virtual";
        }),
        map((action) => {
            const file = action.payload;
            const tmpPath = remote.app.getPath("temp");
            const tmpName = md5(file.path);
            const fullPath = `${tmpPath}/${tmpName}-${file.name}`;

            fs.writeFile(fullPath, file.content, () => {
                remote.shell.openItem(fullPath);
            });

            return doNothing();
        })
    )
);

export default openOutFileEpic;
