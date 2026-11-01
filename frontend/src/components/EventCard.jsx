import { useState } from "react";

function EventCard({ event, token }) {
  const [seatsLeft, setSeatsLeft] = useState(event.seats);
  const [message, setMessage] = useState("");

  async function handleRegister() {
    if (!token) {
      setMessage("Please log in first");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ eventId: event._id })
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Registration failed");
        return;
      }

      setSeatsLeft(seatsLeft - 1);
      setMessage("Registered!");
    } catch (err) {
      setMessage("Could not reach the server");
    }
  }

  return (
    <div className="event-card">
      <h3>{event.name}</h3>
      <p>Category: {event.category}</p>
      <p>Fee: {event.fee === 0 ? "Free" : `Rs. ${event.fee}`}</p>
      <p>Seats left: {seatsLeft}</p>
      {seatsLeft === 0 ? (
        <button disabled>SOLD OUT</button>
      ) : (
        <button onClick={handleRegister}>Register</button>
      )}
      {message && <p className="error-msg">{message}</p>}
    </div>
  );
}

export default EventCard;