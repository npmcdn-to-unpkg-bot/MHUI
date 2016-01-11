import render from '../Components/Index';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as domready from 'domReady';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import * as createHistory from 'history/lib/createBrowserHistory';

export function renderIndex(target, model) {
    domready(function () {
        const { routes: routes, store: store } = render(model);
        const history = (createHistory as any)(); // work around TypeScript module incompatibility
        const app = (
            <Provider store={store}>
                <Router history={history}>
                    {routes}
                </Router>
            </Provider>
            )
        ReactDom.render(app, document.getElementById(target));
        console.log("Running!");
    });
}