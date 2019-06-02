import React from "react";
import { Card } from "./Card/Card";

export const CardList = ({ users }) => {
  return users.map((user, id) => {
    return <Card key={id} user={user} />;
  });
};
