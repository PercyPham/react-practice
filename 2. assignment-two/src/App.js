import React, { Component } from 'react';
import ValidationComponent from './components/ValidationComponent';
import CharComponent from './components/CharComponent';

class App extends Component {
  constructor(props) {  
    super(props)  
    this.state = {
      inputValue: "",
      inputLength: ""
    };
  }

  handleChange = (event) => {
    const inputValue = event.target.value;

    this.setState({
      inputValue : inputValue,
      inputLength : inputValue.length
    });
  };

  handleClick = (index) => {
    const inputValue = this.state.inputValue;
    const newInputVal = inputValue.slice(0, index) + inputValue.slice(index + 1);

    this.setState({
      inputValue: newInputVal,
      inputLength: newInputVal.length
    });
  }

  render() {
    const charArr = this.state.inputValue.split("").map((charVal, index)=>{
      return <CharComponent key={index} charVal={charVal} handleClick={()=>{this.handleClick(index)}}/>;
    });

    console.log(charArr);

    return (
      <div>
        <ValidationComponent inputLength={this.state.inputLength}/>
        <input type="text" value={this.state.inputValue} onChange={this.handleChange}/>
        <p>{this.state.inputLength}</p>
        {charArr}
      </div>
    );
  }
}

export default App;
