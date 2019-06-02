import React from "react";
import editIcon from "../../../assets/edit.svg";
import "./card.css";
export const Card = props => {
  const { Name, Email, Avatar, ID } = props.user;
  return (
    <div className="card">
      <div className="left">
        <img src={Avatar} className="avatar" />
        <div className="infos">
          <p className="name">{Name}</p>
          <p className="email">{Email}</p>
        </div>
      </div>

      <div> </div>
      <img src={editIcon} alt="" width={20} />
    </div>
  );
};
