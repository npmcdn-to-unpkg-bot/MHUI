import index from "./Components/index";
import * as React from 'react';
import { renderToString } from "react-dom/server";
import { match, RoutingContext } from "react-router";
import { Provider } from "react-redux";

/*
function setupServerRender(model: string): { html: string, model: string } {
    var parsedModel = JSON.parse(model);



    return { html: "", model: model };
}*/

export function renderIndex(model, url) {
    const { routes: routes, store: store} = index(model);
    try {
        match({ routes, location: url }, (error, redirectLocation, renderProps) => {
            if (error) {
                return JSON.stringify({
                    html: "500 " + error.message,
                    result: 500

                });
            } else if (redirectLocation) {
                return JSON.stringify({
                    redirect: redirectLocation,
                    result: 302
                });
            } else if (renderProps) {
                return JSON.stringify({
                    html: renderToString(<Provider store={store}><RoutingContext {...renderProps}/></Provider>),
                    result: 200
                });
            } else {
                return JSON.stringify({
                    result: 404
                })
            }
        });

    } catch (e) {
        return JSON.stringify({
            html: `<pre>${e.toString()}</pre>`,
            result: 500
        });
    }
}