import Index from "./Components/index";
import * as React from 'react';
import { renderToString } from "react-dom/server";

/*
function setupServerRender(model: string): { html: string, model: string } {
    var parsedModel = JSON.parse(model);



    return { html: "", model: model };
}*/

export function renderIndex(model) {

    return JSON.stringify({
        html: renderToString(React.createElement(Index)),
        model: ""
    });
}