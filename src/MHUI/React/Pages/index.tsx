/// <reference path="../../typings/tsd.d.ts" />

import * as React from 'react';
import { Route, IndexRoute } from 'react-router';
import {createStore} from 'redux';
import {connect} from 'react-redux';
import IndexComponent from '../Components/index';
import LoginPage from '../Pages/Account/Login';
import Page from '../Components/Common/Page';
import * as Immutable from 'immutable';

function mapStateToProps(state) {
    return {
        "foo": "bar"
    };

}

function mapStateForLogin(state: Immutable.Map<String, any>) {
    return {
        submitUrl: "/Account/Login",
        requestToken: state.getIn(['common', 'RequestVerificationToken'], ''),
        requestTokenName: state.getIn(['common', 'RequestVerificationTokenName'], '')
    };
}

const Index = connect(mapStateToProps)(IndexComponent);
const Login = connect(mapStateForLogin)(LoginPage);

const routes = (
    <Route component={Page} path="/">
        <IndexRoute component={Index} />
        <Route path="/Account/Login" component={Login} />
    </Route>
);

export default function renderIndex(model) {
    var immutable = Immutable.fromJS(model);
    const store = createStore(s => s, immutable);
    return { routes: routes, store: store };
}