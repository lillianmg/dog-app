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
      <header>Is it safe to go for a walk?</header>
        <div className="container">
          <DogSizeDropdown handleInput={handleInput} />
        <SafeWalkTime />
      </div>
      <footer>
        Dog Walking App created by Lillian Gil and it is{" "}
        <a href="https://github.com/lillianmg/dog-app" target="_blank">
          open-sourced on GitHub
        </a>
      </footer>
    </div>
  );
}

export default App;

