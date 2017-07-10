import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class TodoApp extends Component {
    render() {
        return (
            <h1>TodoApp Boilerplate</h1>
        );
    }
}

ReactDOM.render(<TodoApp />, document.querySelector('.container'));
