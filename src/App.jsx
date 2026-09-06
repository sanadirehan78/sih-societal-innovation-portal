import React from "react";
import ChallengeForm from "./components/ChallengeForm";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1>Societal Innovation Portal</h1>
          <p>
            Report problems and collaborate to build better communities.
          </p>
        </div>
      </header>

      <main className="container">
        <ChallengeForm />
      </main>
    </div>
  );
}

export default App;
