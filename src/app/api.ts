import { Observable,
         Observer }     from "rxjs";
import { remote }       from "electron";

import { ImgSpyApi }    from "main/models";


export const api: ImgSpyApi = remote.require("../main/main").default;

// @TODO: For debug porposes
(window as any).api = api;
