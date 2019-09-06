import { Observable, Observer }     from "rxjs";
import TSK, { TskOptions }          from "tsk-js";
import { PluginWorkersBuilder }     from "img-spy-core";

import workerInfo                   from "@public/worker-info";
import { TimelineItem }             from "@public/modules/timeline";


export default (workerBuilder: PluginWorkersBuilder) => {
    const handler = workerBuilder.createHandler(workerInfo);

    handler.timeline((helper, dataSourcePath, imgaddr, inode) => {
        const img = new TSK(dataSourcePath);
        const opts: TskOptions = {// Fix null values
            imgaddr, inode: inode || undefined
        };

        // Create an observable to notify each timeline file detected
        const files$: Observable<TimelineItem[]> =
            Observable.create((observer: Observer<TimelineItem[]>) => {
                const files = img.timeline(files => {
                    observer.next(files);
                }, opts)

                observer.next(files);
                observer.complete();
            });

        // Send the files and finish when the observable is completed
        files$.subscribe(files => {
            helper.send(files);
        }, error => {
            console.log("Error generating timeline.", error);
        }, () => {
            helper.finish();
        })
    });
}
