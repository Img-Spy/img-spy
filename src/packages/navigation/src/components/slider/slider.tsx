import * as React               from "react";

import { bindActionCreators }   from "redux";
import { connect }              from "react-redux";
import { Navigator,
         NavigateModuleState,
         navigateSelectors,
         navigateUtils }        from "../../module";

import { Slide }                from "./slide";


interface InputProps {
    name: string;
    className?: string;
    defaultRoute?: string;
}

interface StateProps {
    prevPath: string;
    path: string;
}

interface DispatchProps {
    actions: {
        navigate: Navigator<any>;
    }
}

type SliderProps = InputProps & StateProps & DispatchProps;

class SliderClass extends React.Component<SliderProps> {
    public static displayName = "Slider";
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


export const Slider = 
    connect<StateProps, DispatchProps, InputProps, NavigateModuleState>(
        (state, props) => ({
            path: navigateSelectors.getPath(state, props.name),
            prevPath: navigateSelectors.getPrevPath(state, props.name)
        }),
        (dispatch, props) => ({ actions: {
            navigate: bindActionCreators(
                navigateUtils.createNavigator(props.name), dispatch
            )
        }})
)(SliderClass) as React.ComponentClass<InputProps>;
