import * as React               from "react";

import { Slider,
         Slide }                from "app/components";

import { EditSource }           from "./edit-source";
import { SourcesList }          from "./sources-list";

interface InputSourcesSettingsProps {

}

export class SourcesSettings
    extends React.Component<InputSourcesSettingsProps, undefined> {
    public render() {
        return (
            <Slider name="main.settingsLeftBar.dataSourceSlider"
                    defaultRoute="edit-sources">
                <Slide path="sources-list"><SourcesList/></Slide>
                <Slide path="edit-source"><EditSource/></Slide>
            </Slider>
        );
    }
}
