var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var react_router_1 = require("react-router");
var Page = (function (_super) {
    __extends(Page, _super);
    function Page() {
        _super.apply(this, arguments);
    }
    Page.prototype.render = function () {
        return (React.createElement("div", null, React.createElement("header", null, React.createElement("h1", null, "MoneyHulk: ", this.props.title)), React.createElement("nav", null, React.createElement(react_router_1.IndexLink, {"to": "/"}, "Home"), React.createElement(react_router_1.Link, {"to": "/Account/Login"}, "Login"), React.createElement(react_router_1.Link, {"to": "/Account/Register"}, "Register")), this.props.children));
    };
    Page.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        return nextProps !== this.props;
    };
    return Page;
})(React.Component);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Page;
