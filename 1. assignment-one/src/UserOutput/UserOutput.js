import React from 'react';
import './UserOutput.css';

const userOutput = (props) => {

    const styleBlue = {
        color : "blue"
    };

    return (
        <div>
            <p style={styleBlue}>{props.username}</p>
            <p className="styleGray">p2</p>
        </div>
    );
};

export default userOutput;