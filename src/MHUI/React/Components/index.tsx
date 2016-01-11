/// <reference path="../../typings/tsd.d.ts" />

import * as React from 'react';
import { Route } from 'react-router';
import {createStore} from 'redux';


class Index extends React.Component<any, any> {
    render() {
        return <div> Running react!</div>;
    }
}

const routes = (
    <Route path="/" component={Index} />
)

export default function renderIndex(model) {
    const store = createStore(s => s, model);
    return { routes: routes, store: store };
}