import React, { Component } from 'react';

class ValidationComponent extends Component {
    render() {
        const len = this.props.inputLength;
        const result = len <= 5 ? "Text too short" : "Text long enough";
        return (
            <p>{result}</p>
        );
    }
}

export default ValidationComponent;
