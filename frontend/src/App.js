import React, { Component } from "react";

import "./App.css";
import { Header } from "./components/header/Header";

import axios from "axios";
import { getAllUsers, baseUrl } from "./contants/http";
import { CardList } from "./components/Cards/CardList";
import EditCard from "./components/Cards/EditCard/EditCard";

class App extends Component {
  state = {
    users: [],
    edit: false,
    curr: null
  };

  getUsers = () => {
    axios.get(getAllUsers).then(result => {
      this.setState({ users: result.data });
    });
  };

  editProfil = id => {
    const { users } = this.state;
    console.log(users);
    console.log(id);
    let curr = users.filter(user => {
      return user.ID === id;
    });
    console.log(curr[0]);

    this.setState({ edit: true, curr: curr[0] });
  };

  returnToHome = () => {
    this.setState({ edit: false });
  };

  updateArrayUser = user => {
    const { users } = this.state;
    let selectedIndex = users
      .map(function(e) {
        return e.ID;
      })
      .indexOf(user.ID);
    let tmpUsers = [...users];
    tmpUsers[selectedIndex] = user;
    this.setState({ users: tmpUsers });
  };

  componentDidMount = () => {
    this.getUsers();
  };
  render() {
    const { users, edit, curr } = this.state;
    return (
      <div>
        <Header edit={edit} />

        {!edit ? (
          <CardList users={users} editProfil={this.editProfil} />
        ) : (
          <EditCard
            selectedUser={curr}
            returnToHome={this.returnToHome}
            updateArrayUser={this.updateArrayUser}
          />
        )}
      </div>
    );
  }
}

export default App;
