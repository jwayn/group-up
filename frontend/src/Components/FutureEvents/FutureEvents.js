import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as CopyIcon } from "./clipboard.svg";

import "./FutureEvents.css";

function FutureEvents() {
  const [events, setEvents] = useState([]);
  const [showCopiedText, setShowCopiedText] = useState(null);

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

  return (
    <div className="events">
      <h2>Your Events</h2>
      <div className="future-events">
        {events.length > 0 &&
          events.map((event) => (
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
                <button>X</button>
              </div>
            </div>
          ))}
      </div>

      <Link to="/new" className="new-event-btn">
        New Event
      </Link>
    </div>
  );
}

export default FutureEvents;
