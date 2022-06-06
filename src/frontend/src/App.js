import "./App.css";

import FutureEvents from "./Components/FutureEvents";
import NewEvent from "./Components/NewEvent";
import Event from "./Components/Event";
import { Routes, Route } from "react-router-dom";

import { useState, useEffect } from "react";

function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (window.localStorage.getItem("events")) {
      setEvents(window.localStorage.getItem("events"));
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>group up</h1>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<FutureEvents events={events} />} />
          <Route path="/new" element={<NewEvent />} />
          <Route path="/:eventurl" element={<Event />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
