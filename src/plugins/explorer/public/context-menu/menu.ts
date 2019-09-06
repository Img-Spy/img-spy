import { ContextMenuItem }  from "../modules/context-menu";
import tags                 from "./tags";


const menu: ContextMenuItem[] = [
    // Directory
    { text: "Open in explorer", tag: tags.OPEN, group: "navigation",
      type: "directory", address: "physical" },

    // File 
    { text: "Open", tag: tags.OPEN, group: "navigation",
      type: "file" },
    { text: "Export", tag: tags.EXPORT, group: "exports",
      type: "file" }
];

export default menu;
