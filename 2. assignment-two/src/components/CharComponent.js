import React, { Component } from "react";

class CharComponent extends Component {
    render() {
        const textStyle = {
            display: "inline-block",
            padding: "16px",
            textAlign: "center",
            margin: "16px",
            border: "1px solid black"
        };
        return (
            <span  style={textStyle} onClick={this.props.handleClick}> 
                {this.props.charVal}
            </span>
        );
    }
}

export default CharComponent;