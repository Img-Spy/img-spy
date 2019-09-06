import { Title,
         Widget }       from "@phosphor/widgets";


export interface DockWindow {
    widget: Widget;
    getWrappedInstance: () => DockWindow;
}
