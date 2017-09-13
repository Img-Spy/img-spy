import * as React               from "react";
import { bindActionCreators }   from "redux";
import { connect,
         MapStateToProps,
         MapDispatchToProps,
         DispatchProp }         from "react-redux";

import { ImgSpyState,
         getRouter,
         RouteData }            from "app/models";
import { createNavigator,
         Navigator }            from "app/actions";

import { Slide,
         SlideProps }           from "./slide";


interface InputSliderProps {
    name: string;
    defaultRoute?: string;
}

interface SliderActions<T> {
    navigate: Navigator<T>;
}

interface SliderProps<T = any> extends InputSliderProps {
    className?: string;
    prevPath: string;
    path: string;

    actions?: SliderActions<T>;
}

const mapStateToProps: MapStateToProps<SliderProps, InputSliderProps> =
    (state: ImgSpyState, props: InputSliderProps) => {
        const router = getRouter(state, props.name);

        let path, prevPath;
        if (router) {
            path = router.path;
            prevPath = router.prevPath;
        }

        const cState: SliderProps = { name, path, prevPath };
        return cState as any;
    };

const mapDispachToProps: MapDispatchToProps<SliderProps, InputSliderProps> =
    (dispatch, props) => {
        const actions: SliderActions<any> = {
            navigate: bindActionCreators(createNavigator(props.name), dispatch)
        };

        return { actions } as any;
    };



export class SliderClass extends React.Component<SliderProps, undefined> {
    private animationCounter = 0;
    public static defaultProps = {
        className: ""
    };

    public componentWillMount() {
        if (this.props.path === undefined && this.props.defaultRoute) {
            this.props.actions.navigate(this.props.defaultRoute);
        }
    }

    public get className(): string {
        return `slider slider-${this.props.path} ${this.props.className}`;
    }

    public buildAnimationStyle(length) {
        return Array.apply(null, Array(length))
            .map((_, i) =>
                `@keyframes selector-to-${i}-animation { 
                    to { left: ${-i * 100}% }
                }
                .selector-to-${i} {
                    animation: selector-to-${i}-animation 0.5s ease forwards;
                }

                .selector-from-${i} {
                    left: ${-i * 100}%;
                }
                `)
            .reduce((acc, curr) => acc + curr, "");
    }

    public render() {
        let to = 0;
        let from = 0;
        const children = [];
        React.Children.forEach(this.props.children, (ch: React.ReactElement<any>, i) => {
            if (ch.props.path === this.props.path) {
                to = i;
            } else if (ch.props.path === this.props.prevPath) {
                from = i;
            }

            const left = `${i * 100}%`;
            children.push(
                <Slide key={i} path={ch.props.path} style={{left}}>
                    {ch.props.children}
                </Slide>
            );
        });

        return (
            <div className={this.className}>
                <style>{this.buildAnimationStyle(children.length)}</style>
                <div className={`slider-selector selector-from-${from} selector-to-${to}`}>
                    {children}
                </div>
            </div>
        );
    }
}

export const Slider = connect(mapStateToProps, mapDispachToProps)(SliderClass) as React.ComponentClass<InputSliderProps>;
