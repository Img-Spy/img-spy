import { Observable, Observer }     from "rxjs";
import TSK, { TskOptions }          from "tsk-js";
import { PluginWorkersBuilder }     from "img-spy-core";

import workerInfo, 
       { SearchResult }             from "@public/worker-info";


export default (workerBuilder: PluginWorkersBuilder) => {
    const handler = workerBuilder.createHandler(workerInfo);

    handler.search((helper, dataSourcePath, needle, imgaddr, inode) => {
        const img = new TSK(dataSourcePath);
        const opts: TskOptions = {// Fix null values
            imgaddr, inode: inode || undefined
        };

        // Create an observable to notify each timeline file detected
        const files$: Observable<SearchResult> =
            Observable.create((observer: Observer<SearchResult>) => {

                img.search(
                    needle,
                    (result, index) => observer.next({
                        file: result.file,
                        context: result.context,
                        index: result.character
                    }),
                    opts
                );

                observer.complete();
            });

        // Send the files and finish when the observable is completed
        files$.subscribe(files => {
            helper.send(files);
        }, error => {
            console.log("Error generating search results.", error);
        }, () => {
            helper.finish();
        })
    });
    // handler.analyze((helper, dataSourcePath) => {
    // const img = new TSK(dataSourcePath),
    //         info = img.analyze(),
    //         hash = md5File.sync(dataSourcePath);

    // helper.send({ ...info, hash });
    // helper.finish();
    // });

    // handler.list((helper, dataSourcePath, imgaddr, inode) => {
    // const img = new TSK(dataSourcePath);
    // const opts: TskOptions = { // Fix null values
    //     imgaddr, inode: inode || undefined
    // };
    // const files = img.list(opts);

    // helper.send(files);
    // helper.finish();
    // });
}
