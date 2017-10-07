import * as React                       from "react";
import { Observable,
         Subscription }                 from "rxjs";
import { bindActionCreators }           from "redux";
import { connect,
         Provider,
         MapDispatchToProps,
         MapStateToProps }              from "react-redux";

import { ImgSpyState,
         ResizeSize,
         ResizeItemModel,
         ResizeDirection,
         ResizeObservable,
         ResizeModel }                  from "app/models";
import { updateResizeSize,
         moveResize,
         startResize,
         stopResize }                   from "app/actions";

import { ResizeBar }                    from "./resize-bar";
import { ResizeItem }                   from "./resize-item";


type MapChildrenFn = (child: React.ReactChild, index: number) => React.ReactNode;

interface InputResizePanelProps extends React.HTMLAttributes<HTMLDivElement> {
    name: string;
}

interface ResizePanelActions {
    updateResizeSize: (name: string, size: ResizeSize) => void;
    startResize: (name: string, index: number) => void;
    moveResize: (name: string, mouse: MouseEvent) => void;
    stopResize: (name: string, mouse: MouseEvent) => void;
}

interface ResizePanelProps extends React.HTMLAttributes<HTMLDivElement> {
    name?: string;
    resizeModel?: ResizeModel;
    dispatch?: any;

    actions?: ResizePanelActions;
}

const mapStateToProps: MapStateToProps<ResizePanelProps, InputResizePanelProps> =
    (state: ImgSpyState, props) => {
        const resizeModel = state.resize[props.name];
        const mapProps: ResizePanelProps = { resizeModel };

        return mapProps as any;
    };

const mapDispatchToProps: MapDispatchToProps<ResizePanelProps, InputResizePanelProps> =
    (dispatch, props) => {
        const actions: ResizePanelActions = {
            updateResizeSize: bindActionCreators(updateResizeSize, dispatch),
            startResize: bindActionCreators(startResize, dispatch),
            moveResize: bindActionCreators(moveResize, dispatch),
            stopResize: bindActionCreators(stopResize, dispatch),
        };

        return { actions } as any;
    };


export class ResizePanelClass extends React.Component<ResizePanelProps, undefined> {
    public static displayName = "ResizePanel";
    private resizeSubscription: Subscription;
    private moveSubscription: Subscription;
    private stopSubscription: Subscription;

    constructor(props?: ResizePanelProps, context?: any) {
        super(props, context);

        /// Bind
        this.resizeStart = this.resizeStart.bind(this);
        this.resize = this.resize.bind(this);
        this.resizeEnd = this.resizeEnd.bind(this);

        this.onContainerAttached = this.onContainerAttached.bind(this);
        this.onResize = this.onResize.bind(this);
    }

    public resizeStart(ev: React.MouseEvent<HTMLElement>, index: number) {
        document.body.classList.add(`${this.props.resizeModel.direction}-resize`);
        this.props.actions.startResize(this.props.resizeModel.name, index);

        this.moveSubscription = Observable
            .fromEvent<MouseEvent>(window, "mousemove")
            .sampleTime(20)
            .subscribe(this.resize);
        this.stopSubscription = Observable
            .fromEvent<MouseEvent>(window, "mouseup")
            .subscribe(this.resizeEnd);
    }

    public resize(ev: MouseEvent) {
        this.props.actions.moveResize(this.props.resizeModel.name, ev as any);
    }

    public resizeEnd(ev: MouseEvent) {
        document.body.classList.remove(`${this.props.resizeModel.direction}-resize`);
        this.props.actions.stopResize(this.props.resizeModel.name, ev as any);

        this.moveSubscription.unsubscribe();
        this.stopSubscription.unsubscribe();
    }

    public processChildren(children: React.ReactNode, fn: MapChildrenFn): React.ReactNode {
        const retChildren = [];

        React.Children.forEach(children, (child, i) => {
            if (i > 0) {
                const index = i - 1;
                retChildren.push(
                    <span key={`bar-${index}`}
                          className="resize-bar"
                          onMouseDown={(ev) => this.resizeStart(ev, index)}
                    />
                );
            }
            retChildren.push(fn(child, i));
        });

        return retChildren;
    }

    public get directionProperty(): string {
        switch (this.props.resizeModel.direction) {
            case "horizontal":  return "width";
            case "vertical":    return "height";

            default:
                throw new Error(`Unknown direction: "${this.props.resizeModel.direction}"`);
        }
    }

    public onContainerAttached(container: HTMLDivElement) {
        if (container === null) {
            this.resizeSubscription.unsubscribe();
        } else {
            this.resizeSubscription = ResizeObservable
                .create(container)
                .debounceTime(10)
                .subscribe(this.onResize);
        }
    }

    public onResize(size: ResizeSize) {
        this.props.actions.updateResizeSize(this.props.resizeModel.name, size);
    }

    public getItemProps(item: ResizeItemModel): React.HTMLAttributes<HTMLDivElement> {
        const propName = this.directionProperty;
        const { [propName]: size } = this.props.resizeModel.size;

        let value;
        switch (item.current.units) {
            case "percent":
            value = item.current.value;
            break;
        }

        const style: React.CSSProperties = {
            flex: `0 ${value}%`
        };

        return { style };
    }

    public render() {
        const { name,
                actions,
                dispatch,
                className: inClassName,
                resizeModel,
                children,

                ...props: divProps } = this.props;
        const { direction, size, items } = resizeModel;
        const className = (inClassName ? inClassName : "") + ` resize-panel ${direction}`;

        return (
            <div className={className} { ...divProps } ref={this.onContainerAttached}>
                { size && this.processChildren(children, (child, i) =>
                    <div key={i.toString()} className="resize-item"
                         {...this.getItemProps(items[i])}>
                        {child}
                    </div>
                )}
            </div>
        );
    }
}

export const ResizePanel = connect(
    mapStateToProps,
    mapDispatchToProps
)(ResizePanelClass) as React.ComponentClass<InputResizePanelProps>;
