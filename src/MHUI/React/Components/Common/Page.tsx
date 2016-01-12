import * as React from "react";
import { Link, IndexLink } from "react-router";

export interface PageProps extends React.Props<Page> {
    title: string;
}


export default class Page extends React.Component<PageProps, {}> {
    render() {
        return (
            <div>
                <header>
                    <h1>MoneyHulk: {this.props.title}</h1>
                </header>
                <nav>
                    <IndexLink to="/">Home</IndexLink>
                    <Link to="/Account/Login">Login</Link>
                    <Link to="/Account/Register">Register</Link>
                </nav>

                {this.props.children}
            </div>
            );
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps !== this.props;
    }
}