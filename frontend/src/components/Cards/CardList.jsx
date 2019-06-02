import React from "react";
import { Card } from "./Card/Card";

export const CardList = ({ users, editProfil }) => {
  return users.map((user, id) => {
    console.log(editProfil);
    return <Card key={id} user={user} editProfil={editProfil} />;
  });
};
