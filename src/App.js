import React, { useState } from "react";
import "./App.css";
import DogSizeDropdown from "./components/DogSizeDropdown";
import SafeWalkTime from "./components/SafeWalkTime";


function App() {
  const [inputEntered, setInputEntered] = useState(false);

  const handleInput = () => {
    setInputEntered(true);
  };

  return (
    <div className="App">
      <div className="container">
        <header>Is it safe to go for a walk?</header>
        <DogSizeDropdown handleInput={handleInput} />
        <SafeWalkTime />
      </div>
      <footer>
        Dog Weather App created by Lillian Gil and it is{" "}
        <a href="https://github.com/lillianmg" target="_blank">
          open-sourced on GitHub
        </a>
      </footer>
    </div>
  );
}

export default App;

