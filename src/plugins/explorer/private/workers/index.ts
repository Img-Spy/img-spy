import * as fs                      from "fs";
import TSK, { TskOptions }          from "tsk-js";
import * as md5File                 from "md5-file";
import { PluginWorkersBuilder }     from "img-spy-core";

import workerInfo                   from "@public/worker-info";


export default (workerBuilder: PluginWorkersBuilder) => {
    const handler = workerBuilder.createHandler(workerInfo);

    handler.analyze((helper, dataSourcePath) => {
        const img = new TSK(dataSourcePath),
              info = img.analyze(),
              hash = md5File.sync(dataSourcePath);
    
        helper.send({ ...info, hash });
        helper.finish();
    });

    handler.list((helper, dataSourcePath, imgaddr, inode) => {
        const img = new TSK(dataSourcePath);
        const opts: TskOptions = { // Fix null values
            imgaddr, inode: inode || undefined
        };
        const files = img.list(opts);
    
        helper.send(files);
        helper.finish();
    });

    handler.virtualGet((helper, dataSourcePath, imgaddr, inode) => {
        const img = new TSK(dataSourcePath);
        const opts: TskOptions = { // Fix null values
            imgaddr, inode: inode || undefined
        };
        const content = img.get(opts);
    
        helper.send(content.toString('base64'));
        helper.finish();
    });

    handler.get((helper, filePath) => {
        fs.readFile(filePath, (err, content) => {
            if(err) {
                console.error("Cannot read file");
                helper.error(1);
            } else {
                helper.send(content.toString('base64'));
            }
            helper.finish();
        })
    });
}
