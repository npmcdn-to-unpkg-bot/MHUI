import Index from '../Components/Index';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as domready from 'domReady';

export function renderIndex(target, model) {
    domready(function () {
        ReactDom.render(React.createElement(Index), document.getElementById(target));
        console.log("Running!");
    });
}