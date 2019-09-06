import * as React           from "react";
import { Component }        from "react";
import Helmet               from "react-helmet";

import { api }              from "img-spy-api";
import { DirectoryPicker }  from "img-spy-material";

import T from "i18n";


interface InputProps {}

type SelectCaseProps = InputProps;

/////////

export class SelectCase extends Component<SelectCaseProps> {

    private onOpenClick(e: React.MouseEvent<HTMLButtonElement>): void {
        e.preventDefault();
        const selectedCaseName = this.casePicker.selectedFileName;
        if (selectedCaseName) {
            console.log("hello");
            api.setFolderSync(selectedCaseName);
        }
    }

    private get casePicker(): DirectoryPicker {
        return this.refs.casePicker as any;
    }

    public render() {
        return (
            <div>
                <Helmet>
                    <meta charSet="utf-8"/>
                    <title>ImgSpy - Select Case</title>
                </Helmet>
                <DirectoryPicker name="casePicker" label={T.translate("select-case.directoryPicker").toString()} ref="casePicker"></DirectoryPicker>
                <button type="button" onClick={(e) => this.onOpenClick(e)}>{T.translate("select-case.button")}</button>
            </div>
        );
    }
}
