import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as CopyIcon } from "./clipboard.svg";
import { ReactComponent as DeleteIcon } from "../../delete.svg";

import "./FutureEvents.css";

function FutureEvents() {
  const [events, setEvents] = useState([]);
  const [showCopiedText, setShowCopiedText] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  useEffect(() => {
    window.localStorage.getItem("events")
      ? setEvents(JSON.parse(window.localStorage.getItem("events")))
      : setEvents([]);
  }, []);

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(window.location.href + url);
    setShowCopiedText(url);

    setTimeout(() => {
      setShowCopiedText(null);
    }, 1000);
  };

  const handleDeleteEvent = (event) => {
    const newEvents = [...events];
    newEvents.splice(newEvents.indexOf(event), 1);
    console.log(newEvents);
    setEvents(newEvents);
    window.localStorage.setItem("events", JSON.stringify(newEvents));
    setShowDeleteModal(null);
  };

  return (
    <div className="events">
      {events.length > 0 ? (
        <>
          <h2>Your Hosted Events</h2>
          <div className="future-events">
            {events.map((event) => (
              <div className="event" key={event.id}>
                <Link to={`/${event.url}`}>{event.name}</Link>
                <div className="event-buttons">
                  <button
                    className="copy-event-btn"
                    onClick={() => handleCopyLink(event.url)}
                  >
                    <CopyIcon />
                    <span
                      className={`copy-text ${
                        showCopiedText === event.url ? "text-visible" : ""
                      }`}
                    >
                      URL copied to clipboard!
                    </span>
                  </button>
                  <button
                    className="delete-event-btn"
                    onClick={() => setShowDeleteModal(event)}
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <h2>You have no events.</h2>
      )}

      <Link to="/new" className="new-event-btn">
        New Event
      </Link>

      {showDeleteModal && (
        <div className="delete-modal">
          <div className="delete-text">
            {`Are you should you want to delete ${showDeleteModal.name}?`}
          </div>

          <div className="delete-buttons">
            <button onClick={() => handleDeleteEvent(showDeleteModal)}>
              Yes
            </button>
            <button onClick={() => setShowDeleteModal(null)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FutureEvents;
