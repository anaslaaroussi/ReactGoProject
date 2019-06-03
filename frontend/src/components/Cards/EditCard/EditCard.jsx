import React, { Component } from "react";
import "./edit.css";

import axios from "axios";
import { baseUrl } from "../../../contants/http";
class EditCard extends Component {
  constructor(props) {
    super(props);
    const { selectedUser } = props;
    this.state = {
      Avatar: selectedUser.Avatar,
      Name: selectedUser.Name,
      Email: selectedUser.Email,
      ID: selectedUser.ID
    };
  }

  componentDidMount() {
    window.addEventListener("online", function() {
      console.log("online");
    });
    window.addEventListener("offline", function() {
      console.log("offline");
    });
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  savePutRequests(url, payload) {
    const { puts, storePut } = this.props;

    storePut({ url: url, payload: payload, method: "PUT" });
    sessionStorage.setItem("puts", JSON.stringify(puts));
    console.log(JSON.parse(sessionStorage.getItem("puts")));
  }

  editSend = async e => {
    const { ID } = this.state;
    const { returnToHome, updateArrayUser } = this.props;
    e.preventDefault();
    console.log(this.state);

    // localStorage.setItem("form_data", this.state);
    axios
      .put(`${baseUrl}?id=${ID}`, this.state)
      .then(() => {
        console.log(this.state);
        updateArrayUser(this.state);
        returnToHome();
      })
      .catch(e => {
        this.savePutRequests(`${baseUrl}?id=${ID}`, this.state);
        updateArrayUser(this.state);
        returnToHome();
      });
  };

  handleChange = async event => {
    const target = event.target;
    const name = target.name;
    let value = target.value;
    if (name === "Avatar") {
      value = await this.getBase64(target.files[0]);
    }

    this.setState({ [name]: value });
  };
  render() {
    const { Avatar, Name, Email } = this.state;
    return (
      <form className="editCard" onSubmit={this.editSend}>
        <div className="avatarContainer">
          <input
            name="Avatar"
            type="file"
            className="inputFile"
            onChange={this.handleChange}
            accept="image/*"
          />
          <img src={Avatar} alt="" className="avP" height={30} width={30} />
        </div>

        <label htmlFor="">Name</label>
        <input
          type="text"
          name="Name"
          className="input"
          onChange={this.handleChange}
          value={Name}
        />
        <label htmlFor="">Email</label>
        <input
          type="text"
          className="input"
          name="Email"
          value={Email}
          onChange={this.handleChange}
        />
        <input
          type="submit"
          value="Submit"
          onChange={this.handleChange}
          className="submitButton"
        />
      </form>
    );
  }
}

export default EditCard;
