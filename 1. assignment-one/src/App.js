import React, { Component } from 'react';
import './App.css';
import UserInput from './UserInput/UserInput';
import UserOutput from './UserOutput/UserOutput';

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      name : 'Hung',
      isOn : false,
      persons : [
        {name : 'Hung', id : 1},
        {name : 'Dao', id : 2},
      ]
    }
  }

  usernameChangeHandler = (event) => {
    this.setState({
      name: event.target.value
    });
  }

  toggleHandler = () => {
    let isOn = this.state.isOn;
    this.setState({
      isOn : !isOn
    });
  }

  changeName (index) {
    const newList = [...this.state.persons];
    newList[index].name = "new Name";

    this.setState({
      persons: newList
    });
  }

  render() {
    let isOn = this.state.isOn;

    let person = isOn ? (
          <div>
            <UserInput  change={this.usernameChangeHandler} 
                        currentName={this.state.name}/>
            <UserOutput username={this.state.name} />
            <UserOutput username={this.state.name} />
          </div>
    ) : null;

    let list = this.state.persons.map(
      (person, index) => <li key={person.id} onClick={this.changeName.bind(this, index)}>{person.name}</li>
    );

    return (
      <div className="App">
        <button onClick={this.toggleHandler}>Toggle</button>
        {person}
        {list}
      </div>
    );
  }
}

export default App;
