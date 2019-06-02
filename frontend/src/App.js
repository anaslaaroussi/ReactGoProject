import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Header } from "./components/header/Header";
import { Card } from "./components/Cards/Card/Card";

function App() {
  return (
    <div>
      <Header />
      <Card />
    </div>
  );
}

export default App;
