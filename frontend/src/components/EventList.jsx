import EventCard from "./EventCard";

function EventList({ events, token }) {
  if (events.length === 0) {
    return <p>No events found.</p>;
  }

  return (
    <div className="event-grid">
      {events.map((event) => (
        <EventCard key={event._id} event={event} token={token} />
      ))}
    </div>
  );
}

export default EventList;