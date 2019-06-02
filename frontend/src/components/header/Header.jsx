import React from "react";

const styles = {
  header: {
    height: 70,
    textAlign: "center",
    lineHeight: "70px",
    backgroundColor: "#4B4242",
    color: "#fff"
  }
};

export const Header = ({ edit }) => {
  const title = edit ? "Edit" : "Home";
  return <header style={styles.header}>{title}</header>;
};
