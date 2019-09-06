import * as React               from "react";
import { Component }            from "react";
import { Form,
         Control }              from "react-redux-form";


interface InputProps {}

type CaseSettingsProps = InputProps;
export class CaseSettings extends Component<CaseSettingsProps> {

    public render() {
        return (
            <div className="settings-tab flex column">
                <div className="header">
                    <h1>Case Settings</h1>
                </div>
                <div className="body flex row flex-height-auto">
                    <Form model="settings.global">
                        <table>
                            <tbody>
                                <tr className="input-box">
                                    <td><label>Case name</label></td>
                                    <td>
                                        <Control.text model=".caseName"/>
                                    </td>
                                </tr>
                                <tr className="input-box">
                                    <td><label>Investigator</label></td>
                                    <td>
                                        <Control.text model=".investigator"/>
                                    </td>
                                </tr>
                                <tr className="input-box">
                                    <td><label>Description</label></td>
                                    <td>
                                        <Control.textarea model=".description"
                                                          className="description"/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Form>
                </div>
            </div>
        );
    }
}
