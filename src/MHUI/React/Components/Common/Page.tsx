import * as React from "react";
import { Link, IndexLink } from "react-router";
import { Navbar, Nav, NavbarBrand, PageHeader } from "react-bootstrap";
import NavItem from "./NavItem";

export interface PageProps extends React.Props<Page> {
    title: string;
}


export default class Page extends React.Component<PageProps, {}> {
    render() {
        return (
            <div className="container">
                <Navbar>
                    <NavbarBrand>Moneyhulk</NavbarBrand>
                    <Nav>
                        <NavItem><IndexLink to="/">Home</IndexLink></NavItem>
                    </Nav>
                    <Nav pullRight>
                        <NavItem><Link to="/Account/Login">Login</Link></NavItem>
                        <NavItem><Link to="/Account/Register">Register</Link></NavItem>
                    </Nav>
                    </Navbar>
                <PageHeader>
                    MoneyHulk: {this.props.title}
                </PageHeader>
                {this.props.children}
            </div>
            );
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps !== this.props;
    }
}