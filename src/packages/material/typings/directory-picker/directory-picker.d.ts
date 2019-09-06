import { Component } from "react";
interface DirectoryPickerProps {
    name: string;
    label: string;
}
interface DirectoryPickerState {
    selectedFile: File;
}
export declare class DirectoryPicker extends Component<DirectoryPickerProps, DirectoryPickerState> {
    componentDidMount(): void;
    onDirectoryChange(e: any): void;
    readonly selectedFileName: string;
    render(): JSX.Element;
}
export {};
