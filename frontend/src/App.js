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
    curr: null,
    our_db: null,
    putStore: []
  };

  storePut = put => {
    let putStore = this.state.putStore;
    putStore.push(put);
    this.setState({ putStore });
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

  openDatabase() {
    var db = new Promise((resolve, reject) => {
      var indexedDBOpenRequest = indexedDB.open("form", 3);
      indexedDBOpenRequest.onerror = function(error) {
        // error creating db
        console.error("IndexedDB error:", error);
      };
      indexedDBOpenRequest.onupgradeneeded = function() {
        // This should only executes if there's a need to
        // create/update db.
        this.result.createObjectStore("post_requests", {
          autoIncrement: true,
          keyPath: "id"
        });
      };

      // This will execute each time the database is opened.
      indexedDBOpenRequest.onsuccess = function(e) {
        console.log(this.result);
        resolve(e.target.result);
      };
    });
    db.then(res => {
      this.setState({ our_db: res });
    });
  }
  componentDidMount = () => {
    this.openDatabase();
    this.getUsers();
  };
  render() {
    const { users, edit, curr, putStore } = this.state;
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
            storePut={this.storePut}
            puts={putStore}
          />
        )}
      </div>
    );
  }
}

export default App;
