import ChallengeForm from "./components/ChallengeForm";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1>Societal Innovation Collaboration Portal</h1>
          <p>Citizen Challenge Submission</p>
        </div>
      </header>

      <main className="container">
        <ChallengeForm />
      </main>
    </div>
  );
}

export default App;
