import * as React from 'react';

export interface NavItemProps extends React.Props<NavItem> {
}

export default class NavItem extends React.Component<NavItemProps, {}> {
    render() {
        return (
            <ul className="nav navbar-nav">
                <li>{this.props.children}</li>
            </ul>
            );
    }

}