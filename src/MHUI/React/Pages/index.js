/// <reference path="../../typings/tsd.d.ts" />
var React = require('react');
var react_router_1 = require('react-router');
var redux_1 = require('redux');
var react_redux_1 = require('react-redux');
var index_1 = require('../Components/index');
var Page_1 = require('../Components/Common/Page');
function mapStateToProps(state) {
    return {
        "foo": "bar"
    };
}
var Index = react_redux_1.connect(mapStateToProps)(index_1.default);
var routes = (React.createElement(react_router_1.Route, {"component": Page_1.default, "path": "/"}, React.createElement(react_router_1.IndexRoute, {"component": Index})));
function renderIndex(model) {
    var store = redux_1.createStore(function (s) { return s; }, model);
    return { routes: routes, store: store };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = renderIndex;
