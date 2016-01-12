var index_1 = require('../Pages/index');
var React = require('react');
var ReactDom = require('react-dom');
var domready = require('domReady');
var react_redux_1 = require('react-redux');
var react_router_1 = require('react-router');
var createHistory = require('history/lib/createBrowserHistory');
function renderIndex(target, model) {
    domready(function () {
        var _a = index_1.default(model), routes = _a.routes, store = _a.store;
        var history = createHistory(); // work around TypeScript module incompatibility
        history.listen(function (location) {
            console.log(location);
        });
        var app = (React.createElement(react_redux_1.Provider, {"store": store}, React.createElement(react_router_1.Router, {"history": history}, routes)));
        ReactDom.render(app, document.getElementById(target));
        console.log("Running!");
    });
}
exports.renderIndex = renderIndex;
