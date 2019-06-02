import React from "react";
import editIcon from "../../../assets/edit.svg";
const styles = {
  card: {
    padding: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid rgba(112,112,112,.2)"
  },

  left: {
    display: "flex",
    alignItems: "center"
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: "#000"
  },
  name: {
    fontSize: 14,
    fontWeight: 500,
    margin: 0
  },
  email: {
    fontSize: 13,
    margin: 0
  },
  infos: {
    marginLeft: 20
  }
};

export const Card = () => {
  const { card, avatar, left, name, email, infos } = styles;
  return (
    <div style={card}>
      <div style={left}>
        <img src="" alt="" style={avatar} />
        <div style={infos}>
          <p style={name}>Anas Alami</p>
          <p style={email}>a@g.com</p>
        </div>
      </div>

      <img src={editIcon} alt="" width={20} />
    </div>
  );
};
