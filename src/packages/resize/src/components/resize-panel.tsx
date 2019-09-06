import * as React                       from "react";
import { HTMLAttributes }               from "react";
import { fromEvent,
         Subscription }                 from "rxjs";
import { sampleTime,
         debounceTime }                 from "rxjs/operators";
import { connect }                      from "react-redux";
import { bindActionCreators }           from "redux";

import { ResizeObservable }             from "img-spy-core";

import { ResizeSize,
         ResizeItemModel,
         ResizeModel,
         ResizeModuleState,
         resizeActions }                from "../module";


type MapChildrenFn = 
    (child: React.ReactNode, index: number) => React.ReactNode;

interface InputProps {
    name: string;
}

interface StateProps {
    resizeModel: ResizeModel;
}

interface DispatchProps {
    actions: {
        updateSize: (name: string, size: ResizeSize)    => void;
        start:      (name: string, index: number)       => void;
        move:       (name: string, mouse: MouseEvent)   => void;
        stop:       (name: string, mouse: MouseEvent)   => void;
    }
}

type ResizePanelProps = InputProps & StateProps & DispatchProps & HTMLAttributes<HTMLDivElement>;

export class ResizePanelClass extends React.Component<ResizePanelProps> {
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
        this.props.actions.start(this.props.resizeModel.name, index);

        this.moveSubscription = fromEvent<MouseEvent>(window, "mousemove")
            .pipe(
                sampleTime(20)
            ).subscribe(this.resize);
        this.stopSubscription = fromEvent<MouseEvent>(window, "mouseup")
            .subscribe(this.resizeEnd);
    }

    public resize(ev: MouseEvent) {
        this.props.actions.move(this.props.resizeModel.name, ev as any);
    }

    public resizeEnd(ev: MouseEvent) {
        document.body.classList.remove(`${this.props.resizeModel.direction}-resize`);
        this.props.actions.stop(this.props.resizeModel.name, ev as any);

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
                .pipe(
                    debounceTime(10)
                )
                .subscribe(this.onResize);
        }
    }

    public onResize(size: ResizeSize) {
        this.props.actions.updateSize(this.props.resizeModel.name, size);
    }

    public getItemProps(item: ResizeItemModel): React.HTMLAttributes<HTMLDivElement> {
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
                className: inClassName,
                resizeModel,
                children,

                ...props } = this.props;
        const { direction, size, items } = resizeModel;
        const className = (inClassName ? inClassName : "") + ` resize-panel ${direction}`;

        return (
            <div className={className} { ...props } ref={this.onContainerAttached}>
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


export const ResizePanel =
    connect<StateProps, DispatchProps, InputProps, ResizeModuleState>(
        (state, props) => ({
            resizeModel: state.resize[props.name]
        }),
        (dispatch, props) => ({ actions: {
            updateSize: bindActionCreators(resizeActions.updateSize, dispatch),
            start: bindActionCreators(resizeActions.start, dispatch),
            move: bindActionCreators(resizeActions.move, dispatch),
            stop: bindActionCreators(resizeActions.stop, dispatch),
        }})
)(ResizePanelClass) as React.ComponentClass<InputProps & HTMLAttributes<HTMLDivElement>>;
