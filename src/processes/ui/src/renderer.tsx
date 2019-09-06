// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
import * as React           from "react";
import { client }           from "electron-connect";
import { render }           from "react-dom";
import { Provider }         from "react-redux";

import { Theme }            from "img-spy-core";
import { api }              from "img-spy-api";

import { settingsActions }  from "img-spy-modules/settings";

import appStore             from "./store";
import Routes               from "./routes";

// TODO: Fix this absurd path
import "../../../node_modules/font-awesome/scss/font-awesome.scss";
import "../../../node_modules/react-table/react-table.css";

import "./style/base.scss";
import "./style/golden-layout-base.css";
import "./style/dark-theme.scss";


const store = appStore();

const AppBody = () => (
    <Provider store={store}>
        <Routes/>
    </Provider>
);

bootstrap(AppBody);

/////

function bootstrap(AppBody: React.Factory<{}>) {
    const reactContainer = document.createElement('div');
    reactContainer.id = "app";
    document.body.appendChild(reactContainer);

    const reactRoot = render(<AppBody/>, reactContainer);

    if (process.env.NODE_ENV === "development") {
        console.info("Starting electron connect client");
        client.create();
        
        (window as any).api = api;
        (window as any).store = store;
        (window as any).devtools = require("electron-devtools-installer");
        (window as any).devtools.install = require("electron-devtools-installer").default;

        (window as any).reactRoot = reactRoot;
        (window as any).changeTheme = (theme: Theme) => {
            store.dispatch(settingsActions.updateTheme(theme));
        };
    }
}
