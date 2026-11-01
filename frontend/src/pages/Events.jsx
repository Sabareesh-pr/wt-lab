import {api} from "../api";
import { useState, useEffect } from "react";
import EventList from "../components/EventList";

function Events({ token }) {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api("/events")
      .then((res) => {if(!res.ok) throw new Error(); return res.json();})
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load events from server");
        setLoading(false);
      });
  }, []);

  const filteredEvents = events.filter((event) => {
    const nameMatches = event.name.toLowerCase().includes(search.toLowerCase());
    const categoryMatches = category === "All" || event.category === category;
    return nameMatches && categoryMatches;
  });

  return (
    <div className="page">
      <h1>Events</h1>
      <input
        type="text"
        aria-label="Search events"
        placeholder="Search events..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select aria-label="Filter category" value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="All">All</option>
        <option value="Technical">Technical</option>
        <option value="Workshop">Workshop</option>
        <option value="Cultural">Cultural</option>
        <option value="Sports">Sports</option>
      </select>

      {loading && <p>Loading events...</p>}
      {error && <p className="error-msg">{error}</p>}
      {!loading && !error && <EventList events={filteredEvents} token={token} />}
    </div>
  );
}

export default Events;