import "./NewEvent.css";
import { ReactComponent as DeleteIcon } from "../../delete.svg";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

function NewEvent() {
  const [name, setName] = useState("");
  const [propositions, setPropositions] = useState([]);
  const [showTimeSlot, setShowTimeSlot] = useState(false);
  const [startDate, setStartDate] = useState();
  const navigate = useNavigate();

  const closeTimeSlot = () => {
    setStartDate(null);
    setShowTimeSlot(false);
  };

  const saveProposition = () => {
    if (!startDate) return;
    let newProps = [...propositions, { datetime: startDate }];
    newProps = newProps.sort((a, b) => a.datetime - b.datetime);
    setPropositions(newProps);
    setStartDate(null);
    setShowTimeSlot(false);
  };

  const submitNewEvent = async () => {
    const eventData = { name, propositions };
    let eventUrl = `/api/event`;
    if (process.env.NODE_ENV === "development") {
      eventUrl = process.env.REACT_APP_API_URL + eventUrl;
    }
    const res = await fetch(eventUrl, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });
    if (res.ok) {
      const data = await res.json();
      let currentEvents = JSON.parse(window.localStorage.getItem("events"));
      let newEvents = [data];
      if (currentEvents) {
        newEvents.push(...currentEvents);
      }
      await window.localStorage.setItem("events", JSON.stringify(newEvents));
      navigate(`/${data.url}`);
    }
  };

  return (
    <div className="new-event">
      <div className="event-details">
        <div className="event-name-group">
          <input
            placeholder=" "
            className="event-name"
            name="name"
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="name" className="event-name-label">
            Event Name
          </label>
        </div>

        <div className="propositions">
          <h3>
            {propositions.length ? "Proposed Time Slots" : "Add a time slot"}
          </h3>
          {propositions.length > 0 && (
            <div className="proposition-items">
              {propositions.map((proposition, index) => (
                <div key={index} className="proposition-item">
                  <span>
                    {format(new Date(proposition.datetime), "EEEE LLL. do, y")}
                  </span>
                  <button
                    className="delete-proposition"
                    onClick={() => {
                      let newProps = [...propositions];
                      newProps.splice(newProps.indexOf(proposition), 1);
                      newProps = newProps.sort(
                        (a, b) => a.datetime - b.datetime
                      );
                      setPropositions(newProps);
                    }}
                  >
                    <DeleteIcon />
                  </button>
                </div>
              ))}
            </div>
          )}

          {!showTimeSlot ? (
            <button className="new-slot" onClick={() => setShowTimeSlot(true)}>
              New Time Slot
            </button>
          ) : (
            <div className="add-time-slot">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                minDate={new Date()}
                excludeDates={propositions.map(
                  (proposition) => proposition.datetime
                )}
              />
              <div className="time-slot-btn-container">
                <button className="cancel-time-slot" onClick={closeTimeSlot}>
                  Cancel
                </button>
                <button className="save-time-slot" onClick={saveProposition}>
                  Save Time Slot
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          className={`save-event ${
            !propositions.length || !name ? "btn-disabled" : ""
          }`}
          disabled={!propositions.length || !name}
          onClick={submitNewEvent}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default NewEvent;
