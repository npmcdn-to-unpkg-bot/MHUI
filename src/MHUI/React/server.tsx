import ri from "./Pages/index";
import * as React from 'react';
import { renderToString } from "react-dom/server";
import { match, RoutingContext } from "react-router";
import { Provider } from "react-redux";

/*
function setupServerRender(model: string): { html: string, model: string } {
    var parsedModel = JSON.parse(model);



    return { html: "", model: model };
}*/

declare var console;

export function renderIndex(model, url) {

    console = {
        messages: []
    };
    console.log = function (msg) { console.messages.push(msg.toString()) };
    console.error = function (msg) { console.messages.push(msg.toString()) };

    const { routes: routes, store: store} = ri(JSON.parse(model));
    var result;
    try {
        match({ routes, location: url }, (error, redirectLocation, renderProps) => {
            if (error) {
                result = {
                    message: "500 " + error.message,
                    result: 500,
                    console: console.messages

                };
            } else if (redirectLocation) {
                result = ({
                    redirect: redirectLocation,
                    result: 302,
                    console: console.messages
                });
            } else if (renderProps) {
                result = ({
                    html: renderToString(<Provider store={store}><RoutingContext {...renderProps}/></Provider>),
                    result: 200,
                    console: console.messages
                });
            } else {
                result = ({
                    result: 404,
                    console: console.messages
                })
            }
        });

    } catch (e) {
        result = ({
            html: `<pre>${e.toString()}</pre>`,
            result: 500,
            console: console.messages
        });
    }
    return JSON.stringify(result);
}