// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
import * as React from "react";

import { client }   from "electron-connect";
import { render }   from "react-dom";
import { Provider } from "react-redux";

import { CONFIG }   from "main/config";

import { App }      from "./components";
import { appStore } from "./store";
import args         from "./args";


bootstrap(
    <Provider store={appStore}>
        <App/>
    </Provider>
);

/////

function bootstrap<P>(element: React.ReactElement<P>): React.Component<P, React.ComponentState> | Element | void {
    const reactRoot = render(element, document.getElementById("app"));

    if (CONFIG.isDevelopment) {
        client.create();
        (window as any).reactRoot = reactRoot;
    }

    return reactRoot;
}
