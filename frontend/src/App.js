import React, { Component } from "react";

import "./App.css";
import { Header } from "./components/header/Header";

import axios from "axios";
import { getAllUsers } from "./contants/http";
import { CardList } from "./components/Cards/CardList";

class App extends Component {
  state = {
    users: []
  };

  getUsers = () => {
    axios.get(getAllUsers).then(result => {
      console.log(result.data);
      this.setState({ users: result.data });
    });
  };

  componentDidMount = () => {
    this.getUsers();
  };
  render() {
    return (
      <div>
        <Header />
        <CardList users={this.state.users} />
      </div>
    );
  }
}

export default App;
