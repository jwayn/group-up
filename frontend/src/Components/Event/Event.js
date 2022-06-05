import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { ReactComponent as UsersIcon } from "./users.svg";

import "./Event.css";

function Event() {
  const [eventVotes, setEventVotes] = useState([]);
  const [propositionVotes, setPropositionVotes] = useState([]);
  const [event, setEvent] = useState(null);
  const { eventurl } = useParams();

  useEffect(() => {
    const storedVotes = JSON.parse(window.localStorage.getItem("votes"));
    setEventVotes(storedVotes || []);

    updateEvent();
  }, []);

  const updateVotes = (event) => {
    if (event.target.checked) {
      setPropositionVotes([...propositionVotes, event.target.value]);
    } else {
      const newVotes = [...propositionVotes];
      newVotes.splice(newVotes.indexOf(event.target.value), 1);
      setPropositionVotes(newVotes);
    }
  };

  const updateEvent = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/event/${eventurl}`,
      {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const eventRes = await res.json();
    setEvent(eventRes);
  };

  const submitVotes = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/event/vote`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        votes: propositionVotes.map((propVote) => {
          return { propositionId: propVote };
        }),
      }),
    });

    if (res.ok) {
      window.localStorage.setItem(
        "votes",
        JSON.stringify([...eventVotes, event.id])
      );
      setEventVotes([...eventVotes, event.id]);

      updateEvent();
    }
  };

  if (event) {
    return (
      <div className="event-details">
        {event && <h2>{event.name}</h2>}
        {!eventVotes?.includes(event.id) ? (
          <div className="event-props">
            <h3>What dates work best for you?</h3>

            <div className="date-selection">
              {event.propositions &&
                event.propositions.map((proposition) => (
                  <div className="proposition" key={proposition.id}>
                    <label htmlFor={proposition.id}>
                      <input
                        type="checkbox"
                        name={proposition.id}
                        id={proposition.id}
                        onChange={updateVotes}
                        value={proposition.id}
                        className="prop-check"
                      />
                      {format(
                        new Date(proposition.datetime),
                        "EEEE LLL. do, y"
                      )}
                    </label>
                  </div>
                ))}
            </div>

            <button onClick={submitVotes} className="date-vote-btn">
              Submit
            </button>
          </div>
        ) : (
          <div className="voted-props">
            {event.propositions &&
              event.propositions
                .sort((a, b) => b._count.votes - a._count.votes)
                .map((proposition) => (
                  <div key={proposition.id} className="prop-line">
                    <span className="prop-votes">
                      {proposition._count.votes}
                      <UsersIcon />
                    </span>
                    <span className="prop-date">
                      {format(
                        new Date(proposition.datetime),
                        "EEEE LLL. do, y"
                      )}
                    </span>
                  </div>
                ))}
          </div>
        )}
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}

export default Event;
