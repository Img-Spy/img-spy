import * as React from "react";

const JQXLite = (window as any).JQXLite;
export const jqx = (window as any).jqx;


export class JqxDockingLayout extends React.Component<any, undefined> {
    private componentSelector: string;
    private style: any;
    private template: any;

    componentDidMount() {
        const options = this.manageAttributes();
        this.createComponent(options);
    }

    manageAttributes() {
        const properties = [
            "contextMenu", "height", "layout", "minGroupHeight",
            "minGroupWidth", "resizable", "rtl", "theme", "width"
        ];

        const options = {};
        for (const item in this.props) {
            if (item === "settings") {
                for (const itemTwo in this.props[item]) {
                    options[itemTwo] = this.props[item][itemTwo];
                }
            } else {
                if (properties.indexOf(item) !== -1) {
                    options[item] = this.props[item];
                }
            }
        }
        return options;
    }

    createComponent(options) {
        if (!this.style) {
            for (const style in this.props.style) {
                JQXLite(this.componentSelector).css(style, this.props.style[style]);
            }
        }
        if (this.props.className !== undefined) {
            const classes = this.props.className.split(" ");
            for (let i = 0; i < classes.length; i++) {
                JQXLite(this.componentSelector).addClass(classes[i]);
            }
        }
        if (!this.template) {
            JQXLite(this.componentSelector).html(this.props.template);
        }
        JQXLite(this.componentSelector).jqxDockingLayout(options);
    }

    setOptions(options) {
        JQXLite(this.componentSelector).jqxDockingLayout("setOptions", options);
    }

    getOptions() {
        if (arguments.length === 0) {
            throw Error("At least one argument expected in getOptions()!");
        }
        const resultToReturn = {};
        for (let i = 0; i < arguments.length; i++) {
            resultToReturn[arguments[i]] = JQXLite(this.componentSelector).jqxDockingLayout(arguments[i]);
        }
        return resultToReturn;
    }

    on(name, callbackFn) {
        JQXLite(this.componentSelector).on(name, callbackFn);
    }

    off(name) {
        JQXLite(this.componentSelector).off(name);
    }

    contextMenu(arg) {
        if (arg !== undefined) {
            JQXLite(this.componentSelector).jqxDockingLayout("contextMenu", arg);
        } else {
            return JQXLite(this.componentSelector).jqxDockingLayout("contextMenu");
        }
    }

    height(arg) {
        if (arg !== undefined) {
            JQXLite(this.componentSelector).jqxDockingLayout("height", arg);
        } else {
            return JQXLite(this.componentSelector).jqxDockingLayout("height");
        }
    }

    layout(arg) {
        if (arg !== undefined) {
            JQXLite(this.componentSelector).jqxDockingLayout("layout", arg);
        } else {
            return JQXLite(this.componentSelector).jqxDockingLayout("layout");
        }
    }

    minGroupHeight(arg) {
        if (arg !== undefined) {
            JQXLite(this.componentSelector).jqxDockingLayout("minGroupHeight", arg);
        } else {
            return JQXLite(this.componentSelector).jqxDockingLayout("minGroupHeight");
        }
    }

    minGroupWidth(arg) {
        if (arg !== undefined) {
            JQXLite(this.componentSelector).jqxDockingLayout("minGroupWidth", arg);
        } else {
            return JQXLite(this.componentSelector).jqxDockingLayout("minGroupWidth");
        }
    }

    resizable(arg) {
        if (arg !== undefined) {
            JQXLite(this.componentSelector).jqxDockingLayout("resizable", arg);
        } else {
            return JQXLite(this.componentSelector).jqxDockingLayout("resizable");
        }
    }

    rtl(arg) {
        if (arg !== undefined) {
            JQXLite(this.componentSelector).jqxDockingLayout("rtl", arg);
        } else {
            return JQXLite(this.componentSelector).jqxDockingLayout("rtl");
        }
    }

    theme(arg) {
        if (arg !== undefined) {
            JQXLite(this.componentSelector).jqxDockingLayout("theme", arg);
        } else {
            return JQXLite(this.componentSelector).jqxDockingLayout("theme");
        }
    }

    width(arg) {
        if (arg !== undefined) {
            JQXLite(this.componentSelector).jqxDockingLayout("width", arg);
        } else {
            return JQXLite(this.componentSelector).jqxDockingLayout("width");
        }
    }

    addFloatGroup(width, height, position, panelType, title, content, initContent) {
        JQXLite(this.componentSelector).jqxDockingLayout("addFloatGroup", width, height, position, panelType, title, content, initContent);
    }

    destroy() {
        JQXLite(this.componentSelector).jqxDockingLayout("destroy");
    }

    loadLayout(layout) {
        JQXLite(this.componentSelector).jqxDockingLayout("loadLayout", layout);
    }

    refresh() {
        JQXLite(this.componentSelector).jqxDockingLayout("refresh");
    }

    performRender() {
        JQXLite(this.componentSelector).jqxDockingLayout("render");
    }

    saveLayout() {
        return JQXLite(this.componentSelector).jqxDockingLayout("saveLayout");
    }

    render() {
        const id = "jqxDockingLayout" + JQXLite.generateID();
        this.componentSelector = "#" + id;
        return (
            <div id={ id }> { this.props.value }{ this.props.children } </div>
        );
    }
}
