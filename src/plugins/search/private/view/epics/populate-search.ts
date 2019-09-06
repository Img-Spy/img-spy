import * as path                    from "path";
import { OperatorFunction,
         Observer,
         Observable }               from "rxjs";
import { ofType }                   from "redux-observable";
import { pluck,
         scan,
         switchMap, 
         map}                       from "rxjs/operators";

import { ActionEpic }               from "img-spy-core";
import { ApiQuery,
         apiQuery,
         finalizeMap, 
         ApiCall,
         api$}                      from "img-spy-api";

import { CrtSearchPayload,
         SearchInfo,
         searchTypes,
         searchActions }            from "@public/modules/search";
import State                        from "@public/state";
import   workerInfo,
       { SearchResult }             from "@public/worker-info";


const search = (
    folder: string,
    input: CrtSearchPayload
): ApiCall<SearchResult> => (
    api
) => api
    .worker(workerInfo)
    .search(
        path.resolve(folder, input.imgPath),
        input.needle,
        input.offset,
        input.inode
    );


type Query = ApiQuery<CrtSearchPayload, SearchResult>;

/*
 * Each time a search is created, populate it.
 */
const populateSearchEpic: ActionEpic<CrtSearchPayload, State> = (
    action$, state$
) => action$.pipe(
    ofType(searchTypes.CREATE),
    pluck("payload"),
    switchMap(action => api$(search(state$.value.folder, action)).pipe(
        scan((acc: Partial<SearchInfo>, response: SearchResult) => {
            const { file, context: ctx, index } = response;
            const { rawItems } = acc;
            const context = new Buffer(ctx).toString();
            const newItem = {
                ...file,
                context,
                index
            };

            rawItems.push(newItem);

            return acc;
        }, { id: action.id, complete: false, rawItems: [] }),
        map((searchResult) => {
            return searchActions.updateSearch(searchResult);
        }),
        finalizeMap(({ payload }) => searchActions.updateSearch({
            id: payload.id,
            complete: true
        }))
    )),
    // apiQuery(search(state$.value.folder)),
    // switchMap(query$ => query$.pipe(
    //     scan((acc: Partial<SearchInfo>, {input, response}: Query) => {
    //         const { file, context: ctx, index } = response;
    //         const { id } = input;
    //         const { rawItems } = acc;
    //         const context = new Buffer(ctx).toString();

    //         acc.id = id;
    //         rawItems.push({
    //             ...file,
    //             context,
    //             index
    //         });

    //         return acc;
    //     }, { complete: false, rawItems: [] }),
    //     map((searchResult) => {
    //         return searchActions.updateSearch(searchResult);
    //     }),
    //     finalizeMap(({ payload }) => searchActions.updateSearch({
    //         id: payload.id,
    //         complete: true
    //     }))
    // )),
    // mergeMap((action) => {
    //     const { imgPath, offset, inode, needle, id } = action.payload;
    //     const initialAcc: Partial<SearchInfo> = {
    //         id,
    //         complete: false,
    //         rawItems: []
    //     };

    //     return ApiObservable
    //         .create<SearchResult>((api, cb) =>
    //             api.searchImage(imgPath, offset, inode, needle, cb))
    //         .pipe(
    //             scan((acc, res: SearchResult) => {
    //                 if (res === undefined) {
    //                     acc.complete = true;
    //                 } else {
    //                     const { file, context: ctx, index } = res;
    //                     const { rawItems } = acc;
    //                     const context = new Buffer(ctx).toString();

    //                     rawItems.push({
    //                         ...file,
    //                         context,
    //                         index
    //                     });
    //                 }

    //                 return acc;
    //             }, initialAcc),
    //             map((searchResult) => {
    //                 return actions.updateSearch(searchResult);
    //             })
    //         );
    // })
);

export default populateSearchEpic;
