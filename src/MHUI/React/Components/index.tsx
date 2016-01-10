
/// <reference path="../../typings/tsd.d.ts" />

import * as React from 'react';
import * as reactDom from 'react-dom';
import * as reactDomServer from 'react-dom/server';
declare var global;

export default class Index extends React.Component<any, any> {
    render() {
        return <div> Running react!</div>;
    }
}