import * as React from 'react';

import { Input, ButtonInput } from 'react-bootstrap';

export interface LoginProps extends React.Props<Login> {
    submitUrl: string
    requestToken: string
    requestTokenName: string
}

export default class Login extends React.Component<LoginProps, {}> {
    render() {
        return <form action={this.props.submitUrl} method="POST">
            <Input type="text" label="Email address" name="Email" />
            <Input type="password" label="Password" name="Password" />
            <Input type="checkbox" label="Remember me" name="RememberMe" />
            <ButtonInput type="submit" value="login" />
            <input type="hidden" name={this.props.requestTokenName} value={this.props.requestToken} />
            <div><a href="">Forgot your password?</a></div>
        </form>;
    }
}