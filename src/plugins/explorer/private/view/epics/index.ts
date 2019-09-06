import { combineEpics }         from "redux-observable";

import State                    from "@public/state";

import saveFormChanges          from "./save-form-changes";
import updateActiveForm         from "./update-active-form";
import openActivePath           from "./open-active-path";
import analyzeDataSource        from "./analyze-data-source";
import virtualList              from "./virtual-list";
import contextMenu              from "./context-menu";
import getVirtualContent        from "./get-virtual-content";
import getPhysicalContentEpic   from "./get-physical-content";


export default combineEpics<any, any, State>(
    saveFormChanges,
    updateActiveForm,
    openActivePath,
    analyzeDataSource,
    virtualList,
    getVirtualContent,
    getPhysicalContentEpic,

    contextMenu
);
