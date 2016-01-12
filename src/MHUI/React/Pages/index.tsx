/// <reference path="../../typings/tsd.d.ts" />

import * as React from 'react';
import { Route, IndexRoute } from 'react-router';
import {createStore} from 'redux';
import {connect} from 'react-redux';
import IndexComponent from '../Components/index';
import Page from '../Components/Common/Page';

function mapStateToProps(state) {
    return {
        "foo": "bar"
    };

}

const Index = connect(mapStateToProps)(IndexComponent);

const routes = (
    <Route component={Page} path="/">
        <IndexRoute component={Index} />
    </Route>
)

export default function renderIndex(model) {
    const store = createStore(s => s, model);
    return { routes: routes, store: store };
}