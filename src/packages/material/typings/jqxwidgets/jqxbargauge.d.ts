import * as React from "react";
export declare class JqxBarGauge extends React.Component<any, undefined> {
    private componentSelector;
    private style;
    private template;
    componentDidMount(): void;
    manageAttributes(): {};
    createComponent(options: any): void;
    setOptions(options: any): void;
    getOptions(): {};
    on(name: any, callbackFn: any): void;
    off(name: any): void;
    animationDuration(arg: any): any;
    backgroundColor(arg: any): any;
    barSpacing(arg: any): any;
    baseValue(arg: any): any;
    colorScheme(arg: any): any;
    customColorScheme(arg: any): any;
    disabled(arg: any): any;
    endAngle(arg: any): any;
    formatFunction(arg: any): any;
    height(arg: any): any;
    labels(arg: any): any;
    max(arg: any): any;
    min(arg: any): any;
    relativeInnerRadius(arg: any): any;
    rendered(arg: any): any;
    startAngle(arg: any): any;
    title(arg: any): any;
    tooltip(arg: any): any;
    useGradient(arg: any): any;
    values(arg: any): any;
    width(arg: any): any;
    refresh(): void;
    performRender(): void;
    val(value: any): any;
    render(): JSX.Element;
}