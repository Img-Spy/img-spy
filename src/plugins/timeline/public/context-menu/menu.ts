import { ContextMenuItem }  from "img-spy-plugin-explorer/public/modules/context-menu";
import tags                 from "./tags";


const menu: ContextMenuItem[] = [
    // Directory
    { text: "Generate timeline", tag: tags.TIMELINE, group: "operations",
      type: "directory", address: "virtual" },
];

export default menu;
