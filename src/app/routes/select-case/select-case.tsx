import * as React           from "react";
import { Component,
         ReactSVG }         from "react";
import { T }                from "i18n";

import { CONFIG }           from "main/config";
import { DirectoryPicker }  from "app/components";
import { api }              from "app/api";


export class SelectCase extends Component<undefined, undefined> {

    private onOpenClick(e: React.MouseEvent<HTMLButtonElement>): void {
        e.preventDefault();
        const selectedCaseName = this.casePicker.selectedFileName;
        if (selectedCaseName) {
            api.setFolder(selectedCaseName);
        }
    }

    private get casePicker(): DirectoryPicker {
        return this.refs.casePicker as any;
    }

    public render() {
        return (
            <div>
                <DirectoryPicker name="casePicker" label={T.translate("select-case.directoryPicker")} ref="casePicker"></DirectoryPicker>
                <button type="button" onClick={(e) => this.onOpenClick(e)}>{T.translate("select-case.button")}</button>
            </div>
        );
    }
}
